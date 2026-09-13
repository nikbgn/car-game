"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import {
  CAMERA_FOV,
  CAMERA_LOOK_AT,
  CAMERA_OFFSET,
} from "@/lib/constants";

export function ChaseCamera() {
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = CAMERA_FOV;
      camera.updateProjectionMatrix();
    }
    camera.position.set(CAMERA_OFFSET.x, CAMERA_OFFSET.y, CAMERA_OFFSET.z);
    lookAt.current.set(
      CAMERA_LOOK_AT.x,
      CAMERA_LOOK_AT.y,
      CAMERA_LOOK_AT.z,
    );
    camera.lookAt(lookAt.current);
  });

  return null;
}
