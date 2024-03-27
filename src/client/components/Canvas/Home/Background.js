import * as THREE from 'three';
import gsap from 'gsap';

import fragment from '../../../shaders/image-fragment.glsl';
import vertex from '../../../shaders/image-vertex.glsl';
import { map } from '../../../utils/math';

export default class Background {
  constructor({ scene, geometry, screen, viewport, texture, index }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.texture = texture;
    this.index = index;

    this.location = this.viewport.height * 1.33 * this.index * -1;
    this.isAnimating = false;

    this.createMaterial();
    this.createMesh();
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
        uDisplacementX: { value: 0 },
        uDisplacementY: { value: 0 },
        uDistortion: { value: 0 },
        uDistortionX: { value: 1.75 },
        uDistortionY: { value: 2 },
        uScale: { value: 0 },
        uTime: { value: 0 },
        uAlpha: { value: 1 },
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
    this.mesh.position.z = -0.01;

    this.scene.add(this.mesh);
  }

  /**
   * Animations.
   */
  show(isCurrent, previousTemplate) {
    if (!isCurrent) return;

    if (previousTemplate === 'about' || previousTemplate === 'essays') {
      this.isAnimating = true;

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 2 },
        onComplete: () => (this.isAnimating = false),
      });

      tl.fromTo(
        this.mesh.position,
        {
          y: -this.viewport.height * 1.33,
          z: -50,
        },
        { y: 0, z: 0 }
      )
        .fromTo(
          this.material.uniforms.uDisplacementY,
          { value: 0.1 },
          { value: 0 },
          0
        )
        .fromTo(
          this.material.uniforms.uDistortion,
          { value: 5 },
          { value: 0 },
          0
        )
        .fromTo(this.material.uniforms.uScale, { value: 0.5 }, { value: 0 }, 0);
    }
  }

  hide(isCurrent, nextTemplate) {
    if (isCurrent && (nextTemplate === 'about' || nextTemplate === 'essays')) {
      return new Promise((res) => {
        this.isAnimating = true;

        const tl = gsap.timeline({
          defaults: { ease: 'power4.out', duration: 2 },
          onComplete: () => {
            this.isAnimating = false;

            res();
          },
        });

        tl.to(this.mesh.position, { y: this.viewport.height * 1.33, z: -50 })
          .to(this.material.uniforms.uDisplacementY, { value: 0.1 }, 0)
          .to(this.material.uniforms.uDistortion, { value: 5 }, 0)
          .to(this.material.uniforms.uScale, { value: 0.5 }, 0);
      });
    } else {
      return Promise.resolve();
    }
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    this.mesh.scale.x = this.viewport.width;
    this.mesh.scale.y = this.viewport.height;

    this.material.uniforms.uResolution.value.set(
      this.screen.width,
      this.screen.height
    );
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
  update(percent, time) {
    if (this.isAnimating) return;

    const percentAbsolute = Math.abs(percent);

    this.material.uniforms.uDistortion.value = map(percentAbsolute, 0, 1, 0, 5);

    this.material.uniforms.uScale.value = map(percentAbsolute, 0, 1, 0, 0.5);

    this.material.uniforms.uTime.value += time * 0.75;

    this.mesh.position.z = map(percentAbsolute, 0, 1, -0.01, -50);
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
