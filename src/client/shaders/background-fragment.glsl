#pragma glslify: curlNoise = require(glsl-curl-noise/curl)

uniform sampler2D uImage;
uniform sampler2D uTransition;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uScale;
uniform float uValue;
uniform float uIsAnimating;

varying vec2 vUv;

vec2 getCorrectUv (vec2 resolution, vec2 textureResolution){
  vec2 ratio = vec2(
    min((resolution.x / resolution.y) / (textureResolution.x / textureResolution.y), 1.0),
    min((resolution.y / resolution.x) / (textureResolution.y / textureResolution.x), 1.0)
  );

  return vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

vec2 zoom(vec2 uv, float amount) {
  return 0.5 + ((uv - 0.5) * (1.0 - amount));
}

void main(){
  vec2 uv = getCorrectUv(uResolution, uImageResolution);

  uv = zoom(uv, uScale);

  vec3 curl = curlNoise(vec3(uv, 1.) * 5. + uValue);

  vec4 colorOne = texture2D(uImage, vec2(uv.x, uv.y + uValue * curl.x));
  vec4 colorTwo = texture2D(uTransition, vec2(uv.x, uv.y + (1. - uValue) * curl.x));

  if (uIsAnimating > 0.0) {
    uv.x += curl.x;
  }

  gl_FragColor = mix(colorOne, colorTwo, uValue);
}