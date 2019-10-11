<p align="center">
    <a href="https://vuejs.org/"><img src="https://kingsora.github.io/OverlayScrollbars/frameworks/vue/logo.svg" width="200" height="133" alt="Vue"></a>
    <a href="https://kingsora.github.io/OverlayScrollbars/"><img src="https://kingsora.github.io/OverlayScrollbars/design/logo.svg" width="200" height="133" alt="OverlayScrollbars"></a>
</p>
<h6 align="center">
    <a href="https://github.com/vuejs/vue"><img src="https://img.shields.io/badge/Vue-%5E2.6.0-41B883?style=flat-square&logo=vue.js" alt="Vue"></a>
    <a href="https://github.com/KingSora/OverlayScrollbars"><img src="https://img.shields.io/badge/OverlayScrollbars-%5E1.10.0-36befd?style=flat-square" alt="OverlayScrollbars"></a>
    <a href="https://www.npmjs.com/package/overlayscrollbars-vue"><img src="https://img.shields.io/npm/dt/overlayscrollbars-vue.svg?style=flat-square" alt="Downloads"></a>
    <a href="https://github.com/KingSora/OverlayScrollbars/blob/master/packages/overlayscrollbars-vue/LICENSE"><img src="https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square" alt="License"></a>
</h6>
<h3 align="center">
    <a href="https://kingsora.github.io/OverlayScrollbars/frameworks/vue/">Example</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!documentation">Documentation</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!faq">FAQ</a>
</h3>
<h5 align="center">
    The official OverlayScrollbars wrapper for Vue.
</h5>

## Installation
```sh
npm install overlayscrollbars-vue
```

## Peer Dependencies
OverlayScrollbars for Vue has the following **peer dependencies**:
- The vanilla JavaScript library: [overlayscrollbars](https://www.npmjs.com/package/overlayscrollbars) 
```
npm install overlayscrollbars
```
- The Vue framework: [vue](https://www.npmjs.com/package/vue)
```
npm install vue
```

## TypeScript
- In case you are using TypeScript, you have to install the [OverlayScrollbars typings](https://www.npmjs.com/package/@types/overlayscrollbars):
```
npm install @types/overlayscrollbars
```
Since this wrapper is written in TypeScript it comes with its generated typings.<br>
Check out the [recommended](https://github.com/KingSora/OverlayScrollbars#typescript) **tsconfig.json** options.

## Usage
#### CSS
You have to import the `OverlayScrollbars.css` by yourself.<br>
The component **doesn't** do it for you as the styles are **global styles**!<br>
There are different ways to achieve this, in Vue the most simple way for me was to add [this line](https://github.com/KingSora/OverlayScrollbars/blob/master/packages/overlayscrollbars-vue/example/src/main.ts#L1) in the `main` file:
```js
import 'overlayscrollbars/css/OverlayScrollbars.css';
```

#### Import
With the [Vue.use](https://vuejs.org/v2/api/#Vue-use) method you can register the wrapper globally:
```js
import Vue from 'vue';
import { OverlayScrollbarsPlugin } from 'overlayscrollbars-vue';

Vue.use(OverlayScrollbarsPlugin);
```
In case you wanna register the Component manually via [global](https://vuejs.org/v2/guide/components-registration.html#Global-Registration) or [local](https://vuejs.org/v2/guide/components-registration.html#Local-Registration) registration, you can simply import it and do whatever you want with it:
```js
import Vue from 'vue';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';

// global registration
Vue.component('overlay-scrollbars', OverlayScrollbarsComponent);

// local registration
new Vue({
  el: '#app',
  components: {
    'overlay-scrollbars': OverlayScrollbarsComponent
  }
});
```

#### Template
After the registration you can use it in templates like:
```html
<overlay-scrollbars>
  example content
</overlay-scrollbars>
```
The default selector is `overlay-scrollbars`, but in case you register it manually you can choose it by yourself.

#### Properties
Two properties are accepted: `options` and `extensions`.
- The `options` property accepts a `object` and can be changed at any point in time, and the plugin will adapt.
- The `extensions` property accepts a `string`, `string array` or `object` and is only taken into account if the component gets mounted.

```vue
<overlay-scrollbars 
  :options="{ scrollbars: { autoHide: 'scroll' } }" 
  :extensions="['extensionA', 'extensionB']"
>
</overlay-scrollbars>
```
You can read more about the `options` object [here](https://kingsora.github.io/OverlayScrollbars/#!documentation/options), `extensions` are documented [here](https://kingsora.github.io/OverlayScrollbars/#!documentation/extensions-basics) and [here](https://kingsora.github.io/OverlayScrollbars/#!documentation/initialization).

#### Instance
If you get the component reference, it provides two methods: `osInstance()` and `osTarget()`.
- The `osInstance()` method returns the OverlayScrollbars `instance` of the component, or `null` if the instance isn't initialized yet or already destroyed.
- The `osTarget()` method returns the native `html` element to which the plugin was initialized, or `null` if the the component isn't mounted yet or already unmounted.

## Example App
In case you need a example app for reference, you can use the example app in this repo(`example folder`):
- [Live example](https://kingsora.github.io/OverlayScrollbars/frameworks/vue/)
- [Source code](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-vue/example)

If you wanna build the example app, run these commands:
```sh
npm run setup
npm run build
npm run example
```

## License

MIT 