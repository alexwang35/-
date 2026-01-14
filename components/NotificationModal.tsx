import React from 'react';
import { NOTIFICATION_CONFIG } from '../constants';
import { Button } from './Button';

interface NotificationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onDeny: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onConfirm, onDeny }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-sm rounded-3xl p-6 shadow-2xl transform transition-all scale-100 relative z-10 border border-white/50">
        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">健康周期提醒</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
            {NOTIFICATION_CONFIG.messages.prompt}
        </p>
        
        <div className="flex gap-4">
             <button 
                onClick={onDeny}
                className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
             >
                未完成
             </button>
             <button 
                onClick={onConfirm}
                className="flex-1 py-3.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-black transition-colors shadow-lg shadow-gray-200"
             >
                已完成
             </button>
        </div>
      </div>
    </div>
  );
};
