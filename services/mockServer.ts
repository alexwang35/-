import { LeaderboardEntry } from '../types';

/**
 * ==========================================
 * 模拟后端服务器 (Mock Server)
 * ==========================================
 * 在真实 App 中，这里会替换为 Fetch/Axios 调用
 */

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'u1', displayName: 'User_9527', currentStreak: 45, totalCheckins: 120, rank: 1 },
  { id: 'u2', displayName: 'Zen_Master', currentStreak: 32, totalCheckins: 89, rank: 2 },
  { id: 'u3', displayName: 'Clean_Life', currentStreak: 28, totalCheckins: 60, rank: 3 },
  { id: 'u4', displayName: 'Focus_One', currentStreak: 14, totalCheckins: 45, rank: 4 },
  { id: 'u5', displayName: 'User_8888', currentStreak: 7, totalCheckins: 30, rank: 5 },
];

export const MockServer = {
  // 获取排行榜
  fetchLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_LEADERBOARD);
      }, 800); // 模拟网络延迟
    });
  },

  // 同步数据 (上传记录)
  syncData: async (records: any, userId: string): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      console.log(`[Server] Syncing records for user ${userId}...`, records);
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
};
