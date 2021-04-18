// @ts-ignore
import { createDiv, appendChildren, parent, style, on, off, addClass, WH, XY, clientSize, each } from '@/overlayscrollbars/support';

type ResizeListener = (width: number, height: number) => void;

export const resize = (element: HTMLElement) => {
  const resizeListeners: ResizeListener[] = [];
  const strMouseTouchDownEvent = 'mousedown touchstart';
  const strMouseTouchUpEvent = 'mouseup touchend';
  const strMouseTouchMoveEvent = 'mousemove touchmove';
  const strSelectStartEvent = 'selectstart';
  const dragStartSize: WH<number> = { w: 0, h: 0 };
  const dragStartPosition: XY<number> = { x: 0, y: 0 };
  const resizeBtn = createDiv('resizeBtn');
  appendChildren(element, resizeBtn);
  addClass(element, 'resizer');

  let dragResizeBtn: HTMLElement | undefined;
  let dragResizer: HTMLElement | undefined;

  const onSelectStart = (event: Event) => {
    event.preventDefault();
    return false;
  };

  const resizerResize = (event: MouseEvent | TouchEvent) => {
    const isTouchEvent = (event as TouchEvent).touches !== undefined;
    const mouseOffsetHolder = isTouchEvent ? (event as TouchEvent).touches[0] : (event as MouseEvent);

    const sizeStyle = {
      width: dragStartSize.w + mouseOffsetHolder.pageX - dragStartPosition.x,
      height: dragStartSize.h + mouseOffsetHolder.pageY - dragStartPosition.y,
    };

    style(dragResizer, sizeStyle);

    each(resizeListeners, (listener: ResizeListener) => {
      if (listener) {
        listener(sizeStyle.width, sizeStyle.height);
      }
    });

    event.stopPropagation();
  };

  const resizerResized = () => {
    off(document, strSelectStartEvent, onSelectStart);
    off(document, strMouseTouchMoveEvent, resizerResize);
    off(document, strMouseTouchUpEvent, resizerResized);

    dragResizer = undefined;
    dragResizeBtn = undefined;
  };

  on(resizeBtn, strMouseTouchDownEvent, (event: MouseEvent | TouchEvent) => {
    const { currentTarget } = event;
    const correctButton = (event as MouseEvent).buttons === 1 || event.which === 1;
    const isTouchEvent = (event as TouchEvent).touches !== undefined;
    const mouseOffsetHolder = isTouchEvent ? (event as TouchEvent).touches[0] : (event as MouseEvent);

    if (correctButton || isTouchEvent) {
      dragStartPosition.x = mouseOffsetHolder.pageX;
      dragStartPosition.y = mouseOffsetHolder.pageY;

      dragResizeBtn = currentTarget as HTMLElement;
      dragResizer = parent(currentTarget as HTMLElement) as HTMLElement;

      const cSize = clientSize(element);
      dragStartSize.w = cSize.w;
      dragStartSize.h = cSize.h;

      on(document, strSelectStartEvent, onSelectStart);
      on(document, strMouseTouchMoveEvent, resizerResize);
      on(document, strMouseTouchUpEvent, resizerResized);

      event.preventDefault();
      event.stopPropagation();
    }
  });

  return {
    addResizeListener(listener: ResizeListener) {
      resizeListeners.push(listener);
    },
  };
};
