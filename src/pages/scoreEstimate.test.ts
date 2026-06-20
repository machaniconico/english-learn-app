import { describe, it, expect } from 'vitest';
import { clamp, determineSkillLevel, estimateToeicScore } from './scoreEstimate';

const ZERO = {
  fillIn: { beginner: 0, intermediate: 0, advanced: 0 },
  reading: { beginner: 0, intermediate: 0, advanced: 0 },
  completedItems: 0,
  totalItems: 0,
};

describe('estimateToeicScore', () => {
  it('returns the clamped base of 200 for zero input', () => {
    // base 200, no contributions -> 200; low = clamp(150) = 150, high = clamp(250) = 250
    expect(estimateToeicScore(ZERO)).toEqual({ score: 200, low: 150, high: 250 });
  });

  it('treats zero totalItems as a 0 completion bonus (no divide-by-zero)', () => {
    // completionPct guard: totalItems 0 -> 0, completedItems ignored
    const result = estimateToeicScore({ ...ZERO, completedItems: 999, totalItems: 0 });
    expect(result).toEqual({ score: 200, low: 150, high: 250 });
  });

  it('caps a perfect run at the maximum (990)', () => {
    // 200 + (100+150+200) + (50+100+150) + 100 = 200 + 450 + 300 + 100 = 1050
    // round(1050) = 1050; low = clamp(1000) = 990, high = clamp(1100) = 990, score = clamp(1050) = 990
    const result = estimateToeicScore({
      fillIn: { beginner: 100, intermediate: 100, advanced: 100 },
      reading: { beginner: 100, intermediate: 100, advanced: 100 },
      completedItems: 100,
      totalItems: 100,
    });
    expect(result).toEqual({ score: 990, low: 990, high: 990 });
  });

  it('computes the exact weighted sum for a mixed mid case', () => {
    // fill-in: 0.5*100=50, 0.8*150=120, 0.2*200=40  -> 210
    // reading: 0.6*50=30, 0.4*100=40, 0.1*150=15     -> 85
    // completion: clamp(30/100,0,1)*100 = 30
    // total: 200 + 210 + 85 + 30 = 525
    // low = clamp(475) = 475, high = clamp(575) = 575, score = clamp(525) = 525
    const result = estimateToeicScore({
      fillIn: { beginner: 50, intermediate: 80, advanced: 20 },
      reading: { beginner: 60, intermediate: 40, advanced: 10 },
      completedItems: 30,
      totalItems: 100,
    });
    expect(result).toEqual({ score: 525, low: 475, high: 575 });
  });

  it('rounds the score before clamping the band', () => {
    // fill-in beginner only: 0.333*100 = 33.333... ; rest 0; completion 0
    // 200 + 33.333... = 233.333... -> round = 233
    // low = clamp(183) = 183, high = clamp(283) = 283
    const result = estimateToeicScore({
      fillIn: { beginner: 100 / 3, intermediate: 0, advanced: 0 },
      reading: { beginner: 0, intermediate: 0, advanced: 0 },
      completedItems: 0,
      totalItems: 0,
    });
    expect(result).toEqual({ score: 233, low: 183, high: 283 });
  });

  it('produces a low/high band of score -/+ 50 clamped to [10, 990]', () => {
    // A general mid case keeps the 100-point band centered on score.
    const result = estimateToeicScore({
      fillIn: { beginner: 100, intermediate: 0, advanced: 0 },
      reading: { beginner: 0, intermediate: 0, advanced: 0 },
      completedItems: 0,
      totalItems: 0,
    });
    // 200 + 100 = 300
    expect(result).toEqual({ score: 300, low: 250, high: 350 });
    expect(result.low).toBe(clamp(result.score - 50, 10, 990));
    expect(result.high).toBe(clamp(result.score + 50, 10, 990));
  });

  it('clamps an over-1000 completion ratio bonus to a max of +100', () => {
    // completionPct = 9000/3000 = 3 -> clamp(3,0,1) = 1 -> +100
    // 200 + 100 = 300
    const result = estimateToeicScore({
      fillIn: { beginner: 0, intermediate: 0, advanced: 0 },
      reading: { beginner: 0, intermediate: 0, advanced: 0 },
      completedItems: 9000,
      totalItems: 3000,
    });
    expect(result).toEqual({ score: 300, low: 250, high: 350 });
  });
});

describe('determineSkillLevel', () => {
  it('maps thresholds: >=90 expert, >=70 advanced, >=40 intermediate, else beginner', () => {
    expect(determineSkillLevel(0)).toBe('beginner');
    expect(determineSkillLevel(39.9)).toBe('beginner');
    expect(determineSkillLevel(40)).toBe('intermediate');
    expect(determineSkillLevel(69.9)).toBe('intermediate');
    expect(determineSkillLevel(70)).toBe('advanced');
    expect(determineSkillLevel(89.9)).toBe('advanced');
    expect(determineSkillLevel(90)).toBe('expert');
    expect(determineSkillLevel(100)).toBe('expert');
  });
});

describe('clamp', () => {
  it('bounds a value to [min, max]', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });
});
