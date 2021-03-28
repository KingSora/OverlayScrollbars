import 'overlayscrollbars.scss';
import './index.scss';
import { createDiv, appendChildren, parent, style, on, off, addClass, WH, XY, clientSize } from 'support';
import { OverlayScrollbars } from 'overlayscrollbars/OverlayScrollbars';

const targetElm = document.querySelector('#target') as HTMLElement;
window.os = OverlayScrollbars(targetElm);

export const resize = (element: HTMLElement) => {
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

  const resizerResize = (event: MouseEvent) => {
    const sizeStyle = {
      width: dragStartSize.w + event.pageX - dragStartPosition.x,
      height: dragStartSize.h + event.pageY - dragStartPosition.y,
    };

    style(dragResizer, sizeStyle);
    event.stopPropagation();
  };

  const resizerResized = (event: MouseEvent) => {
    off(document, 'selectstart', onSelectStart);
    off(document, 'mousemove', resizerResize);
    off(document, 'mouseup', resizerResized);

    dragResizer = undefined;
    dragResizeBtn = undefined;
  };

  on(resizeBtn, 'mousedown', (event: MouseEvent) => {
    const { currentTarget } = event;
    if (event.buttons === 1 || event.which === 1) {
      dragStartPosition.x = event.pageX;
      dragStartPosition.y = event.pageY;

      dragResizeBtn = currentTarget as HTMLElement;
      dragResizer = parent(currentTarget as HTMLElement) as HTMLElement;

      const cSize = clientSize(element);
      dragStartSize.w = cSize.w;
      dragStartSize.h = cSize.h;

      on(document, 'selectstart', onSelectStart);
      on(document, 'mousemove', resizerResize);
      on(document, 'mouseup', resizerResized);

      event.preventDefault();
      event.stopPropagation();
    }
  });
};

resize(document.querySelector('#resize')!);
resize(document.querySelector('#target')!);
