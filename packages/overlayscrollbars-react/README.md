<p align="center">
    <a href="https://reactjs.org/"><img src="https://kingsora.github.io/OverlayScrollbars/frameworks/react/logo.svg" width="200" height="133" alt="React"></a>
    <a href="https://kingsora.github.io/OverlayScrollbars/"><img src="https://kingsora.github.io/OverlayScrollbars/design/logo.svg" width="200" height="133" alt="OverlayScrollbars"></a>
</p>
<h6 align="center">
    <a href="https://github.com/facebook/react/"><img src="https://img.shields.io/badge/React-%5E16.4.0-61dafb?style=flat-square&logo=React" alt="React"></a>
    <a href="https://github.com/KingSora/OverlayScrollbars"><img src="https://img.shields.io/badge/OverlayScrollbars-%5E1.10.0-36befd?style=flat-square" alt="OverlayScrollbars"></a>
    <a href="https://www.npmjs.com/package/overlayscrollbars-react"><img src="https://img.shields.io/npm/dt/overlayscrollbars-react.svg?style=flat-square" alt="Downloads"></a>
    <a href="https://github.com/KingSora/OverlayScrollbars/blob/master/packages/overlayscrollbars-react/LICENSE"><img src="https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square" alt="License"></a>
</h6>
<h3 align="center">
    <a href="https://kingsora.github.io/OverlayScrollbars/frameworks/react/">Example</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!documentation">Documentation</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!faq">FAQ</a>
</h3>
<h5 align="center">
    The official OverlayScrollbars wrapper for React.
</h5>

## Installation
```sh
npm install overlayscrollbars-react
```

## Peer Dependencies
OverlayScrollbars for React has the following **peer dependencies**:
- The vanilla JavaScript library: [overlayscrollbars](https://www.npmjs.com/package/overlayscrollbars) 
```
npm install overlayscrollbars
```
- The React framework: [react](https://www.npmjs.com/package/react)
```
npm install react
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
There are different ways to achieve this, in React the most simple way for me was to add [this line](https://github.com/KingSora/OverlayScrollbars/blob/master/packages/overlayscrollbars-react/example/src/index.tsx#L1) in the `index` file:
```js
import 'overlayscrollbars/css/OverlayScrollbars.css';
```

#### Import
Simply import the component into your file(s):
```js
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
```

#### Template
After the import you can use it in JSX:
```jsx
<OverlayScrollbarsComponent>
  example content
</OverlayScrollbarsComponent>
```

#### Properties
Two properties are accepted: `options` and `extensions`.
- The `options` property accepts a `object` and can be changed at any point in time, and the plugin will adapt.
- The `extensions` property accepts a `string`, `string array` or `object` and is only taken into account if the component gets mounted.

```jsx
<OverlayScrollbarsComponent
  options={{ scrollbars: { autoHide: 'scroll' } }} 
  extensions={['extensionA', 'extensionB']}
>
</OverlayScrollbarsComponent>
```
You can read more about the `options` object [here](https://kingsora.github.io/OverlayScrollbars/#!documentation/options), `extensions` are documented [here](https://kingsora.github.io/OverlayScrollbars/#!documentation/extensions-basics) and [here](https://kingsora.github.io/OverlayScrollbars/#!documentation/initialization).

#### Instance
If you get the component reference, it provides two methods: `osInstance()` and `osTarget()`.
- The `osInstance()` method returns the OverlayScrollbars `instance` of the component, or `null` if the instance isn't initialized yet or already destroyed.
- The `osTarget()` method returns the native `html` element to which the plugin was initialized, or `null` if the the component isn't mounted yet or already unmounted.

## Example App
In case you need a example app for reference, you can use the example app in this repo(`example folder`):
- [Live example](https://kingsora.github.io/OverlayScrollbars/frameworks/react/)
- [Source code](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-react/example)

If you wanna build the example app, run these commands:
```sh
npm run setup
npm run build
npm run example
```

## License

MIT 