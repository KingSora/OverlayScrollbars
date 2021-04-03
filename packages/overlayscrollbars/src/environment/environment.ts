import {
  createDOM,
  addClass,
  style,
  appendChildren,
  clientSize,
  absoluteCoordinates,
  offsetSize,
  scrollLeft,
  XY,
  removeAttr,
  removeElements,
  windowSize,
  runEach,
  equalBCRWH,
  getBoundingClientRect,
} from 'support';
import {
  classNameEnvironment,
  classNameEnvironmentFlexboxGlue,
  classNameEnvironmentFlexboxGlueMax,
  classNameViewportScrollbarStyling,
} from 'classnames';

export type OnEnvironmentChanged = (env: Environment) => void;
export interface Environment {
  _autoUpdateLoop: boolean;
  _nativeScrollbarSize: XY;
  _nativeScrollbarIsOverlaid: XY<boolean>;
  _nativeScrollbarStyling: boolean;
  _rtlScrollBehavior: { n: boolean; i: boolean };
  _flexboxGlue: boolean;
  _cssCustomProperties: boolean;
  _addListener(listener: OnEnvironmentChanged): void;
  _removeListener(listener: OnEnvironmentChanged): void;
}

let environmentInstance: Environment;
const { abs, round } = Math;

const getNativeScrollbarSize = (body: HTMLElement, measureElm: HTMLElement): XY => {
  appendChildren(body, measureElm);
  const cSize = clientSize(measureElm);
  const oSize = offsetSize(measureElm);

  return {
    x: oSize.h - cSize.h,
    y: oSize.w - cSize.w,
  };
};

const getNativeScrollbarStyling = (testElm: HTMLElement): boolean => {
  let result = false;
  addClass(testElm, classNameViewportScrollbarStyling);
  try {
    result =
      style(testElm, 'scrollbar-width') === 'none' || window.getComputedStyle(testElm, '::-webkit-scrollbar').getPropertyValue('display') === 'none';
  } catch (ex) {}

  return result;
};

const getRtlScrollBehavior = (parentElm: HTMLElement, childElm: HTMLElement): { i: boolean; n: boolean } => {
  const strHidden = 'hidden';
  style(parentElm, { overflowX: strHidden, overflowY: strHidden, direction: 'rtl' });
  scrollLeft(parentElm, 0);

  const parentOffset = absoluteCoordinates(parentElm);
  const childOffset = absoluteCoordinates(childElm);
  scrollLeft(parentElm, -999); // https://github.com/KingSora/OverlayScrollbars/issues/187
  const childOffsetAfterScroll = absoluteCoordinates(childElm);
  return {
    /**
     * origin direction = determines if the zero scroll position is on the left or right side
     * 'i' means 'invert' (i === true means that the axis must be inverted to be correct)
     * true = on the left side
     * false = on the right side
     */
    i: parentOffset.x === childOffset.x,
    /**
     * negative = determines if the maximum scroll is positive or negative
     * 'n' means 'negate' (n === true means that the axis must be negated to be correct)
     * true = negative
     * false = positive
     */
    n: childOffset.x !== childOffsetAfterScroll.x,
  };
};

const getFlexboxGlue = (parentElm: HTMLElement, childElm: HTMLElement): boolean => {
  addClass(parentElm, classNameEnvironmentFlexboxGlue);
  const minOffsetsizeParent = getBoundingClientRect(parentElm);
  const minOffsetsize = getBoundingClientRect(childElm);
  const supportsMin = equalBCRWH(minOffsetsize, minOffsetsizeParent, true);

  addClass(parentElm, classNameEnvironmentFlexboxGlueMax);
  const maxOffsetsizeParent = getBoundingClientRect(parentElm);
  const maxOffsetsize = getBoundingClientRect(childElm);
  const supportsMax = equalBCRWH(maxOffsetsize, maxOffsetsizeParent, true);

  return supportsMin && supportsMax;
};

const getWindowDPR = (): number => {
  // eslint-disable-next-line
  // @ts-ignore
  const dDPI = window.screen.deviceXDPI || 0;
  // eslint-disable-next-line
  // @ts-ignore
  const sDPI = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || dDPI / sDPI;
};

const diffBiggerThanOne = (valOne: number, valTwo: number): boolean => {
  const absValOne = abs(valOne);
  const absValTwo = abs(valTwo);
  return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
};

const createEnvironment = (): Environment => {
  const { body } = document;
  const envDOM = createDOM(`<div class="${classNameEnvironment}"><div></div></div>`);
  const envElm = envDOM[0] as HTMLElement;
  const envChildElm = envElm.firstChild as HTMLElement;

  const onChangedListener: Set<OnEnvironmentChanged> = new Set();
  const nativeScrollbarSize = getNativeScrollbarSize(body, envElm);
  const nativeScrollbarStyling = false; //getNativeScrollbarStyling(envElm); //TODO: Re - enable;
  const nativeScrollbarIsOverlaid = {
    x: nativeScrollbarSize.x === 0,
    y: nativeScrollbarSize.y === 0,
  };

  const env: Environment = {
    _autoUpdateLoop: false,
    _nativeScrollbarSize: nativeScrollbarSize,
    _nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
    _nativeScrollbarStyling: nativeScrollbarStyling,
    _cssCustomProperties: style(envElm, 'zIndex') === '-1',
    _rtlScrollBehavior: getRtlScrollBehavior(envElm, envChildElm),
    _flexboxGlue: getFlexboxGlue(envElm, envChildElm),
    _addListener(listener: OnEnvironmentChanged): void {
      onChangedListener.add(listener);
    },
    _removeListener(listener: OnEnvironmentChanged): void {
      onChangedListener.delete(listener);
    },
  };

  console.log(env);

  removeAttr(envElm, 'style');
  removeElements(envElm);

  if (!nativeScrollbarStyling && (!nativeScrollbarIsOverlaid.x || !nativeScrollbarIsOverlaid.y)) {
    let size = windowSize();
    let dpr = getWindowDPR();
    let scrollbarSize = nativeScrollbarSize;

    window.addEventListener('resize', () => {
      if (onChangedListener.size) {
        const sizeNew = windowSize();
        const deltaSize = {
          w: sizeNew.w - size.w,
          h: sizeNew.h - size.h,
        };

        if (deltaSize.w === 0 && deltaSize.h === 0) return;

        const deltaAbsSize = {
          w: abs(deltaSize.w),
          h: abs(deltaSize.h),
        };
        const deltaAbsRatio = {
          w: abs(round(sizeNew.w / (size.w / 100.0))),
          h: abs(round(sizeNew.h / (size.h / 100.0))),
        };
        const dprNew = getWindowDPR();
        const deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
        const difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
        const dprChanged = dprNew !== dpr && dpr > 0;
        const isZoom = deltaIsBigger && difference && dprChanged;

        if (isZoom) {
          const newScrollbarSize = (environmentInstance._nativeScrollbarSize = getNativeScrollbarSize(body, envElm));
          removeElements(envElm);

          if (scrollbarSize.x !== newScrollbarSize.x || scrollbarSize.y !== newScrollbarSize.y) {
            runEach(onChangedListener);
          }

          scrollbarSize = newScrollbarSize;
        }

        size = sizeNew;
        dpr = dprNew;
      }
    });
  }

  return env;
};

export const getEnvironment = (): Environment => {
  if (!environmentInstance) {
    environmentInstance = createEnvironment();
  }
  return environmentInstance;
};
