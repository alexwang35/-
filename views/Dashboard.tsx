import React, { useEffect, useState } from 'react';
import { UserProfile, HealthRecommendation, AppState, ActivityStatus, AppMode } from '../types';
import { COPYWRITING, NOTIFICATION_CONFIG } from '../constants';
import { Button } from '../components/Button';
import { ModeSwitch } from '../components/ModeSwitch';
import { MockServer } from '../services/mockServer';

interface DashboardProps {
  user: UserProfile;
  recommendation: HealthRecommendation;
  state: AppState;
  onRecordActivity: (status: ActivityStatus) => void;
  onSwitchMode: (mode: AppMode) => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  recommendation, 
  state,
  onRecordActivity, 
  onSwitchMode,
  onReset 
}) => {
  const today = new Date().toISOString().split('T')[0];
  const hasRecordedToday = !!state.records[today];
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 模拟下拉刷新/数据同步
  useEffect(() => {
    if (state.mode === AppMode.ABSTINENCE && state.leaderboard.length === 0) {
        setIsRefreshing(true);
        MockServer.fetchLeaderboard().then(() => setIsRefreshing(false));
    }
  }, [state.mode]);

  // 计算连续打卡 (简化版逻辑)
  const calculateStreak = () => {
      let streak = 0;
      const todayDate = new Date();
      // 检查过去30天
      for (let i = 0; i < 30; i++) {
          const d = new Date(todayDate);
          d.setDate(todayDate.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          // 戒色模式：REST(休息/未做) 算打卡成功; 健康模式：COMPLETED 算打卡
          const valid = state.mode === AppMode.ABSTINENCE 
            ? (state.records[dateStr]?.status === ActivityStatus.REST || state.records[dateStr]?.status === ActivityStatus.COMPLETED)
            : (state.records[dateStr]?.status === ActivityStatus.COMPLETED);
          
          if (valid) streak++;
          else if (i > 0) break; // 断签
      }
      return streak;
  };

  const currentStreak = calculateStreak();

  // --- 视图：戒色模式 ---
  const renderAbstinenceMode = () => (
    <div className="space-y-6 animate-fade-in">
        {/* Streak Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-8 text-center shadow-xl shadow-gray-300">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-2">当前连续</p>
            <h1 className="text-7xl font-bold tracking-tighter mb-2">{currentStreak}</h1>
            <p className="text-gray-400 text-sm">DAYS</p>
        </div>

        {/* Action Button */}
        {!hasRecordedToday ? (
            <Button onClick={() => onRecordActivity(ActivityStatus.REST)} className="bg-white text-black border border-gray-100 hover:bg-gray-50">
                {COPYWRITING.dashboard.markCompleted}
            </Button>
        ) : (
            <div className="p-4 bg-green-50 text-green-700 text-center rounded-2xl text-sm font-medium">
                今日目标已达成
            </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                {COPYWRITING.dashboard.leaderboardTitle}
            </h3>
            <div className="space-y-4">
                {state.leaderboard.length === 0 ? (
                    <div className="text-center py-4 text-gray-400 text-sm">加载中...</div>
                ) : (
                    state.leaderboard.map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-3">
                                <span className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${entry.rank <= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {entry.rank}
                                </span>
                                <span className="text-gray-700 font-medium">{entry.displayName}</span>
                            </div>
                            <span className="text-gray-400 font-mono">{entry.currentStreak}d</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
  );

  // --- 视图：健康模式 ---
  const renderHealthMode = () => (
    <div className="space-y-6 animate-fade-in">
        {/* Recommendation Card */}
        <section className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-gray-200/40 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                 <div>
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        {COPYWRITING.dashboard.frequencyTitle}
                    </p>
                    <div className="flex items-baseline space-x-1">
                        <span className="text-4xl font-semibold text-[#1d1d1f] tracking-tight">
                            {recommendation.cycleDays}
                        </span>
                        <span className="text-base text-gray-500 font-medium">天 / 周期</span>
                    </div>
                 </div>
                 <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                 </div>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-blue-500 pl-3">
                {recommendation.description}
            </p>
        </section>

        {/* Calendar Strip (Simplified for Mobile) */}
        <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 ml-1">最近7天</h3>
            <div className="flex justify-between items-center bg-white rounded-2xl p-4 shadow-sm">
                 {Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (6 - i));
                    const dateStr = d.toISOString().split('T')[0];
                    const record = state.records[dateStr];
                    const isToday = i === 6;
                    
                    let bgClass = "bg-gray-100";
                    let textClass = "text-gray-400";
                    
                    if (record?.status === ActivityStatus.COMPLETED) {
                        bgClass = "bg-blue-500";
                        textClass = "text-white";
                    } else if (record?.status === ActivityStatus.REST) {
                        bgClass = "bg-green-100";
                        textClass = "text-green-600";
                    }

                    return (
                        <div key={i} className="flex flex-col items-center space-y-2">
                             <span className="text-[10px] text-gray-300 font-medium">{d.getDate()}</span>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${bgClass} ${textClass} ${isToday ? 'ring-2 ring-offset-2 ring-gray-200' : ''}`}>
                                 {record?.status === ActivityStatus.COMPLETED ? '✓' : ''}
                             </div>
                        </div>
                    );
                 })}
            </div>
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
             <Button variant="secondary" onClick={() => onRecordActivity(ActivityStatus.REST)}>
                {COPYWRITING.dashboard.markRest}
             </Button>
             <Button onClick={() => onRecordActivity(ActivityStatus.COMPLETED)}>
                {COPYWRITING.dashboard.markCompleted}
             </Button>
        </div>
    </div>
  );

  return (
    <div className="flex-1 px-6 pt-6 pb-8 overflow-y-auto no-scrollbar flex flex-col h-full">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                {new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
            </p>
            <h2 className="text-2xl font-bold text-[#1d1d1f]">{COPYWRITING.dashboard.greeting}</h2>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
             {/* Avatar Placeholder */}
             <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                 {user.heightCm.toString()[0]}
             </div>
        </div>
      </header>

      {/* Mode Switcher */}
      <div className="mb-8">
        <ModeSwitch currentMode={state.mode} onSwitch={onSwitchMode} />
      </div>

      {/* Content Area */}
      <div className="flex-1">
         {state.mode === AppMode.ABSTINENCE ? renderAbstinenceMode() : renderHealthMode()}
      </div>

      {/* Footer Debug */}
      <div className="mt-8 text-center">
          <button onClick={onReset} className="text-[10px] text-gray-300 underline">
              Reset Data
          </button>
      </div>

    </div>
  );
};
