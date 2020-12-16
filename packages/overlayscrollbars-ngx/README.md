<p align="center">
    <a href="https://angular.io/"><img src="https://kingsora.github.io/OverlayScrollbars/frameworks/angular/logo.svg" width="200" height="133" alt="Angular"></a>
    <a href="https://kingsora.github.io/OverlayScrollbars/"><img src="https://kingsora.github.io/OverlayScrollbars/design/logo.svg" width="200" height="133" alt="OverlayScrollbars"></a>
</p>
<h6 align="center">
    <a href="https://github.com/angular/angular"><img src="https://img.shields.io/badge/Angular-%3E=7.0.0-DD0031?style=flat-square&logo=Angular" alt="Angular"></a>
    <a href="https://github.com/KingSora/OverlayScrollbars"><img src="https://img.shields.io/badge/OverlayScrollbars-%5E1.10.0-36befd?style=flat-square" alt="OverlayScrollbars"></a>
    <a href="https://www.npmjs.com/package/overlayscrollbars-ngx"><img src="https://img.shields.io/npm/dt/overlayscrollbars-ngx.svg?style=flat-square" alt="Downloads"></a>
    <a href="https://github.com/KingSora/OverlayScrollbars/blob/master/packages/overlayscrollbars-ngx/LICENSE"><img src="https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square" alt="License"></a>
</h6>
<h3 align="center">
    <a href="https://kingsora.github.io/OverlayScrollbars/frameworks/angular/">Example</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!documentation">Documentation</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!faq">FAQ</a>
</h3>
<h5 align="center">
    The official OverlayScrollbars wrapper for Angular.
</h5>

## Installation

```sh
npm install overlayscrollbars-ngx
```

## Peer Dependencies

OverlayScrollbars for Angular has the following **peer dependencies**:

- The vanilla JavaScript library: [overlayscrollbars](https://www.npmjs.com/package/overlayscrollbars)

```
npm install overlayscrollbars
```

- The Angular framework: [@angular/core](https://www.npmjs.com/package/@angular/core)

```
npm install @angular/core
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
There are different ways to achieve this, in Angular the most simple way for me was to add [this line](https://github.com/KingSora/OverlayScrollbars/blob/master/packages/overlayscrollbars-ngx/example/src/styles.css#L1) in the `styles` file:

```css
@import "~overlayscrollbars/css/OverlayScrollbars.css";
```

#### Import

First you need to import the module into your modules file:

```ts
import { NgModule } from "@angular/core";
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";

@NgModule({
  imports: [OverlayscrollbarsModule],
})
export class AppModule {}
```

After that you can import the component into your file(s):

```ts
import { OverlayScrollbarsComponent } from "overlayscrollbars-ngx";
```

#### Template

After the import you can use it in templates like:

```html
<overlay-scrollbars> example content </overlay-scrollbars>
```

#### Properties

Two properties are accepted: `options` and `extensions`.

- The `options` property accepts a `object` and can be changed at any point in time, and the plugin will adapt.
- The `extensions` property accepts a `string`, `string array` or `object` and is only taken into account if the component gets mounted.

```html
<overlay-scrollbars
  [options]="{ scrollbars: { autoHide: 'scroll' } }"
  [extensions]="['extensionA', 'extensionB']"
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

- [Live example](https://kingsora.github.io/OverlayScrollbars/frameworks/angular/)
- [Source code](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-ngx/example)

If you wanna build the example app, run these commands:

```sh
npm run setup
npm run build
npm run example
```

## License

MIT
