import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

function TranscriptDisplay({ transcript }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4 hover:bg-gray-50 p-4 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-800">Full Transcript</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-6 h-6 text-gray-600" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto border border-gray-200">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
            {transcript}
          </p>
        </div>
      )}
    </div>
  );
}

export default TranscriptDisplay;
