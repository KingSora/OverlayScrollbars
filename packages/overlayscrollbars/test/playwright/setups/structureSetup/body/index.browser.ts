import '~/index.scss';
import './index.scss';
import './handleEnvironment';
import { OverlayScrollbars } from '~/overlayscrollbars';
import { ScrollbarsHidingPlugin } from '~/plugins';
import { setTestResult, timeout } from '@~local/browser-testing';
import should from 'should';

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
  return result < 1;
};

const startBtn: HTMLButtonElement | null = document.querySelector('#start');
const content: HTMLDivElement | null = document.querySelector('#content');
const start = async () => {
  setTestResult(null);

  try {
    should.ok(OverlayScrollbars.valid(osInstance));

    const { target, host, viewport } = osInstance.elements();
    const { scrollbarsHiding } = OverlayScrollbars.env();

    should.equal(target, document.body, 'Target is <BODY />.');
    if (scrollbarsHiding) {
      should.equal(host, document.documentElement, 'Host is <HTML />.');
      should.equal(viewport, document.documentElement, 'Viewport is <HTML />.');
    } else {
      should.equal(host, document.body, 'Host is <BODY />.');
    }

    const { overflowEdge, overflowAmount } = osInstance.state();
    const checkingElement = scrollbarsHiding ? document.documentElement : document.body;

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

    setTestResult(true);
  } catch (exception) {
    setTestResult(false);
    throw exception;
  }
};

startBtn?.addEventListener('click', start);
