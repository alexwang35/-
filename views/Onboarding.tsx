import React, { useState } from 'react';
import { Lifestyle, UserProfile } from '../types';
import { COPYWRITING } from '../constants';
import { Button } from '../components/Button';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [lifestyle, setLifestyle] = useState<Lifestyle | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!height || !weight || !lifestyle || !age) return;

    const profile: UserProfile = {
      id: crypto.randomUUID(),
      age: parseInt(age),
      heightCm: parseFloat(height),
      weightKg: parseFloat(weight),
      lifestyle: lifestyle,
      createdAt: Date.now(),
    };

    onComplete(profile);
  };

  const isFormValid = height && weight && lifestyle && age;

  return (
    <div className="flex-1 px-8 pt-12 pb-8 flex flex-col justify-between animate-fade-in">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            {COPYWRITING.onboarding.title}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            {COPYWRITING.onboarding.subtitle}
          </p>
        </div>

        <form className="space-y-6 mt-8">
           {/* Age Input (Full Width) */}
           <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1">
                {COPYWRITING.onboarding.ageLabel}
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-center"
              />
            </div>

          {/* Height/Weight Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1">
                {COPYWRITING.onboarding.heightLabel}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-center"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1">
                {COPYWRITING.onboarding.weightLabel}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-xl font-medium focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all text-center"
              />
            </div>
          </div>

          {/* Lifestyle Selection */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1">
              {COPYWRITING.onboarding.lifestyleLabel}
            </label>
            <div className="flex flex-col gap-3">
              {(Object.keys(Lifestyle) as Array<keyof typeof Lifestyle>).map((ls) => (
                <button
                  key={ls}
                  type="button"
                  onClick={() => setLifestyle(Lifestyle[ls])}
                  className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 ${
                    lifestyle === Lifestyle[ls]
                      ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                      : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-[15px] font-medium">
                    {COPYWRITING.lifestyleOptions[Lifestyle[ls]]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <Button onClick={handleSubmit} disabled={!isFormValid}>
          {COPYWRITING.onboarding.button}
        </Button>
      </div>
    </div>
  );
};
