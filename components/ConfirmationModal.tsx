import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonVariant?: 'primary' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmButtonVariant = "primary"
}) => {
  if (!isOpen) return null;

  const confirmButtonClasses = {
      primary: "bg-indigo-600 hover:bg-indigo-500",
      danger: "bg-red-600 hover:bg-red-500",
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 text-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700 transform transition-all duration-300 ease-out scale-95 animate-modal-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-teal-300">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <p className="text-gray-300 mb-8 leading-relaxed">{message}</p>
        
        <div className="flex justify-end gap-4">
            <button
                onClick={onClose}
                className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors duration-200 shadow-md"
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                className={`text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md ${confirmButtonClasses[confirmButtonVariant]}`}
            >
                {confirmText}
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-fast {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-fast {
          animation: fade-in-fast 0.2s ease-out forwards;
        }
        @keyframes modal-pop-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-pop-in {
          animation: modal-pop-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;