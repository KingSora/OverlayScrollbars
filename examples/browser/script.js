const { OverlayScrollbars, ClickScrollPlugin } = OverlayScrollbarsGlobal;

// optional: use the ClickScrollPlugin to make the option "scrollbars.clickScroll: true" available
OverlayScrollbars.plugin(ClickScrollPlugin);

OverlayScrollbars(document.body, {
  scrollbars: {
    clickScroll: true,
  },
});
OverlayScrollbars(document.getElementById('target'), {});
