import { addClass } from 'support';

{
  const { body } = document;
  const url = new URL(window.location.toString());
  const params = url.searchParams;

  ['nss', 'fbg', 'ccp', 'po', 'fo', 'tvp'].forEach((param) => {
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
