import gsap from 'gsap';

export function lerp(p1, p2, t) {
  return gsap.utils.interpolate(p1, p2, t);
}

// export function map(valueToMap, inMin, inMax, outMin, outMax) {
//   return gsap.utils.mapRange(inMin, inMax, outMin, outMax, valueToMap);
// }

export function map(
  num,
  min1,
  max1,
  min2,
  max2,
  round = false,
  constrainMin = true,
  constrainMax = true
) {
  if (constrainMin && num < min1) return min2;
  if (constrainMax && num > max1) return max2;

  const num1 = (num - min1) / (max1 - min1);
  const num2 = num1 * (max2 - min2) + min2;

  if (round) return Math.round(num2);

  return num2;
}

export function easeInOut(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

export function interpolate(start, end, value) {
  return start * (1.0 - value) + end * value;
}

export function clamp(min, max, number) {
  return gsap.utils.clamp(min, max, number);
}

export function random(min, max) {
  return gsap.utils.random(min, max);
}

export function delay(ms) {
  return new Promise((res) => gsap.delayedCall(ms / 1000, res));
}
