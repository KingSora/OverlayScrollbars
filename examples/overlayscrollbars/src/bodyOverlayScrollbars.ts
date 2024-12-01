import { OverlayScrollbars } from 'overlayscrollbars';

let bodyOverlayScrollbarsApplied: boolean | null = null;

const initBodyOverlayScrollbars = (force?: boolean) =>
  OverlayScrollbars(
    {
      target: document.body,
      cancel: {
        body: force ? false : null,
      },
    },
    {
      scrollbars: {
        clickScroll: true,
      },
    }
  ).state().destroyed;

const toggleBodyOverlayScrollbarsSection = document.querySelector(
  '#toggleBodyOverlayScrollbarsSection'
) as HTMLElement;
const toggleBodyOverlayScrollbarsButton = document.querySelector(
  '#toggleBodyOverlayScrollbarsButton'
) as HTMLButtonElement;

const updateToggleBodyOverlayScrollbarsSection = () => {
  if (bodyOverlayScrollbarsApplied === null) {
    bodyOverlayScrollbarsApplied = !initBodyOverlayScrollbars();
  }

  toggleBodyOverlayScrollbarsSection.style.display = '';
  toggleBodyOverlayScrollbarsButton.style.display = '';
  toggleBodyOverlayScrollbarsButton.textContent = `${
    bodyOverlayScrollbarsApplied ? 'Destroy' : 'Initialize'
  } Body OverlayScrollbars`;
};

toggleBodyOverlayScrollbarsButton.addEventListener('click', () => {
  const bodyOsInstance = OverlayScrollbars(document.body);
  if (bodyOsInstance) {
    bodyOsInstance.destroy();
    bodyOverlayScrollbarsApplied = false;
  } else {
    bodyOverlayScrollbarsApplied = !initBodyOverlayScrollbars(true);
  }

  updateToggleBodyOverlayScrollbarsSection();
});

updateToggleBodyOverlayScrollbarsSection();
