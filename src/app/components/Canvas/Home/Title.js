import * as THREE from 'three';
import { MSDFTextGeometry, uniforms } from 'three-msdf-text-utils';
import gsap from 'gsap';

import fragment from '../../../shaders/title-fragment.glsl';
import vertex from '../../../shaders/title-vertex.glsl';
import { map } from '../../../utils/math';

export default class Title {
  constructor({ scene, screen, viewport, name, index }) {
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.name = name;
    this.index = index;

    this.atlas = window.TITLE.atlas;
    this.font = window.TITLE.font;
    this.isAnimating = false;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      defines: {
        IS_SMALL: false,
      },
      extensions: {
        derivatives: true,
      },
      uniforms: {
        // Common
        ...uniforms.common,

        // Rendering
        ...uniforms.rendering,

        // Strokes
        ...uniforms.strokes,

        // Custom
        uDistortion: {
          value: 1,
        },
        uDistortionX: {
          value: 1.75,
        },
        uDistortionX: {
          value: 2,
        },
        uAlpha: {
          value: 1,
        },
        uLinesTotal: { value: this.geometry.layout.linesTotal },
        uLettersTotal: { value: this.geometry.layout.lettersTotal },
        uWordsTotal: { value: this.geometry.layout.wordsTotal },
        uTransition: {
          value: 1,
        },
        uCount: { value: this.geometry.index.count },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.material.uniforms.uMap.value = this.atlas;
  }

  createGeometry() {
    this.geometry = new MSDFTextGeometry({
      text: this.name,
      font: this.font.data,
    });
  }

  createMesh() {
    this.scale = this.screen.width * 0.0016;

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.rotation.x = Math.PI;
    this.mesh.position.x = -this.viewport.width / 2;
    this.mesh.position.y =
      -this.viewport.height / 2 + this.viewport.height * 0.2;
    this.mesh.position.z = 0.01;
    this.mesh.scale.set(this.scale, this.scale, this.scale);
  }

  /**
   * Animations.
   */
  show(isCurrent, previousTemplate) {
    this.scene.add(this.mesh);

    if (!isCurrent) return;

    if (
      !previousTemplate ||
      previousTemplate === 'about' ||
      previousTemplate === 'essays'
    ) {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 2 },
        onComplete: () => (this.isAnimating = false),
      });

      this.isAnimating = true;

      tl.fromTo(
        this.mesh.position,
        { x: this.mesh.position.x + 75, y: -this.viewport.height },
        {
          x: -this.viewport.width / 2,
          y: -this.viewport.height / 2 + this.viewport.height * 0.2,
        }
      )
        .fromTo(
          this.mesh.rotation,
          { x: Math.PI + Math.PI / 8 },
          { x: Math.PI },
          0
        )
        .fromTo(this.material.uniforms.uAlpha, { value: 0 }, { value: 1 }, 0)
        .fromTo(
          this.material.uniforms.uDistortion,
          { value: 5 },
          { value: 0 },
          0
        );
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

        tl.to(this.mesh.position, {
          x: this.mesh.position.x - 75,
          y: this.viewport.height,
        })
          .to(this.mesh.rotation, { x: Math.PI + Math.PI / 8 }, 0)
          .to(this.material.uniforms.uAlpha, { value: 0 }, 0)
          .to(this.material.uniforms.uDistortion, { value: 5 }, 0);
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

    this.scale = this.screen.width * 0.0016;

    this.mesh.position.x = -this.viewport.width / 2;
    this.mesh.position.y =
      -this.viewport.height / 2 + this.viewport.height * 0.2;
    this.mesh.scale.set(this.scale, this.scale, this.scale);
  }

  /**
   * Update.
   */
  update(percent) {
    if (this.isAnimating) return;

    const percentAbsolute = Math.abs(percent);

    this.material.uniforms.uAlpha.value = map(percentAbsolute, 0.25, 1, 1, 0);

    this.material.uniforms.uDistortion.value = map(
      percentAbsolute,
      0,
      1,
      0,
      10
    );

    this.mesh.position.x =
      -this.viewport.width / 2 + map(percent, -1.25, 1.25, 75, -75);
    this.mesh.position.z = map(percent, -1.25, 1.25, 50, -50);

    this.mesh.rotation.x = map(
      percent,
      -1.25,
      1.25,
      Math.PI + Math.PI / 8,
      Math.PI - Math.PI / 8
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
