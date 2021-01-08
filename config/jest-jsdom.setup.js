// remove jsdom warning for not implemented second argument for window.getComputedStyle
const cmptdStyle = window.getComputedStyle;
window.getComputedStyle = (a) => cmptdStyle(a);
