import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { MSDFTextGeometry, uniforms } from 'three-msdf-text-utils';

export default class Title {
  constructor({ scene, name }) {
    this.scene = scene;
    this.name = name;

    Promise.all([
      loadFontAtlas('/ApercuPro-Bold.png'),
      loadFont('/ApercuPro-Bold-msdf.json'),
    ]).then(([atlas, font]) => {
      this.atlas = atlas;
      this.font = font;

      this.createMaterial();
      this.createGeometry();
      this.createMesh();
    });

    function loadFontAtlas(path) {
      const promise = new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(path, resolve);
      });

      return promise;
    }

    function loadFont(path) {
      const promise = new Promise((resolve, reject) => {
        const loader = new FontLoader();
        loader.load(path, resolve);
      });

      return promise;
    }
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
      },
      vertexShader: /*glsl*/ `
        // Attribute
        attribute vec2 layoutUv;

        attribute float lineIndex;

        attribute float lineLettersTotal;
        attribute float lineLetterIndex;

        attribute float lineWordsTotal;
        attribute float lineWordIndex;

        attribute float wordIndex;

        attribute float letterIndex;

        // Varyings
        varying vec2 vUv;
        varying vec2 vLayoutUv;
        varying vec3 vViewPosition;
        varying vec3 vNormal;

        varying float vLineIndex;

        varying float vLineLettersTotal;
        varying float vLineLetterIndex;

        varying float vLineWordsTotal;
        varying float vLineWordIndex;

        varying float vWordIndex;

        varying float vLetterIndex;

        void main() {
            // Output
            vec4 mvPosition = vec4(position, 1.0);
            mvPosition = modelViewMatrix * mvPosition;
            gl_Position = projectionMatrix * mvPosition;

            // Varyings
            vUv = uv;
            vLayoutUv = layoutUv;
            vViewPosition = -mvPosition.xyz;
            vNormal = normal;

            vLineIndex = lineIndex;

            vLineLettersTotal = lineLettersTotal;
            vLineLetterIndex = lineLetterIndex;

            vLineWordsTotal = lineWordsTotal;
            vLineWordIndex = lineWordIndex;

            vWordIndex = wordIndex;

            vLetterIndex = letterIndex;
        }
    `,
      fragmentShader: /*glsl*/ `
        // Varyings
        varying vec2 vUv;

        // Uniforms: Common
        uniform float uOpacity;
        uniform float uThreshold;
        uniform float uAlphaTest;
        uniform vec3 uColor;
        uniform sampler2D uMap;

        // Uniforms: Strokes
        uniform vec3 uStrokeColor;
        uniform float uStrokeOutsetWidth;
        uniform float uStrokeInsetWidth;

        // Utils: Median
        float median(float r, float g, float b) {
            return max(min(r, g), min(max(r, g), b));
        }

        void main() {
            // Common
            // Texture sample
            vec3 s = texture2D(uMap, vUv).rgb;

            // Signed distance
            float sigDist = median(s.r, s.g, s.b) - 0.5;

            float afwidth = 1.4142135623730951 / 2.0;

            #ifdef IS_SMALL
                float alpha = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDist);
            #else
                float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
            #endif

            // Strokes
            // Outset
            float sigDistOutset = sigDist + uStrokeOutsetWidth * 0.5;

            // Inset
            float sigDistInset = sigDist - uStrokeInsetWidth * 0.5;

            #ifdef IS_SMALL
                float outset = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistOutset);
                float inset = 1.0 - smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistInset);
            #else
                float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
                float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
            #endif

            // Border
            float border = outset * inset;

            // Alpha Test
            if (alpha < uAlphaTest) discard;

            // Output: Common
            vec4 filledFragColor = vec4(uColor, uOpacity * alpha);

            // Output: Strokes
            vec4 strokedFragColor = vec4(uStrokeColor, uOpacity * border);

            gl_FragColor = filledFragColor;
        }
    `,
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
    const scale = 0.5;

    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.rotation.x = Math.PI;
    mesh.position.x = (-this.geometry.layout.width / 2) * scale;
    mesh.scale.set(scale, scale, scale);

    this.scene.add(mesh);
  }
}
