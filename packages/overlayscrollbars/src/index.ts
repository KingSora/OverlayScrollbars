import { createDOM } from 'support/dom';
import { getEnvironment } from 'environment';
import { createSizeObserver } from 'overlayscrollbars/observers/SizeObserver';
import { createTrinsicObserver } from 'overlayscrollbars/observers/TrinsicObserver';

const abc = {
  a: 1,
  b: 1,
  c: 1,
};

export default () => {
  return [
    getEnvironment(),
    createSizeObserver(document.body, () => {}),
    createTrinsicObserver(document.body, () => {}),
    createDOM(
      '\
    <div class="os-host">\
        <div class="os-resize-observer-host"></div>\
        <div class="os-padding">\
            <div class="os-viewport">\
                <div class="os-content">\
                    fdfhdfgh\
                </div>\
            </div>\
        </div>\
        <div class="os-scrollbar os-scrollbar-horizontal">\
            <div class="os-scrollbar-track">\
                <div class="os-scrollbar-handle"></div>\
            </div>\
        </div>\
        <div class="os-scrollbar os-scrollbar-vertical">\
            <div class="os-scrollbar-track">\
                <div class="os-scrollbar-handle"></div>\
            </div>\
        </div>\
        <div class="os-scrollbar-corner"></div>\
    </div>'
    ),
  ];
};
