import gsap from 'gsap';
import { each } from 'lodash';

import Component from '../classes/Component';
import { lerp, map } from '../utils/math';
import { getOffset } from '../utils/dom';

export default class Cursor extends Component {
  constructor(size) {
    super({
      element: '.cursor',
      elements: {
        canvas: '.cursor__canvas',
      },
    });

    this.context = this.elements.canvas.getContext('2d');

    this.ratio = size / 10;

    this.circle = {
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
      scale: {
        target: 30,
        value: 30,
      },
    };

    this.bullet = {
      position: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      },
      scale: {
        target: 3,
        value: 3,
      },
    };

    this.arrows = {
      color: 'rgba(255, 255, 255, 0)',
      scale: {
        target: 0,
        value: 0,
      },
    };

    this.mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  /**
   * Animations.
   */
  show() {
    gsap.to(this.element, { autoAlpha: 1, duration: 1 });

    this.elements.links = document.querySelectorAll('[data-link]');

    each(this.elements.links, (element) => {
      element.addEventListener('mouseenter', this.onLinkEnter.bind(this));
      element.addEventListener('mousemove', this.onLinkMove.bind(this));
      element.addEventListener('mouseleave', this.onLinkLeave.bind(this));
    });
  }

  /**
   * Events.
   */
  onLinkEnter(event) {
    if (this.isHolding) return;

    this.focus = event.target.querySelector('[data-link-arrow]');
    this.magnet = event.target.querySelector('[data-link-magnet]');

    if (this.focus) {
      this.circle.scale.target = this.focus.clientWidth / 2 + this.ratio * 10;
    } else if (this.magnet) {
      this.circle.scale.target =
        this.magnet.children[0].clientWidth / 2 + this.ratio * 20;
    }
  }

  onLinkMove(event) {
    if (this.isHolding) return;

    if (this.magnet) {
      const magnetWidth = this.magnet.clientWidth;
      const magnetHeight = this.magnet.clientHeight;

      const { left, top } = getOffset(event.target);

      const dx = (event.clientX - left) / magnetWidth - 0.5;
      const dy = (event.clientY - top) / magnetHeight - 0.5;

      gsap.to(this.magnet, {
        x: dx * magnetWidth * 0.7,
        y: dy * magnetHeight * 0.7,
        duration: 0.3,
      });
    }
  }

  onLinkLeave() {
    if (this.isHolding) return;

    this.focus = null;

    if (this.magnet) {
      gsap.to(this.magnet, {
        x: 0,
        y: 0,
        duration: 0.3,
      });

      this.magnet = null;
    }

    this.circle.scale.target = 30;
  }

  onTouchDown() {
    if (this.focus) return;

    document.documentElement.style.pointerEvents = 'none';

    this.isHolding = true;

    this.circle.scale.target = 10;
    this.bullet.scale.target = 0;
    this.arrows.scale.target = 1;

    gsap.to(this.arrows, { color: 'rgba(255, 255, 255, 1)', duration: 0.3 });
  }

  onTouchMove(event) {
    this.mouse.x = event.touches ? event.touches[0].clientX : event.clientX;
    this.mouse.y = event.touches ? event.touches[0].clientY : event.clientY;
  }

  onTouchUp() {
    if (this.focus) return;

    document.documentElement.style.pointerEvents = '';

    this.isHolding = false;

    this.circle.scale.target = 30;
    this.bullet.scale.target = 3;
    this.arrows.scale.target = 0;

    gsap.to(this.arrows, {
      color: 'rgba(255, 255, 255, 0)',
      duration: 0.3,
    });
  }

  onResize(size) {
    this.ratio = size / 10;

    this.elements.canvas.width = window.innerWidth;
    this.elements.canvas.height = window.innerHeight;
  }

  onNavigationStart() {
    this.focus = null;

    if (this.magnet) {
      gsap.to(this.magnet, { x: 0, y: 0, duration: 0.3 });

      this.magnet = null;
    }

    each(this.elements.links, (element) => {
      element.removeEventListener('mouseenter', this.onLinkEnter.bind(this));
      element.removeEventListener('mousemove', this.onLinkMove.bind(this));
      element.removeEventListener('mouseleave', this.onLinkLeave.bind(this));
    });

    this.circle.scale.target = 0;
    this.bullet.scale.target = 0;
    this.arrows.scale.target = 0;
  }

  onNavigationEnd() {
    this.circle.scale.target = 30;
    this.bullet.scale.target = 3;
    this.arrows.scale.target = 0;

    window.requestAnimationFrame(() => {
      this.elements.links = document.querySelectorAll('[data-link]');

      each(this.elements.links, (element) => {
        element.addEventListener('mouseenter', this.onLinkEnter.bind(this));
        element.addEventListener('mousemove', this.onLinkMove.bind(this));
        element.addEventListener('mouseleave', this.onLinkLeave.bind(this));
      });
    });
  }

  /**
   * Update.
   */
  update() {
    if (!this.elements.canvas) return;

    this.circle.scale.value = lerp(
      this.circle.scale.value,
      this.circle.scale.target,
      0.1
    );
    this.bullet.scale.value = lerp(
      this.bullet.scale.value,
      this.bullet.scale.target,
      0.1
    );
    this.arrows.scale.value = lerp(
      this.arrows.scale.value,
      this.arrows.scale.target,
      0.1
    );

    let targetX = this.mouse.x;
    let targetY = this.mouse.y;

    this.bullet.position.x = targetX;
    this.bullet.position.y = targetY;

    const targetElement = this.focus || this.magnet;

    if (targetElement) {
      const { left, top } = getOffset(targetElement);

      targetX = left + targetElement.clientWidth * 0.5;
      targetY = top + targetElement.clientHeight * 0.5;
    }

    this.circle.position.x = lerp(
      this.circle.position.x,
      targetX,
      this.isHolding ? 1 : 0.1
    );
    this.circle.position.y = lerp(
      this.circle.position.y,
      targetY,
      this.isHolding ? 1 : 0.1
    );

    this.context.clearRect(
      0,
      0,
      this.elements.canvas.width,
      this.elements.canvas.height
    );

    // Circle
    this.context.beginPath();
    this.context.fillStyle = 'transparent';
    this.context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.context.lineWidth = 2;
    this.context.arc(
      this.circle.position.x,
      this.circle.position.y,
      this.circle.scale.value,
      0,
      2 * Math.PI
    );
    this.context.stroke();

    // Bullet
    this.context.beginPath();
    this.context.fillStyle = '#fff';
    this.context.arc(
      this.bullet.position.x,
      this.bullet.position.y,
      this.bullet.scale.value,
      0,
      2 * Math.PI
    );
    this.context.fill();

    // Arrows
    const trianglesHeight = 5 * (Math.sqrt(3) / 2);
    const trianglesWidth = 5;
    const trianglesY = map(this.arrows.scale.value, 0, 1, 0, 20);
    this.context.save();

    this.context.beginPath();
    this.context.fillStyle = this.arrows.color;
    this.context.translate(
      this.bullet.position.x,
      this.bullet.position.y - trianglesY
    );
    this.context.moveTo(0, -trianglesHeight / 2);
    this.context.lineTo(-trianglesWidth / 2, trianglesHeight / 2);
    this.context.lineTo(trianglesWidth / 2, trianglesHeight / 2);
    this.context.lineTo(0, -trianglesHeight / 2);
    this.context.fill();
    this.context.closePath();

    this.context.restore();
    this.context.save();

    this.context.beginPath();
    this.context.fillStyle = this.arrows.color;
    this.context.translate(
      this.bullet.position.x,
      this.bullet.position.y + trianglesY
    );
    this.context.rotate(Math.PI);
    this.context.moveTo(0, -trianglesHeight / 2);
    this.context.lineTo(-trianglesWidth / 2, trianglesHeight / 2);
    this.context.lineTo(trianglesWidth / 2, trianglesHeight / 2);
    this.context.lineTo(0, -trianglesHeight / 2);
    this.context.fill();
    this.context.closePath();

    this.context.restore();
  }
}
