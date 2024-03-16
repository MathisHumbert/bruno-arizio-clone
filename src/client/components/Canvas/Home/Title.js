import * as THREE from 'three';
import { MSDFTextGeometry, uniforms } from 'three-msdf-text-utils';

import fragment from '../../../shaders/title-fragment.glsl';
import vertex from '../../../shaders/title-vertex.glsl';
import { clamp, map } from '../../../utils/math';

export default class Title {
  constructor({ scene, screen, viewport, name, index }) {
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.name = name;
    this.index = index;

    this.atlas = window.TITLE.atlas;
    this.font = window.TITLE.font;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
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
    const scale = this.screen.width * 0.00175;

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.rotation.x = Math.PI;
    this.mesh.position.x = -this.viewport.width / 2;
    this.mesh.position.y =
      -this.viewport.height / 2 + this.viewport.height * 0.2;
    this.mesh.position.z = 0.01;
    this.mesh.scale.set(scale, scale, scale);

    this.scene.add(this.mesh);
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    if (this.mesh) {
      const scale = this.screen.width * 0.00175;

      this.mesh.position.x = -this.viewport.width / 2;
      this.mesh.position.y =
        -this.viewport.height / 2 + this.viewport.height * 0.2;
      this.mesh.scale.set(scale, scale, scale);
    }
  }

  /**
   * Update.
   */
  update(percent) {
    const percentAbsolute = Math.abs(percent);

    if (this.material) {
      this.material.uniforms.uAlpha.value = map(percentAbsolute, 0.25, 1, 1, 0);

      this.material.uniforms.uDistortion.value = clamp(
        0,
        5,
        map(percentAbsolute, 0, 1, 0, 5)
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

  destroy() {
    this.destroyGeometry();
    this.destroyMaterial();
  }
}
