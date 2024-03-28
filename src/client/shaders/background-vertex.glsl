uniform float uDistortion;
uniform float uDistortionX;
uniform float uDistortionY;

varying vec2 vUv;

void main(){
  vec3 newPosition = position;

  float distanceX = length(position.x) * 5.;
  float distanceY = length(position.y) * 5.;

  float distanceXPow = pow(uDistortionX, distanceX);
  float distanceYPow = pow(uDistortionY, distanceY);

  newPosition.z -= uDistortion * max(distanceXPow + distanceYPow, 2.2);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.);

  vUv = uv;
}