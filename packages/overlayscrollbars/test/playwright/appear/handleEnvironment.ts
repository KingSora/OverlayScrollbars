{
  const { body } = document;
  const url = new URL(window.location.toString());
  const params = url.searchParams;

  /**
   * autoHideSuspend: autoHideSuspend = true
   */
  ['autoHideSuspend'].forEach((param) => {
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
}
