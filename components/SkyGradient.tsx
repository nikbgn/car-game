"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { SKY_HORIZON_COLOR } from "@/lib/constants";

const vertexShader = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec3 vWorldPosition;
uniform vec3 topColor;
uniform vec3 horizonColor;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float stars(vec3 dir) {
  if (dir.y < 0.12) return 0.0;

  vec3 p = dir * 220.0;
  vec3 cell = floor(p);
  float rnd = hash(cell);

  if (rnd < 0.9945) return 0.0;

  vec3 f = fract(p) - 0.5;
  float dist = length(f);
  float dot = smoothstep(0.035, 0.0, dist);
  float fade = smoothstep(0.12, 0.55, dir.y);

  return dot * fade;
}

float softHill(float az, float center, float spread, float height) {
  float d = (az - center) / spread;
  return height * exp(-d * d);
}

void main() {
  vec3 dir = normalize(vWorldPosition);
  float h = dir.y;

  // Smooth night gradient — wide blend, no sharp bands
  float t = smoothstep(-0.25, 0.85, h);
  vec3 sky = mix(horizonColor, topColor, t);

  // Painted soft hill silhouettes at the horizon (replaces low-poly cones)
  float az = atan(dir.x, -dir.z);
  float hillFade = smoothstep(0.14, -0.06, h);
  float hills = softHill(az, -0.62, 0.42, 1.0) + softHill(az, 0.58, 0.48, 1.08);
  hills = min(hills, 1.0) * hillFade;
  vec3 hillColor = vec3(0.06, 0.09, 0.08);
  sky = mix(sky, hillColor, hills * 0.82);

  // Sparse static stars — upper sky only
  float star = stars(dir);
  sky += vec3(0.88, 0.92, 1.0) * star * 0.7;

  gl_FragColor = vec4(sky, 1.0);
}
`;

export function SkyGradient() {
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color("#080e18") },
      horizonColor: { value: new THREE.Color(SKY_HORIZON_COLOR) },
    }),
    [],
  );

  return (
    <mesh frustumCulled={false}>
      <sphereGeometry args={[70, 32, 16]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
