import { validateOptions, assignDeep } from 'support';
import { Options, optionsTemplate } from 'options';
import { TargetElement } from 'overlayscrollbars';
import { Environment } from 'environment';

let ENVIRONMENT: Environment;

interface UpdateHints {
  _changedOptions: Options;
}

interface OverlayScrollbarsInstanceVars {
  _documentElm: Document;
  _windowElm: Window;
  _htmlElm: HTMLElement;
  _bodyElm: HTMLElement;
  _targetElm: TargetElement;
  _isTextarea: boolean;
  _isBody: boolean;
  _currentOptions: Options;
  _setOptions(newOptions: Options): Options;
  _update(updateHints: UpdateHints): void;
}
/*
const initSingletons = () => {
  if (!ENVIRONMENT) {
    ENVIRONMENT = new Environment();
  }
};

export class OverlayScrollbars {
  #instanceVars: OverlayScrollbarsInstanceVars = {
    _setOptions(newOptions: Options): Options {
      const { _currentOptions } = this;
      const { _validated } = validateOptions(newOptions, optionsTemplate, _currentOptions, true);

      this._currentOptions = assignDeep({}, _currentOptions, _validated);

      return _validated;
    },
  };

  constructor(target: HTMLElement, options: Options) {
    this.#instanceVars._documentElm = document;
    this.#instanceVars._windowElm = window;
    this.#instanceVars._htmlElm = document.body;
    this.#instanceVars._bodyElm = document.body;
    this.#instanceVars._targetElm = document.body;
    this.#instanceVars._isTextarea = false;
    this.#instanceVars._isBody = false;
    initSingletons();
  }
}
*/
