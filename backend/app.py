from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from groq import Groq
import tempfile

app = Flask(__name__)
CORS(app)

# Configure APIs - Using Groq for free LLM and Groq's Whisper for transcription
groq_client = Groq(api_key=os.getenv('GROQ_API_KEY'))

@app.route('/api/summarize', methods=['POST'])
def summarize_meeting():
    """
    Main endpoint to process audio files
    """
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
    
    audio_file = request.files['audio']
    
    if audio_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    try:
        # Save audio file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.filename)[1]) as temp_audio:
            audio_file.save(temp_audio.name)
            temp_audio_path = temp_audio.name
        
        # Step 1: Transcribe audio using Groq's Whisper
        print("Transcribing audio...")
        transcript = transcribe_audio(temp_audio_path)
        
        # Step 2: Generate summary using Groq's LLM
        print("Generating summary...")
        summary_data = generate_summary(transcript)
        
        # Clean up temporary file
        os.unlink(temp_audio_path)
        
        return jsonify({
            'transcript': transcript,
            'summary': summary_data['summary'],
            'action_items': summary_data['action_items'],
            'key_decisions': summary_data['key_decisions']
        })
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def transcribe_audio(audio_path):
    """
    Transcribe audio using Groq's Whisper API (free)
    """
    try:
        with open(audio_path, 'rb') as audio_file:
            transcription = groq_client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-large-v3",
                response_format="text"
            )
        return transcription
    except Exception as e:
        raise Exception(f"Transcription failed: {str(e)}")

def generate_summary(transcript):
    """
    Generate summary, action items, and key decisions using Groq's LLM
    """
    try:
        prompt = f"""You are an expert meeting summarizer. Analyze the following meeting transcript and provide:

1. A concise summary of the meeting (2-3 paragraphs)
2. Action items with responsible parties if mentioned
3. Key decisions made during the meeting

Format your response exactly as follows:

SUMMARY:
[Your summary here]

ACTION ITEMS:
[List action items, one per line, with bullet points]

KEY DECISIONS:
[List key decisions, one per line, with bullet points]

Meeting Transcript:
{transcript}"""

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Free tier model
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert at summarizing meetings and extracting actionable insights."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=2000
        )
        
        result = response.choices[0].message.content
        
        # Parse the response
        summary = ""
        action_items = ""
        key_decisions = ""
        
        sections = result.split('\n\n')
        current_section = None
        
        for section in sections:
            if 'SUMMARY:' in section:
                current_section = 'summary'
                summary = section.replace('SUMMARY:', '').strip()
            elif 'ACTION ITEMS:' in section:
                current_section = 'action_items'
                action_items = section.replace('ACTION ITEMS:', '').strip()
            elif 'KEY DECISIONS:' in section:
                current_section = 'key_decisions'
                key_decisions = section.replace('KEY DECISIONS:', '').strip()
            elif current_section == 'summary':
                summary += '\n\n' + section
            elif current_section == 'action_items':
                action_items += '\n\n' + section
            elif current_section == 'key_decisions':
                key_decisions += '\n\n' + section
        
        return {
            'summary': summary.strip() or "No summary generated",
            'action_items': action_items.strip() or "No action items identified",
            'key_decisions': key_decisions.strip() or "No key decisions identified"
        }
    
    except Exception as e:
        raise Exception(f"Summary generation failed: {str(e)}")

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    # Check if API key is set
    if not os.getenv('GROQ_API_KEY'):
        print("WARNING: GROQ_API_KEY environment variable not set")
    
    app.run(debug=True, port=5000)
