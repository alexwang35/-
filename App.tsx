import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { NotificationModal } from './components/NotificationModal';
import { AppState, UserProfile, ActivityStatus, AppMode } from './types';
import { calculateRecommendation } from './services/healthEngine';
import { MockServer } from './services/mockServer';

const STORAGE_KEY = 'zenith_app_v2';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    hasOnboarded: false,
    mode: AppMode.HEALTH,
    profile: null,
    recommendation: null,
    records: {},
    leaderboard: [],
    lastSyncTime: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  // 1. 初始化加载
  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState(parsed);
          
          // 加载排行榜
          const leaderboardData = await MockServer.fetchLeaderboard();
          setState(prev => ({ ...prev, leaderboard: leaderboardData }));

          // --- 模拟通知逻辑 ---
          // 检查昨天是否有记录，如果没有，且处于周期关键点，则弹窗
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (!parsed.records[yesterdayStr] && parsed.mode === AppMode.HEALTH) {
             // 简单的模拟：如果昨天没记录，就弹窗询问 (真实逻辑会根据 Notification Config 判断)
             setTimeout(() => setShowNotification(true), 1500); 
          }

        } catch (e) {
          console.error("Failed to load state", e);
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  // 2. 持久化保存
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoading]);

  // 处理注册
  const handleOnboardingComplete = (profile: UserProfile) => {
    const recommendation = calculateRecommendation(profile);
    setState(prev => ({
      ...prev,
      hasOnboarded: true,
      profile,
      recommendation,
    }));
  };

  // 处理活动记录
  const handleRecordActivity = (status: ActivityStatus, source: 'MANUAL' | 'NOTIFICATION' = 'MANUAL') => {
    const dateStr = source === 'NOTIFICATION' 
        ? (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split('T')[0]; })() // 补录昨天的
        : new Date().toISOString().split('T')[0];

    setState(prev => ({
      ...prev,
      records: {
        ...prev.records,
        [dateStr]: {
          date: dateStr,
          status,
          source,
          modeAtTime: prev.mode
        }
      }
    }));

    // 触发模拟同步
    if (state.profile) {
        MockServer.syncData({ date: dateStr, status }, state.profile.id);
    }
  };

  // 切换模式
  const handleSwitchMode = (mode: AppMode) => {
      setState(prev => ({ ...prev, mode }));
  };

  const handleReset = () => {
    if(confirm('确定重置所有数据吗？')) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }
  };

  if (isLoading) return null;

  return (
    <Layout>
      {/* 模拟 Action Notification Modal */}
      <NotificationModal 
        isOpen={showNotification}
        onConfirm={() => {
            handleRecordActivity(ActivityStatus.COMPLETED, 'NOTIFICATION');
            setShowNotification(false);
        }}
        onDeny={() => {
            handleRecordActivity(ActivityStatus.REST, 'NOTIFICATION');
            setShowNotification(false);
        }}
      />

      {!state.hasOnboarded || !state.profile || !state.recommendation ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard 
          user={state.profile}
          recommendation={state.recommendation}
          state={state}
          onRecordActivity={handleRecordActivity}
          onSwitchMode={handleSwitchMode}
          onReset={handleReset}
        />
      )}
    </Layout>
  );
};

export default App;
