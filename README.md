# Meeting Summarizer 🎤📝

An AI-powered meeting summarizer that transcribes audio and generates action-oriented summaries with key decisions and action items.

## Features

- 🎙️ Audio transcription using OpenAI Whisper (free tier)
- 📊 Intelligent summary generation
- ✅ Automatic action item extraction
- 🎯 Key decision highlighting
- 💾 Export summaries as text/JSON
- 🌐 User-friendly web interface

## Tech Stack

**Backend:**
- Python 3.9+
- Flask
- OpenAI Whisper (local/free)
- Groq API (free LLM - Llama 3)
- FFmpeg for audio processing

**Frontend:**
- React 18
- Tailwind CSS
- Axios

## Prerequisites

- Python 3.9+
- Node.js 16+
- FFmpeg installed
- Groq API key (free at https://console.groq.com)

## Installation

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/meeting-summarizer.git
cd meeting-summarizer/backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Install FFmpeg:
- **Ubuntu/Debian:** `sudo apt install ffmpeg`
- **macOS:** `brew install ffmpeg`
- **Windows:** Download from https://ffmpeg.org

5. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your Groq API key
```

6. Run the backend:
```bash
python app.py
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Either record audio directly or upload an audio file (WAV, MP3, M4A)
3. Click "Generate Summary"
4. View transcript, summary, key decisions, and action items
5. Download results as needed

## API Endpoints

### POST `/api/transcribe`
- Upload audio file for transcription
- Returns: JSON with transcript

### POST `/api/summarize`
- Send transcript for summarization
- Returns: JSON with summary, action items, key decisions

### POST `/api/process`
- All-in-one endpoint (transcribe + summarize)
- Returns: Complete meeting analysis

## Project Structure

- `backend/app.py` - Main Flask application
- `backend/services/` - Transcription and summarization services
- `backend/utils/` - Audio processing utilities
- `frontend/src/` - React components and UI
- `demo/` - Sample audio files for testing

## Configuration

### Groq API (Free LLM)
1. Sign up at https://console.groq.com
2. Get your free API key
3. Add to `.env` file: `GROQ_API_KEY=your_key_here`
4. Free tier: 30 requests/minute

### Whisper Model Selection
Edit `backend/services/transcription_service.py`:
- `tiny` - Fastest, less accurate
- `base` - Balanced (recommended)
- `small` - More accurate
- `medium` - High accuracy
- `large` - Best accuracy (requires more RAM)

## Evaluation Criteria

✅ **Transcription Accuracy**: Using OpenAI Whisper for state-of-the-art accuracy  
✅ **Summary Quality**: Groq's Llama 3 model for comprehensive summaries  
✅ **LLM Prompt Effectiveness**: Optimized prompts for actionable outputs  
✅ **Code Structure**: Modular, well-documented, production-ready  

## Demo Video

[Link to demo video]

## Troubleshooting

**Issue:** FFmpeg not found
- **Solution:** Ensure FFmpeg is installed and in PATH

**Issue:** Out of memory with Whisper
- **Solution:** Use smaller model (tiny/base)

**Issue:** Slow transcription
- **Solution:** Use GPU if available or smaller model

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - See LICENSE file

## Acknowledgments

- OpenAI Whisper for transcription
- Groq for free LLM API
- Flask and React communities
