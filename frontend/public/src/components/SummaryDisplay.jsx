import React from 'react';
import { CheckCircle, Clock, User, Download, AlertTriangle } from 'lucide-react';

function SummaryDisplay({ data }) {
  const downloadReport = () => {
    const content = `MEETING SUMMARY REPORT
Generated: ${new Date().toLocaleString()}

=== EXECUTIVE SUMMARY ===
${data.summary}

=== KEY DECISIONS ===
${data.key_decisions.map((d, i) => `${i + 1}. ${d}`).join('\n')}

=== ACTION ITEMS ===
${data.action_items.map((item, i) => 
  `${i + 1}. ${item.task}
   Owner: ${item.owner}
   Deadline: ${item.deadline}
   Priority: ${item.priority}`
).join('\n\n')}

=== FULL TRANSCRIPT ===
${data.transcript}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Executive Summary</h2>
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
        </div>
        <p className="text-gray-700 text-lg leading-relaxed">{data.summary}</p>
      </div>

      {/* Key Decisions */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Decisions</h2>
        <div className="space-y-3">
          {data.key_decisions.map((decision, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-800 text-lg">{decision}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Action Items</h2>
        <div className="space-y-4">
          {data.action_items.map((item, idx) => (
            <div key={idx} className="border-l-4 border-indigo-500 bg-gray-50 rounded-r-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.task}</h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium">Owner:</span> {item.owner}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium">Deadline:</span> {item.deadline}
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SummaryDisplay;
