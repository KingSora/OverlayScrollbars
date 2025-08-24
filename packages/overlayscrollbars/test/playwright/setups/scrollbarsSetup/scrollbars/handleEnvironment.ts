{
  const { body } = document;
  const url = new URL(window.location.toString());
  const params = url.searchParams;

  /**
   * scrollT: disable scrollTimeline
   */
  ['scrollT', 'nsh'].forEach((param) => {
    const paramValue = Boolean(params.get(param));

    if (paramValue) {
      body.classList.add(param);
    } else {
      document.getElementById(param)?.addEventListener('click', () => {
        params.set(param, 'true');
        window.location.assign(url.toString());
      });
    }
  });

  const withoutScrollTimeline = document.body.classList.contains('scrollT');
  if (withoutScrollTimeline) {
    // @ts-ignore
    window.ScrollTimeline = undefined;
  }
}
