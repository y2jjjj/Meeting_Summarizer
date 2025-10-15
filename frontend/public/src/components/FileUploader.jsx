import React, { useRef } from 'react';
import { Upload, FileAudio } from 'lucide-react';

function FileUploader({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-indigo-400 transition-all">
      <div className="flex flex-col items-center gap-4">
        <div className="p-6 rounded-full bg-gray-100">
          <Upload className="w-12 h-12 text-gray-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800">Upload Audio File</h3>
        
        <p className="text-sm text-gray-600 text-center">
          Supported formats: WAV, MP3, M4A, OGG, FLAC
        </p>
        
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Choose File
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default FileUploader;
