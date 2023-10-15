type ResizeListener = (width: number, height: number) => void;
interface WH<T = number> {
  w: T;
  h: T;
}
interface XY<T = number> {
  x: T;
  y: T;
}

const splitEventNames = (eventNames: string) => eventNames.split(' ');
const on = <T extends Event = Event>(
  target: EventTarget,
  eventNames: string,
  listener: (event: T) => any
): void => {
  splitEventNames(eventNames).forEach((eventName) => {
    target.addEventListener(eventName, listener as EventListener);
  });
};
const off = <T extends Event = Event>(
  target: EventTarget,
  eventNames: string,
  listener: (event: T) => any
): void => {
  splitEventNames(eventNames).forEach((eventName) => {
    target.removeEventListener(eventName, listener as EventListener);
  });
};
const clientSize = (elm: HTMLElement): WH => ({
  w: elm.clientWidth,
  h: elm.clientHeight,
});

export const resize = (element: HTMLElement) => {
  const resizeListeners: ResizeListener[] = [];
  const strMouseTouchDownEvent = 'mousedown touchstart';
  const strMouseTouchUpEvent = 'mouseup touchend';
  const strMouseTouchMoveEvent = 'mousemove touchmove';
  const strSelectStartEvent = 'selectstart';
  const dragStartSize: WH<number> = { w: 0, h: 0 };
  const dragStartPosition: XY<number> = { x: 0, y: 0 };
  const resizeBtn = document.createElement('div');
  resizeBtn.classList.add('resizeBtn');
  element.append(resizeBtn);
  element.classList.add('resizer');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let dragResizeBtn: HTMLElement | undefined;
  let dragResizer: HTMLElement | undefined;

  const onSelectStart = (event: Event) => {
    event.preventDefault();
    return false;
  };

  const resizerResize = (event: MouseEvent | TouchEvent) => {
    const isTouchEvent = (event as TouchEvent).touches !== undefined;
    const mouseOffsetHolder = isTouchEvent
      ? (event as TouchEvent).touches[0]
      : (event as MouseEvent);

    const sizeStyle = {
      width: dragStartSize.w + mouseOffsetHolder.pageX - dragStartPosition.x,
      height: dragStartSize.h + mouseOffsetHolder.pageY - dragStartPosition.y,
    };

    dragResizer!.style.width = `${sizeStyle.width}px`;
    dragResizer!.style.height = `${sizeStyle.height}px`;

    resizeListeners.forEach((listener: ResizeListener) => {
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
    const mouseOffsetHolder = isTouchEvent
      ? (event as TouchEvent).touches[0]
      : (event as MouseEvent);

    if (correctButton || isTouchEvent) {
      dragStartPosition.x = mouseOffsetHolder.pageX;
      dragStartPosition.y = mouseOffsetHolder.pageY;

      dragResizeBtn = currentTarget as HTMLElement;
      dragResizer = (currentTarget as HTMLElement).parentElement as HTMLElement;

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
    resizeBtn,
    addResizeListener(listener: ResizeListener) {
      resizeListeners.push(listener);
    },
  };
};
