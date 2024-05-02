export const strPaddingTop = 'paddingTop';
export const strPaddingRight = 'paddingRight';
export const strPaddingLeft = 'paddingLeft';
export const strPaddingBottom = 'paddingBottom';
export const strMarginLeft = 'marginLeft';
export const strMarginRight = 'marginRight';
export const strMarginBottom = 'marginBottom';
export const strOverflowX = 'overflowX';
export const strOverflowY = 'overflowY';
export const strWidth = 'width';
export const strHeight = 'height';
export const strVisible = 'visible';
export const strHidden = 'hidden';
export const strScroll = 'scroll';

export const capitalizeFirstLetter = (str: string | number | false | null | undefined): string => {
  const finalStr = String(str || '');
  return finalStr ? finalStr[0].toUpperCase() + finalStr.slice(1) : '';
};
