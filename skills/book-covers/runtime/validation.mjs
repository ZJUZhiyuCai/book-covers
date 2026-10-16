import { createHash } from 'node:crypto';
export const LANGS = ['zh', 'en'];
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

export function validateTypography(plan, lines, lang) {
  if (plan === undefined) return;
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) throw new Error('Invalid typography plan.');
  if (!['left', 'centered', 'vertical'].includes(plan.mode)) throw new Error('Invalid typography mode.');
  if (plan.mode === 'vertical' && lang !== 'zh') throw new Error('Vertical typography requires Chinese.');
  if (lang !== 'zh' && plan.face !== undefined)
    throw new Error('face selects a Chinese font; use italicLines for English.');
  if (plan.face !== undefined && !['zhuque', 'brush'].includes(plan.face))
    throw new Error('Invalid Chinese title face.');
  if (plan.ink !== undefined && !/^#[0-9a-f]{6}$/i.test(plan.ink)) throw new Error('Invalid typography ink.');
  for (const key of ['sizes', 'baselines', 'offsets', 'centers', 'topOffsets']) {
    if (plan[key] === undefined) continue;
    if (
      !Array.isArray(plan[key]) ||
      plan[key].length !== lines.length ||
      plan[key].some((n) => !Number.isFinite(n) || n < 0 || n > 950)
    )
      throw new Error(`Invalid typography ${key}.`);
  }
  for (const key of ['size', 'top', 'leading', 'tracking']) {
    if (plan[key] !== undefined && (!Number.isFinite(plan[key]) || plan[key] < 0 || plan[key] > 600))
      throw new Error(`Invalid typography ${key}.`);
  }
  if (plan.size !== undefined && plan.size < 24) throw new Error('Title size must be at least 24.');
  if (plan.sizes?.some((size) => size < 24)) throw new Error('Title sizes must be at least 24.');
  if (plan.leading !== undefined && plan.leading < 24) throw new Error('Leading must be at least 24.');
  if (lang === 'zh' && plan.sizes?.some((size) => size !== plan.sizes[0]))
    throw new Error('Chinese title characters must use one equal size; use size or equal sizes.');
  if (lang === 'zh' && plan.size !== undefined && plan.sizes?.some((size) => size !== plan.size))
    throw new Error('Chinese title size and sizes must agree.');
  if (plan.mode === 'vertical' && plan.centers?.some((x, i) => i && x >= plan.centers[i - 1]))
    throw new Error('Vertical columns must read from right to left.');
  if (plan.mode !== 'vertical' && plan.baselines?.some((y, i) => i && y <= plan.baselines[i - 1]))
    throw new Error('Horizontal title lines must read from top to bottom.');
  if (
    plan.italicLines !== undefined &&
    (!Array.isArray(plan.italicLines) ||
      plan.italicLines.some((n) => !Number.isInteger(n) || n < 0 || n >= lines.length))
  )
    throw new Error('Invalid italic line index.');
}
