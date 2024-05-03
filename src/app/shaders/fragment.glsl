#pragma glslify: cnoise = require(glsl-noise/classic/3d)

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform float uTime;
uniform float uDisplacementX;
uniform float uDisplacementY;
uniform float uGrayscale;
uniform float uAlpha;

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

void main(){
  vec2 uv = getCorrectUv(uResolution, uImageResolution);

  float noise = cnoise(vec3(uv, cos(uTime * 0.1)) * 10. + uTime * 0.5);

  uv.x += noise * uDisplacementX;
  uv.y += noise * uDisplacementY;

  vec4 texture = texture2D(uTexture, uv);

  float gray = dot(texture.rgb, vec3(0.299, 0.587, 0.114));

  gl_FragColor = vec4(mix(vec3(gray), texture.rgb, uGrayscale), uAlpha);
}