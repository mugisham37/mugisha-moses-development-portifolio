uniform float time;
uniform float opacity;

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Create circular particle shape
  vec2 center = gl_PointCoord - vec2(0.5);
  float distance = length(center);
  
  if (distance > 0.5) {
    discard;
  }
  
  // Soft edges
  float alpha = 1.0 - smoothstep(0.3, 0.5, distance);
  
  // Pulsing effect
  float pulse = sin(time * 2.0) * 0.1 + 0.9;
  alpha *= pulse;
  
  // Apply vertex alpha and uniform opacity
  alpha *= vAlpha * opacity;
  
  // Glow effect for neon theme
  vec3 finalColor = vColor;
  if (vColor.r > 0.8 || vColor.g < 0.3) { // Detect neon colors
    finalColor += vColor * 0.3 * pulse;
  }
  
  gl_FragColor = vec4(finalColor, alpha);
}