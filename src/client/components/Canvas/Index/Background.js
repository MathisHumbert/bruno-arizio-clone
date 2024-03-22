import * as THREE from 'three';
import gsap from 'gsap';

import fragment from '../../../shaders/background-fragment.glsl';
import vertex from '../../../shaders/vertex.glsl';

export default class Background {
  constructor({ scene, geometry, screen, viewport, textures }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.textures = textures;

    this.index = 0;
    this.isAnimating = false;

    this.createMaterial();
    this.createMesh();
  }

  createMaterial() {
    const texture = this.textures[0];

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uDistortion: { value: 0 },
        uDistortionX: { value: 1.75 },
        uDistortionY: { value: 2 },
        uScale: { value: 0 },
        uImage: { value: texture },
        uTransition: { value: null },
        uResolution: {
          value: new THREE.Vector2(this.screen.width, this.screen.height),
        },
        uImageResolution: {
          value: new THREE.Vector2(texture.image.width, texture.image.height),
        },
        uIsAnimating: { value: 0 },
        uTransition: { value: 0 },
        uValue: { value: 0 },
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
    this.mesh.position.z = -150;

    this.scene.add(this.mesh);
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

  set(index) {
    if (this.isAnimating || this.index === index) return;

    this.index = index;

    if (this.textures) {
      this.material.uniforms.uTransition.value = this.textures[index];
      this.material.uniforms.uImage.value = this.textures[index];
    }
  }

  update(index) {
    if (this.isAnimating || this.index === index) return;

    this.index = index;
    this.isAnimating = true;

    const tl = gsap.timeline();

    tl.call(() => {
      this.material.uniforms.uIsAnimating.value = 1;
      this.material.uniforms.uTransition.value = this.textures[index];
    })
      .fromTo(
        this.material.uniforms.uValue,
        { value: 0 },
        { value: 1, duration: 1, ease: 'power3.inOut' }
      )
      .call(() => {
        this.material.uniforms.uIsAnimating.value = 0;
        this.material.uniforms.uImage.value = this.textures[index];

        this.isAnimating = false;
      });
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
