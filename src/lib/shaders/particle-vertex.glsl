attribute float size;
attribute vec3 customColor;
attribute float mouseInfluence;

uniform float time;
uniform vec2 mousePosition;
uniform float pixelRatio;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vColor = customColor;
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  
  // Mouse interaction
  vec2 mousePos = mousePosition * 2.0 - 1.0;
  vec2 screenPos = (mvPosition.xy / mvPosition.w);
  float distanceToMouse = length(screenPos - mousePos);
  
  // Apply mouse influence
  float mouseEffect = smoothstep(0.5, 0.0, distanceToMouse) * mouseInfluence;
  mvPosition.xy += normalize(screenPos - mousePos) * mouseEffect * 0.3;
  
  // Floating animation
  float floatOffset = sin(time * 0.5 + position.x * 0.1) * 0.1;
  mvPosition.y += floatOffset;
  
  gl_Position = projectionMatrix * mvPosition;
  
  // Size based on distance and mouse interaction
  float baseSize = size * pixelRatio;
  float sizeMultiplier = 1.0 + mouseEffect * 0.5;
  gl_PointSize = baseSize * sizeMultiplier * (300.0 / -mvPosition.z);
  
  // Alpha based on distance
  vAlpha = 1.0 - smoothstep(0.0, 20.0, length(mvPosition.xyz));
}