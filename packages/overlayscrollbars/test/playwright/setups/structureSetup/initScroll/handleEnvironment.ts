import { addClass } from '~/support';

{
  const { body } = document;
  const url = new URL(window.location.toString());
  const params = url.searchParams;

  /**
   * vpt: viewport is target
   * vps: viewport is element with valid scroll
   * vp: viewport is element without valid scroll
   */
  ['vpt', 'vps', 'vp'].forEach((param) => {
    const paramValue = Boolean(params.get(param));

    if (paramValue) {
      addClass(body, param);
    } else {
      document.getElementById(param)?.addEventListener('click', () => {
        params.set(param, 'true');
        window.location.assign(url.toString());
      });
    }
  });
}
