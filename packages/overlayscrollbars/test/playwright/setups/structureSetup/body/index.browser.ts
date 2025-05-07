import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { setTestResult, timeout } from '@~local/browser-testing';
import should from 'should';
import { getStyles, setStyles } from '~/support';

console.log(OverlayScrollbars.env());

if (!OverlayScrollbars.env().scrollbarsHiding) {
  OverlayScrollbars.plugin(ScrollbarsHidingPlugin);
}

OverlayScrollbars.env().setDefaultInitialization({
  cancel: { nativeScrollbarsOverlaid: false },
});

// @ts-ignore
const osInstance = (window.os = OverlayScrollbars(
  { target: document.body, cancel: { body: false } },
  {}
));

const plusMinusSame = (a: number, b: number) => {
  const result = Math.abs(a - b);
  return result < 1.5;
};

const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const content: HTMLDivElement | null = document.querySelector('#content');
const scrollTarget: HTMLDivElement | null = document.querySelector('#scrollTarget');

const runMeasureTest = async () => {
  const { scrollbarsHiding } = OverlayScrollbars.env();
  const checkingElement = scrollbarsHiding ? document.documentElement : document.body;
  const { overflowEdge, overflowAmount } = osInstance.state();

  should.ok(
    plusMinusSame(overflowEdge.x, checkingElement.clientWidth),
    'OverflowEdgeX is ClientWidth.'
  );
  should.ok(
    plusMinusSame(overflowEdge.y, checkingElement.clientHeight),
    'OverflowEdgeY is ClienHeight.'
  );
  should.ok(
    plusMinusSame(overflowAmount.x, checkingElement.clientWidth / 2),
    'OverflowAmountX is ClientWidth / 2.'
  );
  should.ok(
    plusMinusSame(overflowAmount.y, checkingElement.clientHeight / 2),
    'OverflowAmountY is ClienHeight / 2.'
  );

  content!.style.display = 'none';
  await timeout(500);

  const { overflowEdge: overflowEdge2, overflowAmount: overflowAmount2 } = osInstance.state();

  should.ok(
    plusMinusSame(overflowEdge2.x, checkingElement.clientWidth),
    'OverflowEdgeX is ClientWidth. (round 2)'
  );
  should.ok(
    plusMinusSame(overflowEdge2.y, checkingElement.clientHeight),
    'OverflowEdgeY is ClienHeight. (round 2)'
  );
  should.equal(overflowAmount2.x, 0, 'OverflowAmountX is 0.');
  should.equal(overflowAmount2.y, 0, 'OverflowAmountY is 0.');

  content!.style.display = '';
  await timeout(500);

  const { overflowEdge: overflowEdge3, overflowAmount: overflowAmount3 } = osInstance.state();

  should.ok(
    plusMinusSame(overflowEdge3.x, checkingElement.clientWidth),
    'OverflowEdgeX is ClientWidth. (round 3)'
  );
  should.ok(
    plusMinusSame(overflowEdge3.y, checkingElement.clientHeight),
    'OverflowEdgeY is ClienHeight. (round 3)'
  );
  should.ok(
    plusMinusSame(overflowAmount3.x, checkingElement.clientWidth / 2),
    'OverflowAmountX is ClientWidth / 2. (round 3)'
  );
  should.ok(
    plusMinusSame(overflowAmount3.y, checkingElement.clientHeight / 2),
    'OverflowAmountY is ClienHeight / 2. (round 3)'
  );

  await timeout(500);
};

const runScrollTest = async () => {
  const { scrollOffsetElement } = osInstance.elements();

  scrollOffsetElement.scrollLeft = 99999;
  scrollOffsetElement.scrollTop = 99999;

  await timeout(500);

  should.ok(scrollOffsetElement.clientWidth >= scrollTarget!.getBoundingClientRect().right);
  should.ok(scrollOffsetElement.clientHeight >= scrollTarget!.getBoundingClientRect().bottom);

  scrollOffsetElement.scrollLeft = 0;
  scrollOffsetElement.scrollTop = 0;

  await timeout(500);
};

const start = async () => {
  setTestResult(null);

  try {
    should.ok(OverlayScrollbars.valid(osInstance));

    const { target, host, viewport, scrollbarHorizontal, scrollbarVertical } =
      osInstance.elements();
    const { scrollbarsHiding, scrollbarsOverlaid } = OverlayScrollbars.env();

    should.equal(target, document.body, 'Target is <BODY />.');
    if (scrollbarsHiding) {
      should.equal(host, document.documentElement, 'Host is <HTML />.');
      should.equal(viewport, document.documentElement, 'Viewport is <HTML />.');
    } else {
      should.equal(host, document.body, 'Host is <BODY />.');
    }

    // test native scrollbars visibility (https://github.com/KingSora/OverlayScrollbars/issues/713)
    if (scrollbarsHiding && scrollbarsOverlaid.x && scrollbarsOverlaid.y) {
      should.ok(
        getStyles(viewport, 'scrollbarWidth') === 'none',
        'Scrollbars width is none when native scrollbars should be hidden'
      );
      osInstance.options({ showNativeOverlaidScrollbars: true });
      await timeout(500);
      should.ok(
        getStyles(viewport, 'scrollbarWidth') === 'auto',
        'Scrollbars width is auto when native overlaid scrollbars should not be hidden'
      );
      osInstance.options({ showNativeOverlaidScrollbars: false });
      await timeout(500);
      should.ok(
        getStyles(viewport, 'scrollbarWidth') === 'none',
        'Scrollbars width is none when native scrollbars should be hidden2'
      );
    }

    // test overwritable overflow on body target (its common practice to hide scrollbars when modal is visible)
    if (scrollbarsHiding) {
      // hidden
      setStyles(viewport, {
        overflow: 'hidden',
      });
      await timeout(1000);
      should.ok(
        getStyles(scrollbarHorizontal.scrollbar, 'visibility') === 'hidden',
        'Overwritten overflow (hidden) hides horizontal scrollbar.'
      );
      should.ok(
        getStyles(scrollbarVertical.scrollbar, 'visibility') === 'hidden',
        'Overwritten overflow (hidden)hides vertical scrollbar.'
      );

      // auto
      setStyles(viewport, {
        overflow: 'auto',
      });
      await timeout(1000);
      should.ok(
        getStyles(scrollbarHorizontal.scrollbar, 'visibility') === 'visible',
        'Overwritten overflow (auto) shows horizontal scrollbar.'
      );
      should.ok(
        getStyles(scrollbarVertical.scrollbar, 'visibility') === 'visible',
        'Overwritten overflow (auto) shows vertical scrollbar.'
      );

      // visible
      setStyles(viewport, {
        overflow: 'visible',
      });
      await timeout(1000);
      should.ok(
        getStyles(scrollbarHorizontal.scrollbar, 'visibility') === 'hidden',
        'Overwritten overflow (visible) hides horizontal scrollbar.'
      );
      should.ok(
        getStyles(scrollbarVertical.scrollbar, 'visibility') === 'hidden',
        'Overwritten overflow (visible)hides vertical scrollbar.'
      );

      // revert
      setStyles(viewport, {
        overflow: '',
      });
      await timeout(1000);
      should.ok(
        getStyles(scrollbarHorizontal.scrollbar, 'visibility') === 'visible',
        'Reverted overwritten overflow shows horizontal scrollbar.'
      );
      should.ok(
        getStyles(scrollbarVertical.scrollbar, 'visibility') === 'visible',
        'Reverted overwritten overflow shows vertical scrollbar.'
      );
    }

    await runMeasureTest();
    await runScrollTest();
    /*
    document.documentElement.classList.add('margin');
    await runScrollTest();
    document.documentElement.classList.add('padding');
    await runScrollTest();
    */

    setTestResult(true);
  } catch (exception) {
    setTestResult(false);
    throw exception;
  }
};

startBtn?.addEventListener('click', start);
