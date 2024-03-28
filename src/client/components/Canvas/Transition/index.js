import * as THREE from 'three';
import { find, map, each } from 'lodash';

import Background from './Background';
import Title from './Title';
import gsap from 'gsap';

export default class Transition {
  constructor({ scene, geometry, screen, viewport, index }) {
    this.scene = scene;
    this.geometry = geometry;
    this.screen = screen;
    this.viewport = viewport;
    this.index = index;

    this.createBackground();
    this.createTitles();
  }

  createBackground() {
    const project = find(
      appData.projects,
      (_, projectIndex) => projectIndex === this.index
    );

    this.background = new Background({
      scene: this.scene,
      geometry: this.geometry,
      screen: this.screen,
      viewport: this.viewport,
      texture: window.TEXTURES[project.data.desktop.url],
    });
  }

  createTitles() {
    this.titles = map(
      appData.projects,
      (project) =>
        new Title({
          scene: this.scene,
          screen: this.screen,
          viewport: this.viewport,
          name: project.data.name,
        })
    );
  }

  animate(next, previous) {
    return new Promise((res) => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => {
          this.background.destroy();
          each(this.titles, (title) => title.destroy());

          res();
        },
      });

      /**
       * Background.
       */
      const { background: nextBackground } = next;
      const { background: previousBackground } = previous;

      const isBackgroundFromFrontToBack =
        previousBackground.mesh.position.z > nextBackground.mesh.position.z;
      const isBackgroundDifferentPosition =
        Math.round(previousBackground.mesh.position.z) !==
        Math.round(nextBackground.mesh.position.z);

      if (isBackgroundDifferentPosition) {
        tl.fromTo(
          this.background.material.uniforms.uDistortion,
          { value: 0 },
          {
            value: isBackgroundFromFrontToBack ? -3 : 3,
            repeat: 1,
            yoyo: true,
            duration: 0.75,
          },
          0
        );
      }

      tl.fromTo(
        this.background.material.uniforms.uScale,
        { value: previousBackground.material.uniforms.uScale.value },
        { value: nextBackground.material.uniforms.uScale.value, duration: 1.5 },
        0
      ).fromTo(
        this.background.mesh.position,
        { z: previousBackground.mesh.position.z },
        { z: nextBackground.mesh.position.z, duration: 1.5 },
        0
      );

      /**
       * Titles.
       */
      each(this.titles, (title, titleIndex) => {
        let nextTitle;
        const nextTitlePosition = new THREE.Vector3();

        if (next.projects && next.projects[titleIndex]) {
          nextTitle = next.projects[titleIndex].title;
        } else if (next.titles && next.titles.titles[titleIndex]) {
          nextTitle = next.titles.titles[titleIndex];
        } else if (next.title) {
          nextTitle = next.title;
        }

        let previousTitle;
        const previousTitlePosition = new THREE.Vector3();

        if (previous.projects && previous.projects[titleIndex]) {
          previousTitle = previous.projects[titleIndex].title;
        } else if (previous.titles && previous.titles.titles[titleIndex]) {
          previousTitle = previous.titles.titles[titleIndex];
        } else if (previous.title) {
          previousTitle = previous.title;
        }

        if (!nextTitle || !previousTitle) {
          return;
        }

        nextTitle.mesh.updateMatrixWorld();
        nextTitle.mesh.getWorldPosition(nextTitlePosition);

        previousTitle.mesh.updateMatrixWorld();
        previousTitle.mesh.getWorldPosition(previousTitlePosition);

        const isTitleFromFrontToBack = previousTitle.scale > nextTitle.scale;
        const isTitleDifferentScaling = previousTitle.scale !== nextTitle.scale;

        if (isTitleDifferentScaling) {
          tl.fromTo(
            title.mesh.scale,
            {
              x: previousTitle.scale,
              y: previousTitle.scale,
              z: previousTitle.scale,
            },
            {
              x: nextTitle.scale,
              y: nextTitle.scale,
              z: nextTitle.scale,
              duration: 1.5,
            },
            0
          );
        } else {
          title.mesh.scale.set(
            previousTitle.scale,
            previousTitle.scale,
            previousTitle.scale
          );
        }

        if (next.name === 'Case') {
          let y = nextTitlePosition.y;

          if (this.index < titleIndex) {
            y -= this.viewport.height;
          } else if (this.index > titleIndex) {
            y += this.viewport.height;
          }

          tl.fromTo(
            title.mesh.position,
            {
              x: previousTitlePosition.x,
              y: previousTitlePosition.y,
              z: previousTitlePosition.z,
            },
            {
              x: nextTitlePosition.x,
              y,
              z: nextTitlePosition.z,
              duration: 1.5,
            },
            0
          );
        }

        if (next.name === 'Home') {
          let y =
            this.index === titleIndex
              ? nextTitlePosition.y
              : previousTitlePosition.y;

          if (this.index < titleIndex) {
            y -= this.viewport.height;
          } else if (this.index > titleIndex) {
            y += this.viewport.height;
          }

          tl.fromTo(
            title.mesh.position,
            {
              x: previousTitlePosition.x,
              y: previousTitlePosition.y,
              z: previousTitlePosition.z,
            },
            {
              x: nextTitlePosition.x,
              y,
              z: nextTitlePosition.z,
              duration: 1.5,
            },
            0
          );
        }

        if (next.name === 'Index') {
          let y =
            previous.name === 'Case'
              ? previousTitlePosition.y
              : previousTitle.mesh.position.y;

          if (this.index < titleIndex) {
            y -= this.viewport.height;
          } else if (this.index > titleIndex) {
            y += this.viewport.height;
          }

          tl.fromTo(
            title.mesh.position,
            {
              x: previousTitlePosition.x,
              y,
              z: previousTitlePosition.z,
            },
            {
              x: nextTitlePosition.x,
              y: nextTitlePosition.y,
              z: nextTitlePosition.z,
              duration: 1.5,
            },
            0
          );
        }

        tl.fromTo(
          title.material.uniforms.uDistortion,
          { value: 0 },
          {
            value: isTitleFromFrontToBack ? -5 : 5,
            repeat: 1,
            yoyo: true,
            duration: 0.75,
          },
          0
        )
          .fromTo(
            title.material.uniforms.uTransition,
            { value: previousTitle.material.uniforms.uTransition.value },
            { value: nextTitle.material.uniforms.uTransition.value },
            0
          )
          .fromTo(
            title.material.uniforms.uAlpha,
            { value: previousTitle.material.uniforms.uAlpha.value },
            { value: nextTitle.material.uniforms.uAlpha.value },
            0
          );
      });
    });
  }
}
