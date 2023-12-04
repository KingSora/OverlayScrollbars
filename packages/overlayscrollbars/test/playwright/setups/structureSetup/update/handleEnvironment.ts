import { addClass } from '~/support';

{
  const { body } = document;
  const url = new URL(window.location.toString());
  const params = url.searchParams;

  /**
   * fast: faster but not so accurate run
   * nsh: native scrollbar hiding
   * po: partially overlaid
   * fo: fully overlaid
   * vpt: viewport is target
   * pa: padding absolute
   */
  ['fast', 'nsh', 'po', 'fo', 'vpt', 'pa'].forEach((param) => {
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
