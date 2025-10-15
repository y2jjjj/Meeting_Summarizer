import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';
import FileUploader from './components/FileUploader';
import TranscriptDisplay from './components/TranscriptDisplay';
import SummaryDisplay from './components/SummaryDisplay';
import { FileAudio, Loader } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [processingStep, setProcessingStep] = useState('');

  const handleAudioReady = (file) => {
    setAudioFile(file);
    setError(null);
    setResult(null);
  };

  const processAudio = async () => {
    if (!audioFile) {
      setError('Please record or upload audio first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStep('Uploading audio...');

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      setProcessingStep('Transcribing audio...');
      
      const response = await axios.post(`${API_URL}/api/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout
      });

      setProcessingStep('Generating summary...');
      setResult(response.data);
      setProcessingStep('');
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.response?.data?.error || err.message || 'Processing failed');
      setProcessingStep('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <FileAudio className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">Meeting Summarizer</h1>
          </div>
          <p className="text-gray-600 text-lg">
            AI-powered transcription and summarization for your meetings
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload or Record Audio</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <AudioRecorder onAudioReady={handleAudioReady} />
            <FileUploader onFileSelect={handleAudioReady} />
          </div>

          {audioFile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">
                ✓ Audio ready: {audioFile.name || 'Recorded audio'}
              </p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={processAudio}
              disabled={!audioFile || isProcessing}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none shadow-lg"
            >
              {isProcessing ? (
                <span className="flex items-center gap-3">
                  <Loader className="w-6 h-6 animate-spin" />
                  {processingStep || 'Processing...'}
                </span>
              ) : (
                'Generate Summary'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium">❌ Error: {error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            <SummaryDisplay data={result} />
            <TranscriptDisplay transcript={result.transcript} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
