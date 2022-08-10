// remove jsdom warning for not implemented second argument for window.getComputedStyle
try {
  const cmptdStyle = window.getComputedStyle;
  window.getComputedStyle = (a) => cmptdStyle(a);
} catch {}
