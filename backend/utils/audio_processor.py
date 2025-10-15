import os
from pydub import AudioSegment

class AudioProcessor:
    def __init__(self):
        self.target_format = 'wav'
        self.sample_rate = 16000
    
    def process(self, audio_path):
        """
        Process audio file: convert to WAV if needed and normalize
        
        Args:
            audio_path (str): Path to input audio file
            
        Returns:
            str: Path to processed audio file
        """
        try:
            file_ext = audio_path.rsplit('.', 1)[1].lower()
            
            # If already WAV, return as-is
            if file_ext == 'wav':
                return audio_path
            
            # Load audio file
            if file_ext == 'mp3':
                audio = AudioSegment.from_mp3(audio_path)
            elif file_ext == 'm4a':
                audio = AudioSegment.from_file(audio_path,
