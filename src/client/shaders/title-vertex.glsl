// Attribute
attribute vec2 layoutUv;

attribute float lineIndex;

attribute float lineLettersTotal;
attribute float lineLetterIndex;

attribute float lineWordsTotal;
attribute float lineWordIndex;

attribute float wordIndex;

attribute float letterIndex;

// Uniform
uniform float uDistortion;
uniform float uDistortionX;
uniform float uDistortionY;
uniform float uCount; 

// Varyings
varying vec2 vUv;
varying vec2 vLayoutUv;
varying vec3 vViewPosition;
varying vec3 vNormal;

varying float vLineIndex;

varying float vLineLettersTotal;
varying float vLineLetterIndex;

varying float vLineWordsTotal;
varying float vLineWordIndex;

varying float vWordIndex;

varying float vLetterIndex;

void main() {
  vec3 newPosition = position;

  float distanceX = length(position.x) / uCount;
  float distanceY = length(position.y) / uCount;

  float distanceXPow = pow(uDistortionX, distanceX);
  float distanceYPow = pow(uDistortionY, distanceY);

  newPosition.z -= uDistortion * max(distanceXPow + distanceYPow, 2.2);

  // Output
  vec4 mvPosition = vec4(newPosition, 1.0);
  mvPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * mvPosition;

  // Varyings
  vUv = uv;
  vLayoutUv = layoutUv;
  vViewPosition = -mvPosition.xyz;
  vNormal = normal;

  vLineIndex = lineIndex;

  vLineLettersTotal = lineLettersTotal;
  vLineLetterIndex = lineLetterIndex;

  vLineWordsTotal = lineWordsTotal;
  vLineWordIndex = lineWordIndex;

  vWordIndex = wordIndex;

  vLetterIndex = letterIndex;
}