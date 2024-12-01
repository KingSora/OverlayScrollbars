import { strOverflowX, strOverflowY } from './support';

const dataAttributePrefix = `data-overlayscrollbars`;

// environment
export const classNameEnvironment = 'os-environment';
export const classNameEnvironmentScrollbarHidden = `${classNameEnvironment}-scrollbar-hidden`;

// initialize
export const dataAttributeInitialize = `${dataAttributePrefix}-initialize`;

// shared
export const dataValueNoClipping = 'noClipping';

// body
export const dataAttributeHtmlBody = `${dataAttributePrefix}-body`;

// host
export const dataAttributeHost = dataAttributePrefix;
export const dataValueHostIsHost = 'host';

// viewport
export const dataAttributeViewport = `${dataAttributePrefix}-viewport`;
export const dataValueViewportOverflowXPrefix = strOverflowX;
export const dataValueViewportOverflowYPrefix = strOverflowY;
export const dataValueViewportArrange = 'arrange';
export const dataValueViewportMeasuring = 'measuring';
export const dataValueViewportScrolling = 'scrolling';
export const dataValueViewportScrollbarHidden = 'scrollbarHidden';
export const dataValueViewportNoContent = 'noContent';

// padding
export const dataAttributePadding = `${dataAttributePrefix}-padding`;

// content
export const dataAttributeContent = `${dataAttributePrefix}-content`;

// size observer
export const classNameSizeObserver = 'os-size-observer';
export const classNameSizeObserverAppear = `${classNameSizeObserver}-appear`;
export const classNameSizeObserverListener = `${classNameSizeObserver}-listener`;
export const classNameSizeObserverListenerScroll = `${classNameSizeObserverListener}-scroll`;
export const classNameSizeObserverListenerItem = `${classNameSizeObserverListener}-item`;
export const classNameSizeObserverListenerItemFinal = `${classNameSizeObserverListenerItem}-final`;

// trinsic observer
export const classNameTrinsicObserver = 'os-trinsic-observer';

// scrollbars
export const classNameScrollbarThemeNone = 'os-theme-none';
export const classNameScrollbar = 'os-scrollbar';
export const classNameScrollbarRtl = `${classNameScrollbar}-rtl`;
export const classNameScrollbarHorizontal = `${classNameScrollbar}-horizontal`;
export const classNameScrollbarVertical = `${classNameScrollbar}-vertical`;
export const classNameScrollbarTrack = `${classNameScrollbar}-track`;
export const classNameScrollbarHandle = `${classNameScrollbar}-handle`;
export const classNameScrollbarVisible = `${classNameScrollbar}-visible`;
export const classNameScrollbarCornerless = `${classNameScrollbar}-cornerless`;
export const classNameScrollbarTransitionless = `${classNameScrollbar}-transitionless`;
export const classNameScrollbarInteraction = `${classNameScrollbar}-interaction`;
export const classNameScrollbarUnusable = `${classNameScrollbar}-unusable`;
export const classNameScrollbarAutoHide = `${classNameScrollbar}-auto-hide`;
export const classNameScrollbarAutoHideHidden = `${classNameScrollbarAutoHide}-hidden`;
export const classNameScrollbarWheel = `${classNameScrollbar}-wheel`;
export const classNameScrollbarTrackInteractive = `${classNameScrollbarTrack}-interactive`;
export const classNameScrollbarHandleInteractive = `${classNameScrollbarHandle}-interactive`;
