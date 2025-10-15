import React, { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';

function AudioRecorder({ onAudioReady }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const file = new File([blob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
        onAudioReady(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      alert('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-indigo-400 transition-all">
      <div className="flex flex-col items-center gap-4">
        <div className={`p-6 rounded-full ${isRecording ? 'bg-red-100' : 'bg-gray-100'}`}>
          <Mic className={`w-12 h-12 ${isRecording ? 'text-red-600 animate-pulse' : 'text-gray-500'}`} />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800">Record Audio</h3>
        
        {isRecording && (
          <div className="text-2xl font-mono text-red-600">
            {formatTime(recordingTime)}
          </div>
        )}
        
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <Square className="w-5 h-5" />
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
}

export default AudioRecorder;
