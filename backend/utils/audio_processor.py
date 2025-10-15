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
                audio = AudioSegment.from_file(audio_path, format='m4a')
            elif file_ext == 'ogg':
                audio = AudioSegment.from_ogg(audio_path)
            elif file_ext == 'flac':
                audio = AudioSegment.from_file(audio_path, format='flac')
            else:
                audio = AudioSegment.from_file(audio_path)
            
            # Convert to mono and set sample rate
            audio = audio.set_channels(1).set_frame_rate(self.sample_rate)
            
            # Generate output path
            output_path = audio_path.rsplit('.', 1)[0] + '_processed.wav'
            
            # Export as WAV
            audio.export(output_path, format='wav')
            
            return output_path
        
        except Exception as e:
            raise Exception(f"Audio processing failed: {str(e)}")
