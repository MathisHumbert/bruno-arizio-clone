#pragma glslify: cnoise = require(glsl-noise/classic/3d)

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uScale;
uniform float uTime;
uniform float uAlpha;
uniform float uDisplacementX;
uniform float uDisplacementY;

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

  float noise = cnoise(vec3(uv, cos(uTime * 0.1)) * 10.0 + uTime * 0.5);

  uv.x += noise * uDisplacementX;
  uv.y += noise * uDisplacementY;

  uv = zoom(uv, uScale);

  gl_FragColor = vec4(texture2D(uTexture, uv).xyz, uAlpha);
}