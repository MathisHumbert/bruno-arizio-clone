import * as THREE from 'three';

import vertex from '../../../shaders/vertex.glsl';
import fragment from '../../../shaders/fragment.glsl';
import gsap from 'gsap';

export default class Preloader {
  constructor({ scene, screen, viewport, texture }) {
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.texture = texture;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();

    this.show();
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100);
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: this.texture },
        uResolution: {
          value: new THREE.Vector2(this.screen.width, this.screen.height),
        },
        uImageResolution: {
          value: new THREE.Vector2(
            this.texture.image.width,
            this.texture.image.height
          ),
        },
        uDisplacementX: { value: 0.5 },
        uDisplacementY: { value: 0.5 },
        uTime: { value: 0 },
        uGrayscale: { value: 0 },
        uAlpha: { value: 0 },
      },
      fragmentShader: fragment,
      vertexShader: vertex,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.scale.x = this.viewport.width;
    this.mesh.scale.y = this.viewport.height;
    this.mesh.position.z = 0;

    this.scene.add(this.mesh);
  }

  /**
   * Animations.
   */
  show() {
    gsap.to(this.material.uniforms.uAlpha, { value: 0.1, duration: 1 });
  }

  hide() {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        defaults: { duration: 1.5 },
        onComplete: () => {
          resolve();
          this.destroy();
        },
      });

      tl.to(this.material.uniforms.uAlpha, { value: 1 })
        .to(this.material.uniforms.uDisplacementX, { value: 0 }, 0)
        .to(this.material.uniforms.uDisplacementY, { value: 0 }, 0)
        .to(this.material.uniforms.uGrayscale, { value: 1 }, 0);
    });
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;
  }

  /**
   * Update.
   */
  update(time) {
    this.material.uniforms.uTime.value += time;
  }

  /**
   * Destroy.
   */
  destroyGeometry() {
    if (this.geometry) {
      this.geometry.dispose();
    }
  }

  destroyMaterial() {
    if (this.material) {
      this.material.dispose();
    }
  }

  destroyMesh() {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }
  }

  destroy() {
    this.destroyGeometry();
    this.destroyMaterial();
    this.destroyMesh();
  }
}
