import whisper
import os
from dotenv import load_dotenv

load_dotenv()

class TranscriptionService:
    def __init__(self):
        model_size = os.getenv('WHISPER_MODEL', 'base')
        print(f"Loading Whisper model: {model_size}")
        self.model = whisper.load_model(model_size)
        print("Whisper model loaded successfully")
    
    def transcribe(self, audio_path):
        """
        Transcribe audio file using Whisper
        
        Args:
            audio_path (str): Path to audio file
            
        Returns:
            str: Transcribed text
        """
        try:
            print(f"Transcribing audio: {audio_path}")
            result = self.model.transcribe(audio_path)
            transcript = result['text'].strip()
            print(f"Transcription completed. Length: {len(transcript)} characters")
            return transcript
        except Exception as e:
            raise Exception(f"Transcription failed: {str(e)}")
