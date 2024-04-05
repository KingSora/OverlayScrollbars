import '~/index.scss';
import './index.scss';
import should from 'should';
import { timeout, setTestResult, waitForOrFailTest, resize } from '@~local/browser-testing';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { addClass, each, isArray, removeAttrs, getStyles, setStyles } from '~/support';
import { ScrollbarsHidingPlugin, SizeObserverPlugin } from '~/plugins';

console.log(OverlayScrollbars.env());

if (!window.ResizeObserver) {
  OverlayScrollbars.plugin(SizeObserverPlugin);
}
if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

// @ts-ignore
window.OverlayScrollbars = OverlayScrollbars;

OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false },
});

const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const targetRoot: HTMLElement | null = document.querySelector('#targetRoot');
const targetA: HTMLElement | null = document.querySelector('#targetA');
const targetB: HTMLElement | null = document.querySelector('#targetB');
const targetC: HTMLElement | null = document.querySelector('#targetC');
const updatesRootSlot: HTMLElement | null = document.querySelector('#updatesRoot');
const updatesASlot: HTMLElement | null = document.querySelector('#updatesA');
const updatesBSlot: HTMLElement | null = document.querySelector('#updatesB');
const updatesCSlot: HTMLElement | null = document.querySelector('#updatesC');
const resizeRoot: HTMLElement | null = document.querySelector('#resizeRoot');
const resizeA: HTMLElement | null = document.querySelector('#resizeA');
const resizeB: HTMLElement | null = document.querySelector('#resizeB');
const resizeC: HTMLElement | null = document.querySelector('#resizeC');
const resizeBetweenRoot: HTMLElement | null = document.createElement('div');
const resizeBetweenA: HTMLElement | null = document.createElement('div');
const resizeBetweenB: HTMLElement | null = document.createElement('div');
const resizeBetweenC: HTMLElement | null = document.createElement('div');

let rootUpdateCount = 0;
let aUpdateCount = 0;
let bUpdateCount = 0;
let cUpdateCount = 0;

const rootInstance = OverlayScrollbars(
  { target: targetRoot!, elements: { padding: true } },
  {},
  {
    initialized() {
      requestAnimationFrame(() => {
        addClass(rootInstance.elements().content, 'flex');
        addClass(resizeBetweenRoot, 'resize resizeBetween');
        targetRoot!.append(resizeBetweenRoot);
      });
    },
    updated() {
      rootUpdateCount++;
      requestAnimationFrame(() => {
        if (updatesRootSlot) {
          updatesRootSlot.textContent = `${rootUpdateCount}`;
        }
      });
    },
  }
);
const aInstance = OverlayScrollbars(
  { target: targetA!, elements: { content: true } },
  {},
  {
    initialized() {
      requestAnimationFrame(() => {
        addClass(aInstance.elements().content, 'flex');
        addClass(resizeBetweenA, 'resize resizeBetween');
        targetA!.append(resizeBetweenA);
      });
    },
    updated() {
      aUpdateCount++;
      requestAnimationFrame(() => {
        if (updatesASlot) {
          updatesASlot.textContent = `${aUpdateCount}`;
        }
      });
    },
  }
);
const bInstance = OverlayScrollbars(
  targetB!,
  {},
  {
    initialized() {
      requestAnimationFrame(() => {
        addClass(bInstance.elements().content, 'flex');
        addClass(resizeBetweenB, 'resize resizeBetween');
        targetB!.append(resizeBetweenB);
      });
    },
    updated() {
      bUpdateCount++;
      requestAnimationFrame(() => {
        if (updatesBSlot) {
          updatesBSlot.textContent = `${bUpdateCount}`;
        }
      });
    },
  }
);
OverlayScrollbars(
  { target: targetC!, elements: { viewport: targetC! } },
  {},
  {
    initialized() {
      addClass(resizeBetweenC, 'resize resizeBetween');
      targetC!.append(resizeBetweenC);
    },
    updated() {
      cUpdateCount++;
      requestAnimationFrame(() => {
        if (updatesCSlot) {
          updatesCSlot.textContent = `${cUpdateCount}`;
        }
      });
    },
  }
);

resize(resizeRoot!);
resize(resizeA!);
resize(resizeB!);
resize(resizeC!);
resize(resizeBetweenRoot!);
resize(resizeBetweenA!);
resize(resizeBetweenB!);
resize(resizeBetweenC!);

const resizeBetween = async (betweenElm: HTMLElement) => {
  const styleObj = {
    width: parseInt(getStyles(betweenElm, 'width'), 10) + 50,
    height: parseInt(getStyles(betweenElm, 'height'), 10) + 50,
  };
  const updateCountsBefore = [rootUpdateCount, aUpdateCount, bUpdateCount, cUpdateCount];
  setStyles(betweenElm, styleObj);

  await timeout(250);
  const updateCountsAfter = [rootUpdateCount, aUpdateCount, bUpdateCount, cUpdateCount];

  should.equal(
    JSON.stringify(updateCountsBefore),
    JSON.stringify(updateCountsAfter),
    `Resizing a between element shouldn't trigger any updates.`
  );
  removeAttrs(betweenElm, 'style');
};

const resizeResizer = async (resizeElm: HTMLElement) => {
  const styleObj = {
    width: parseInt(getStyles(resizeElm, 'width'), 10) - 10,
    height: parseInt(getStyles(resizeElm, 'height'), 10) - 10,
  };
  const updateCountsBefore = [rootUpdateCount, aUpdateCount, bUpdateCount, cUpdateCount];
  setStyles(resizeElm, styleObj);

  await timeout(250);
  const updateCountsAfter = [rootUpdateCount, aUpdateCount, bUpdateCount, cUpdateCount];

  should.equal(
    JSON.stringify(updateCountsBefore),
    JSON.stringify(updateCountsAfter),
    `Non size changing mutations shouldn't trigger any updates.`
  );
  removeAttrs(resizeElm, 'style');
};

const overwriteScrollHeight = (elm: HTMLElement | HTMLElement[]) => {
  const elements = isArray(elm) ? elm : [elm];

  each(elements, (currElm) => {
    Object.defineProperty(currElm, 'scrollHeight', {
      configurable: true,
      get() {
        setTestResult(false);
        throw new Error('accessed scrollHeight');
      },
    });
  });
};

const testBetweenElements = async () => {
  overwriteScrollHeight([
    rootInstance.elements().viewport,
    aInstance.elements().viewport,
    bInstance.elements().viewport,
  ]);
  await waitForOrFailTest(async () => {
    await resizeBetween(resizeBetweenRoot);
    await resizeBetween(resizeBetweenA);
    await resizeBetween(resizeBetweenB);
  });
};

const testResizeElements = async () => {
  await waitForOrFailTest(
    async () => {
      await resizeResizer(resizeRoot!);
      await resizeResizer(resizeA!);
      await resizeResizer(resizeB!);
      await resizeResizer(resizeC!);
    },
    { timeout: 5000 }
  );
};

const start = async () => {
  setTestResult(null);

  await testResizeElements();
  await timeout(100);
  await testBetweenElements(); // has to be last

  setTestResult(true);
};

startBtn?.addEventListener('click', start);
