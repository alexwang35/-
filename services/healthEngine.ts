import { UserProfile, HealthModelConfig, HealthRecommendation, Lifestyle } from '../types';
import { HEALTH_MODEL_CONFIG, COPYWRITING } from '../constants';

/**
 * ==========================================
 * 核心健康计算引擎 (Pure Logic Layer)
 * ==========================================
 */

const calculateBMI = (heightCm: number, weightKg: number): number => {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

const getBMIWeight = (bmi: number, config: HealthModelConfig): number => {
  if (bmi < 18.5) return config.bmiWeights.underweight;
  if (bmi >= 18.5 && bmi < 24) return config.bmiWeights.normal;
  if (bmi >= 24 && bmi < 28) return config.bmiWeights.overweight;
  return config.bmiWeights.obese;
};

// 新增: 年龄因子计算
const getAgeFactor = (age: number, config: HealthModelConfig): number => {
  if (age <= config.ageDecay.baseAge) return 1.0;
  const diff = age - config.ageDecay.baseAge;
  // 线性衰减，最低不低于 0.4
  return Math.max(0.4, 1.0 - (diff * config.ageDecay.decayPerYear));
};

export const calculateRecommendation = (
  profile: UserProfile,
  config: HealthModelConfig = HEALTH_MODEL_CONFIG
): HealthRecommendation => {
  const { heightCm, weightKg, lifestyle, age } = profile;
  
  // 1. 物理因子
  const bmi = calculateBMI(heightCm, weightKg);
  const bmiFactor = getBMIWeight(bmi, config);
  
  // 2. 生活方式因子
  const lifestyleFactor = config.lifestyleMultipliers[lifestyle];
  
  // 3. 年龄因子
  const ageFactor = getAgeFactor(age, config);
  
  // 4. 综合计算
  const rawFrequency = config.baseFrequencyPerWeek * bmiFactor * lifestyleFactor * ageFactor;
  
  // 5. 结果处理
  const minFreq = Math.max(1, Math.floor(rawFrequency - 0.5));
  const maxFreq = Math.ceil(rawFrequency + 0.5);

  // 计算建议周期天数 (例如: 频率 2次/周 -> 3.5天/次 -> 取整 3或4)
  const cycleDays = Math.round(7 / rawFrequency);

  const tips: string[] = [COPYWRITING.advice.general];
  
  if (lifestyle === Lifestyle.SEDENTARY) tips.push(COPYWRITING.advice.sedentary);
  if (age > 35) tips.push(COPYWRITING.advice.ageWarning);

  return {
    minFrequencyWeekly: minFreq,
    maxFrequencyWeekly: maxFreq,
    cycleDays: Math.max(2, cycleDays), // 至少2天
    description: `基于年龄(${age}岁)与生理数据，建议您的自然恢复周期约为 ${cycleDays} 天。`,
    healthTips: tips
  };
};
