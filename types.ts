/**
 * ==========================================
 * 核心数据模型定义 (Domain Models)
 * ==========================================
 */

// --- 应用模式 ---
export enum AppMode {
  ABSTINENCE = 'ABSTINENCE', // 戒色模式 (打卡 + 排行榜)
  HEALTH = 'HEALTH',         // 健康模式 (科学频率 + 周期管理)
}

// --- 基础枚举 ---

export enum Lifestyle {
  SEDENTARY = 'SEDENTARY', // 久坐
  STANDING = 'STANDING',   // 久站
  ACTIVE = 'ACTIVE',       // 经常运动
}

export enum ActivityStatus {
  COMPLETED = 'COMPLETED', // 已完成/打卡
  REST = 'REST',           // 休息/未发生
  SKIPPED = 'SKIPPED',     // 建议但未完成
}

// --- 用户档案 ---

export interface UserProfile {
  id: string;
  age: number;      // 新增: 年龄
  heightCm: number;
  weightKg: number;
  lifestyle: Lifestyle;
  createdAt: number;
}

// --- 健康模型配置 (Config Interface) ---

export interface HealthModelConfig {
  bmiWeights: {
    underweight: number;
    normal: number;
    overweight: number;
    obese: number;
  };
  lifestyleMultipliers: {
    [key in Lifestyle]: number;
  };
  ageDecay: {
    baseAge: number;      // 基准年龄 (如 20 岁)
    decayPerYear: number; // 每年衰减系数
  };
  baseFrequencyPerWeek: number;
}

// --- 计算结果 ---

export interface HealthRecommendation {
  minFrequencyWeekly: number;
  maxFrequencyWeekly: number;
  cycleDays: number; // 建议周期天数 (如: 每 3 天一次)
  description: string;
  healthTips: string[];
}

// --- 日历与记录 ---

export interface DailyRecord {
  date: string; // ISO YYYY-MM-DD
  status: ActivityStatus;
  source: 'MANUAL' | 'NOTIFICATION'; // 记录来源
  modeAtTime: AppMode; // 记录时的模式
}

// --- 排行榜 (Server Data) ---

export interface LeaderboardEntry {
  id: string;
  displayName: string; // 匿名 ID
  currentStreak: number;
  totalCheckins: number;
  rank: number;
}

export interface AppState {
  hasOnboarded: boolean;
  mode: AppMode; // 当前模式
  profile: UserProfile | null;
  recommendation: HealthRecommendation | null;
  records: Record<string, DailyRecord>;
  leaderboard: LeaderboardEntry[]; // 本地缓存的排行榜
  lastSyncTime: number;
}
