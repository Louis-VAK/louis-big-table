attribute float size;
uniform float uTime;

void main() {
  vec3 p = position;

  // 讓粒子輕微跳動
  p.x += sin(uTime + position.y * 3.0) * 0.02;
  p.z += cos(uTime + position.y * 3.0) * 0.02;

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
