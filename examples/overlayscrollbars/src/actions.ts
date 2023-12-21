import { OverlayScrollbars } from 'overlayscrollbars';
import { eventObserver } from './events.ts';

let osInstance: OverlayScrollbars | undefined;
let contentHidden = false;
let elementHidden = false;
let overlayScrollbarsApplied = true;
const activateEvent = eventObserver();

const target = document.querySelector('#target') as HTMLElement;
const targetContent = document.querySelector('#targetContent') as HTMLElement;
const impostor = document.querySelector('#impostor') as HTMLElement;
const scrollButton = document.querySelector('#scrollButton') as HTMLButtonElement;
const toggleContentButton = document.querySelector('#toggleContentButton') as HTMLButtonElement;
const toggleElementButton = document.querySelector('#toggleElementButton') as HTMLButtonElement;
const toggleOverlayScrollbarsButton = document.querySelector(
  '#toggleOverlayScrollbarsButton'
) as HTMLButtonElement;

const updateToggleContent = () => {
  if (contentHidden) {
    targetContent.style.display = 'none';
    toggleContentButton.textContent = 'Show Content';
  } else {
    targetContent.style.display = '';
    toggleContentButton.textContent = 'Hide Content';
  }
};
const updateToggleElement = () => {
  if (elementHidden) {
    target.style.display = 'none';
    toggleElementButton.textContent = 'Show Element';
  } else {
    target.style.display = '';
    toggleElementButton.textContent = 'Hide Element';
  }
};
const updateUseOverlayScrollbars = () => {
  if (overlayScrollbarsApplied) {
    impostor.parentElement?.append(target);
    impostor.remove();

    scrollButton.style.display = '';
    toggleContentButton.style.display = '';
    toggleElementButton.style.display = '';
    toggleOverlayScrollbarsButton.textContent = 'Destroy OverlayScrollbars';

    osInstance = OverlayScrollbars(
      target,
      {},
      {
        initialized: () => activateEvent('initialized'),
        destroyed: () => activateEvent('destroyed'),
        updated: () => activateEvent('updated'),
        scroll: () => activateEvent('scroll'),
      }
    );
  } else {
    osInstance?.destroy();

    target.parentElement?.append(impostor);
    target.remove();

    impostor.style.display = '';
    scrollButton.style.display = 'none';
    toggleContentButton.style.display = 'none';
    toggleElementButton.style.display = 'none';
    toggleOverlayScrollbarsButton.textContent = 'Initialize OverlayScrollbars';
  }
};

scrollButton.addEventListener('click', () => {
  if (!osInstance) {
    return;
  }

  const { overflowAmount } = osInstance.state();
  const { scrollOffsetElement } = osInstance.elements();
  const { scrollLeft, scrollTop } = scrollOffsetElement;

  scrollOffsetElement.scrollTo({
    behavior: 'smooth',
    left: Math.round((overflowAmount.x - scrollLeft) / overflowAmount.x) * overflowAmount.x,
    top: Math.round((overflowAmount.y - scrollTop) / overflowAmount.y) * overflowAmount.y,
  });
});
toggleContentButton.addEventListener('click', () => {
  contentHidden = !contentHidden;
  updateToggleContent();
});
toggleElementButton.addEventListener('click', () => {
  elementHidden = !elementHidden;
  updateToggleElement();
});
toggleOverlayScrollbarsButton.addEventListener('click', () => {
  overlayScrollbarsApplied = !overlayScrollbarsApplied;
  updateUseOverlayScrollbars();
});

updateToggleContent();
updateToggleElement();
updateUseOverlayScrollbars();
