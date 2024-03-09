import * as THREE from 'three';
import gsap from 'gsap';

import fragment from '../../../shaders/fragment.glsl';
import vertex from '../../../shaders/vertex.glsl';
import { map } from '../../../utils/math';

export default class Project {
  constructor({ scene, geometry, screen, viewport, texture, index }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.texture = texture;
    this.index = index;

    this.location = this.viewport.height * 1.33 * this.index * -1;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(
      this.viewport.width,
      this.viewport.height,
      100,
      50
    );
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      fragmentShader: fragment,
      vertexShader: vertex,
      uniforms: {
        uTexture: { value: this.texture },
        uScreenSizes: {
          value: new THREE.Vector2(this.screen.width, this.screen.height),
        },
        uImagesSizes: {
          value: new THREE.Vector2(
            this.texture.image.width,
            this.texture.image.height
          ),
        },
        uDisplacementX: { value: 0 },
        uDisplacementY: { value: 0 },
        uDistortion: { value: 0 },
        uDirstortionX: { value: 1.75 },
        uDistortionY: { value: 2 },
        uScale: { value: 0 },
        uTime: { value: 0 },
        uAlpha: { value: 1 },
      },
      transparent: true,
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = this.location;
    this.mesh.position.z = -0.01;

    this.scene.add(this.mesh);
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;
  }

  onTouchStart() {
    gsap.to(this.material.uniforms.uDisplacementY, {
      value: 0.1,
      duration: 0.4,
    });
  }

  onTouchEnd() {
    gsap.killTweensOf(this.material.uniforms.uDisplacementY);

    gsap.to(this.material.uniforms.uDisplacementY, {
      value: 0,
      duration: 0.4,
    });
  }

  /**
   * Loop.
   */
  update(scroll, time) {
    this.mesh.position.y = this.location + scroll;

    const percent = this.mesh.position.y / this.viewport.height;
    const percentAbsolute = Math.abs(percent);

    this.material.uniforms.uDistortion.value = map(percentAbsolute, 0, 1, 0, 5);
    this.material.uniforms.uScale.value = map(percent, 0, 1, 0, 0.5);
    this.material.uniforms.uTime.value += time;

    this.mesh.position.z = map(percentAbsolute, 0, 1, -0.01, -50);
  }
}
