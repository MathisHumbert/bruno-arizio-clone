import * as THREE from 'three';
import { MSDFTextGeometry, uniforms } from 'three-msdf-text-utils';

import fragment from '../../../shaders/title-fragment.glsl';
import vertex from '../../../shaders/title-vertex.glsl';
import { lerp } from '../../../utils/math';

export default class Title {
  constructor({ scene, screen, viewport, name, index }) {
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.name = name;
    this.index = index;

    this.atlas = window.TITLE.atlas;
    this.font = window.TITLE.font;
    this.transition = 0;

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
          value: 0,
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
          value: 0,
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
    this.scale = this.screen.width * 0.00065;
    this.height = this.scale * this.geometry.layout.height;
    this.padding = this.geometry.layout.height / 4;

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.rotation.x = Math.PI;
    this.mesh.position.x = -this.viewport.width / 2.275;
    this.mesh.position.y =
      (-this.geometry.layout.height / 3) * this.scale -
      (this.height + this.padding) * this.index;
    this.mesh.position.z = 0.01;
    this.mesh.scale.set(this.scale, this.scale, this.scale);

    this.scene.add(this.mesh);
  }

  /**
   * Events.
   */
  onResize({ screen, viewport }) {
    this.screen = screen;
    this.viewport = viewport;

    this.scale = this.screen.width * 0.00065;
    this.height = this.scale * this.geometry.layout.height;
    this.padding = this.geometry.layout.height / 4;

    this.mesh.position.x = -this.viewport.width / 2.275;
    this.mesh.position.y =
      (-this.geometry.layout.height / 3) * this.scale -
      (this.height + this.padding) * this.index;
    this.mesh.scale.set(this.scale, this.scale, this.scale);
  }

  set(isCurrent) {
    this.transition = isCurrent ? 1 : 0;
  }

  /**
   * Loop.
   */
  update() {
    this.material.uniforms.uTransition.value = Number(
      lerp(
        this.material.uniforms.uTransition.value,
        this.transition,
        0.1
      ).toFixed(2)
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
