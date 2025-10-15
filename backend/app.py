from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from services.transcription_service import TranscriptionService
from services.summarization_service import SummarizationService
from utils.audio_processor import AudioProcessor

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'ogg', 'flac'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize services
transcription_service = TranscriptionService()
summarization_service = SummarizationService()
audio_processor = AudioProcessor()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Meeting Summarizer API is running'})

@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: WAV, MP3, M4A, OGG, FLAC'}), 400
        
        # Save file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Process audio (convert if needed)
        processed_path = audio_processor.process(filepath)
        
        # Transcribe
        transcript = transcription_service.transcribe(processed_path)
        
        # Cleanup
        os.remove(filepath)
        if processed_path != filepath:
            os.remove(processed_path)
        
        return jsonify({'transcript': transcript})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/summarize', methods=['POST'])
def summarize_transcript():
    try:
        data = request.get_json()
        
        if 'transcript' not in data:
            return jsonify({'error': 'No transcript provided'}), 400
        
        transcript = data['transcript']
        
        # Generate summary
        result = summarization_service.summarize(transcript)
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/process', methods=['POST'])
def process_meeting():
    """All-in-one endpoint: transcribe and summarize"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        file = request.files['audio']
        
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file'}), 400
        
        # Save and process audio
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        processed_path = audio_processor.process(filepath)
        
        # Transcribe
        transcript = transcription_service.transcribe(processed_path)
        
        # Summarize
        summary_result = summarization_service.summarize(transcript)
        
        # Cleanup
        os.remove(filepath)
        if processed_path != filepath:
            os.remove(processed_path)
        
        # Combine results
        result = {
            'transcript': transcript,
            **summary_result
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
