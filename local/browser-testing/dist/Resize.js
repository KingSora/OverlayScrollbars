// @ts-ignore
import { createDiv, appendChildren, parent, style, on, off, addClass, clientSize, each, } from './support';
export const resize = (element) => {
    const resizeListeners = [];
    const strMouseTouchDownEvent = 'mousedown touchstart';
    const strMouseTouchUpEvent = 'mouseup touchend';
    const strMouseTouchMoveEvent = 'mousemove touchmove';
    const strSelectStartEvent = 'selectstart';
    const dragStartSize = { w: 0, h: 0 };
    const dragStartPosition = { x: 0, y: 0 };
    const resizeBtn = createDiv('resizeBtn');
    appendChildren(element, resizeBtn);
    addClass(element, 'resizer');
    let dragResizeBtn;
    let dragResizer;
    const onSelectStart = (event) => {
        event.preventDefault();
        return false;
    };
    const resizerResize = (event) => {
        const isTouchEvent = event.touches !== undefined;
        const mouseOffsetHolder = isTouchEvent
            ? event.touches[0]
            : event;
        const sizeStyle = {
            width: dragStartSize.w + mouseOffsetHolder.pageX - dragStartPosition.x,
            height: dragStartSize.h + mouseOffsetHolder.pageY - dragStartPosition.y,
        };
        style(dragResizer, sizeStyle);
        each(resizeListeners, (listener) => {
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
    on(resizeBtn, strMouseTouchDownEvent, (event) => {
        const { currentTarget } = event;
        const correctButton = event.buttons === 1 || event.which === 1;
        const isTouchEvent = event.touches !== undefined;
        const mouseOffsetHolder = isTouchEvent
            ? event.touches[0]
            : event;
        if (correctButton || isTouchEvent) {
            dragStartPosition.x = mouseOffsetHolder.pageX;
            dragStartPosition.y = mouseOffsetHolder.pageY;
            dragResizeBtn = currentTarget;
            dragResizer = parent(currentTarget);
            const cSize = clientSize(element);
            dragStartSize.w = cSize.w;
            dragStartSize.h = cSize.h;
            on(document, strSelectStartEvent, onSelectStart, { _passive: false });
            on(document, strMouseTouchMoveEvent, resizerResize, { _passive: false });
            on(document, strMouseTouchUpEvent, resizerResized, { _passive: false });
            event.preventDefault();
            event.stopPropagation();
        }
    }, { _passive: false });
    return {
        addResizeListener(listener) {
            resizeListeners.push(listener);
        },
    };
};
//# sourceMappingURL=Resize.js.map