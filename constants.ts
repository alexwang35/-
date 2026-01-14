import { HealthModelConfig, Lifestyle } from './types';

/**
 * ==========================================
 * 系统配置中心 (Configuration Center)
 * ==========================================
 */

// --- 健康模型参数 (核心算法配置) ---

export const HEALTH_MODEL_CONFIG: HealthModelConfig = {
  bmiWeights: {
    underweight: 0.9,
    normal: 1.0,
    overweight: 0.95,
    obese: 0.85,
  },
  lifestyleMultipliers: {
    [Lifestyle.SEDENTARY]: 0.9,
    [Lifestyle.STANDING]: 1.0,
    [Lifestyle.ACTIVE]: 1.2,
  },
  ageDecay: {
    baseAge: 25,
    decayPerYear: 0.02, // 25岁后每增加1岁，频率基数衰减 2%
  },
  baseFrequencyPerWeek: 3.0, // 25岁基准
};

// --- 通知规则配置 (Notification Rules) ---
export const NOTIFICATION_CONFIG = {
  cycleCheckDay: 4, // 在周期的第4天询问前3天的情况 (假设周期是3天)
  messages: {
    prompt: "根据您的健康周期，昨日是否完成了既定目标？",
    abstinenceEncourage: "坚持就是胜利，保持今天的记录！",
    healthEncourage: "顺应身体的自然节律，保持平衡。",
  }
};

// --- 文案系统 (Copywriting) ---

export const COPYWRITING = {
  onboarding: {
    title: "构建您的专属模型",
    subtitle: "基于生理指标与生活方式，为您定制科学管理方案。",
    ageLabel: "年龄 (岁)",
    heightLabel: "身高 (cm)",
    weightLabel: "体重 (kg)",
    lifestyleLabel: "日常工作形态",
    button: "初始化系统",
  },
  modes: {
    abstinence: "戒色模式",
    health: "健康模式",
  },
  dashboard: {
    greeting: "今日概览",
    switchMode: "切换模式",
    leaderboardTitle: "匿名排行榜",
    frequencyTitle: "科学建议频率",
    markCompleted: "一键打卡",
    markRest: "今日休养",
  },
  lifestyleOptions: {
    [Lifestyle.SEDENTARY]: "久坐 (如: 程序员/司机)",
    [Lifestyle.STANDING]: "久站 (如: 医护/服务业)",
    [Lifestyle.ACTIVE]: "经常运动/体力劳动",
  },
  advice: {
    sedentary: "久坐人群需特别注意盆底血液循环。",
    active: "良好的体能是内分泌平衡的基础。",
    ageWarning: "随着年龄增长，适当延长恢复周期有益长期健康。",
    general: "保持规律作息是男性健康的关键。",
  }
};
