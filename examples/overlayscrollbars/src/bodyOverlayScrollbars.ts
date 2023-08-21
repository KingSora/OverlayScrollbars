import { OverlayScrollbars } from 'overlayscrollbars';

let useBodyOverlayScrollbars: boolean | null = null;

const initBodyOverlayScrollbars = (force?: boolean) =>
  OverlayScrollbars(
    {
      target: document.body,
      cancel: {
        body: force ? false : null,
      },
    },
    {}
  ).state().destroyed;

const toggleBodyOverlayScrollbarsSection = document.querySelector(
  '#toggleBodyOverlayScrollbarsSection'
) as HTMLElement;
const toggleBodyOverlayScrollbarsButton = document.querySelector(
  '#toggleBodyOverlayScrollbarsButton'
) as HTMLButtonElement;

const updateToggleBodyOverlayScrollbarsSection = () => {
  if (useBodyOverlayScrollbars === null) {
    useBodyOverlayScrollbars = !initBodyOverlayScrollbars();
  }

  toggleBodyOverlayScrollbarsSection.style.display = '';
  toggleBodyOverlayScrollbarsButton.style.display = '';
  toggleBodyOverlayScrollbarsButton.textContent = `${
    useBodyOverlayScrollbars ? 'Destroy' : 'Initialize'
  } Body OverlayScrollbars`;
};

toggleBodyOverlayScrollbarsButton.addEventListener('click', () => {
  const bodyOsInstance = OverlayScrollbars(document.body);
  if (bodyOsInstance) {
    bodyOsInstance.destroy();
  } else {
    initBodyOverlayScrollbars(true);
  }

  useBodyOverlayScrollbars = !useBodyOverlayScrollbars;
  updateToggleBodyOverlayScrollbarsSection();
});

updateToggleBodyOverlayScrollbarsSection();
