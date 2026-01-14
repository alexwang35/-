import React from 'react';
import { AppMode } from '../types';
import { COPYWRITING } from '../constants';

interface ModeSwitchProps {
  currentMode: AppMode;
  onSwitch: (mode: AppMode) => void;
}

export const ModeSwitch: React.FC<ModeSwitchProps> = ({ currentMode, onSwitch }) => {
  return (
    <div className="bg-gray-100/80 p-1 rounded-2xl flex relative backdrop-blur-sm">
      <div 
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${
            currentMode === AppMode.ABSTINENCE ? 'left-1' : 'left-[calc(50%+2px)]'
        }`}
      />
      
      <button 
        onClick={() => onSwitch(AppMode.ABSTINENCE)}
        className={`flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors duration-300 ${
            currentMode === AppMode.ABSTINENCE ? 'text-gray-900' : 'text-gray-500'
        }`}
      >
        {COPYWRITING.modes.abstinence}
      </button>
      
      <button 
        onClick={() => onSwitch(AppMode.HEALTH)}
        className={`flex-1 relative z-10 py-2.5 text-sm font-medium transition-colors duration-300 ${
            currentMode === AppMode.HEALTH ? 'text-gray-900' : 'text-gray-500'
        }`}
      >
        {COPYWRITING.modes.health}
      </button>
    </div>
  );
};
