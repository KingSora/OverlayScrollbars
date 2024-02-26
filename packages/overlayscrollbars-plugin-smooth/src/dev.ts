import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';
import { OverlayScrollbarsPluginSmooth } from '.';
import type { XY } from './utils';

const targetElm = document.querySelector<HTMLElement>('.target')!;
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;

OverlayScrollbars.plugin(OverlayScrollbarsPluginSmooth);

// @ts-ignore
const osInstance = (window.osInstance = OverlayScrollbars(
  targetElm,
  {},
  {
    initialized: (instance) => {
      const pluginInstance = instance.plugin(OverlayScrollbarsPluginSmooth);
      pluginInstance &&
        pluginInstance.initialize({
          onOverscroll(overscrollInfo) {
            console.log(overscrollInfo);
          },
          onAnimationStop(animationInfo) {
            console.log(animationInfo, 'stop');
          },
        });
    },
  }
));

const drawCanvas = () => {
  const dpr = window.devicePixelRatio;
  const size = { x: 1000, y: 4000 };
  const points: XY<number>[] = [];
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  console.log(window.innerWidth);

  canvas.width = size.x * dpr;
  canvas.height = size.y * dpr;

  console.log(canvas.width, canvas.height);

  ctx.scale(dpr, dpr);

  const render = () => {
    if (points.length >= size.x) {
      points.shift();
    }

    points.push({ x: 0, y: osInstance.elements().scrollOffsetElement.scrollTop });

    ctx.clearRect(0, 0, size.x, size.y);

    ctx.lineWidth = 3;

    ctx.beginPath();
    points.forEach(({ y }, i) => {
      ctx.moveTo(i, y);
      const next = points[i + 1];
      if (next) {
        ctx.lineTo(i + 1, next.y);
      }
    });
    ctx.stroke();

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
};

// drawCanvas();
