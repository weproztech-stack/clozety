
import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border ${bgColors[type]} shadow-lg`}>
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="text-sm font-medium text-zinc-900">{message}</p>
      </div>
      <button onClick={onClose} className="ml-4 text-zinc-400 hover:text-zinc-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;