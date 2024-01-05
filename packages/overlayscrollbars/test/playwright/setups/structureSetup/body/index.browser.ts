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

    should.equal(target, document.body);
    if (OverlayScrollbars.env().scrollbarsHiding) {
      should.equal(host, document.documentElement);
      should.equal(viewport, document.documentElement);
    } else {
      should.equal(host, document.body);
    }

    const { overflowEdge, overflowAmount } = osInstance.state();

    should.ok(plusMinusSame(overflowEdge.x, document.body.clientWidth));
    should.ok(plusMinusSame(overflowEdge.y, document.body.clientHeight));
    should.ok(plusMinusSame(overflowAmount.x, document.body.clientWidth / 2));
    should.ok(plusMinusSame(overflowAmount.y, document.body.clientHeight / 2));

    content!.style.display = 'none';
    await timeout(500);

    const { overflowEdge: overflowEdge2, overflowAmount: overflowAmount2 } = osInstance.state();

    should.ok(plusMinusSame(overflowEdge2.x, document.body.clientWidth));
    should.ok(plusMinusSame(overflowEdge2.y, document.body.clientHeight));
    should.equal(overflowAmount2.x, 0);
    should.equal(overflowAmount2.y, 0);

    content!.style.display = '';
    await timeout(500);

    const { overflowEdge: overflowEdge3, overflowAmount: overflowAmount3 } = osInstance.state();

    should.ok(plusMinusSame(overflowEdge3.x, document.body.clientWidth));
    should.ok(plusMinusSame(overflowEdge3.y, document.body.clientHeight));
    should.ok(plusMinusSame(overflowAmount3.x, document.body.clientWidth / 2));
    should.ok(plusMinusSame(overflowAmount3.y, document.body.clientHeight / 2));

    setTestResult(true);
  } catch {
    setTestResult(false);
  }
};

startBtn?.addEventListener('click', start);
