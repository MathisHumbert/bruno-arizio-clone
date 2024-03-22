import * as THREE from 'three';
import gsap from 'gsap';

import fragment from '../../../shaders/image-fragment.glsl';
import vertex from '../../../shaders/image-vertex.glsl';

export default class Background {
  constructor({ scene, geometry, screen, viewport, texture, index }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.texture = texture;
    this.index = index;

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
  show(previousTemplate) {
    if (previousTemplate !== 'home' && previousTemplate !== 'index') {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 2 },
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
          { value: 0.01 },
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

  async hide(nextTemplate) {
    if (nextTemplate === 'case') {
      return new Promise((res) => {
        const tl = gsap.timeline({
          defaults: { ease: 'power4.out', duration: 2 },
          onComplete: () => {
            res();
            this.destroy();
          },
        });

        tl.to(this.mesh.position, { y: this.viewport.height * 1.33 })
          .to(this.material.uniforms.uDisplacementY, { value: 0.01 }, 0)
          .to(this.material.uniforms.uDistortion, { value: 5 }, 0)
          .to(this.material.uniforms.uScale, { value: 0.5 }, 0);
      });
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
