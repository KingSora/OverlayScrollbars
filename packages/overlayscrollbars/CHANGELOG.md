# Changelog

## 2.0.0

OverlayScrollbars was rewritten from the ground up in `TypeScript`.
The rewrite comes with multiple benefits:

- The library is **much** smaller now (about 50% smaller fully treeshaken)
- Modern browsers benefit greatly because compat code is inside `plugins` which are treeshaken if unused
- Multiple performance optimizations were made due to the new structure
- Framework Components benefit of the `pure` parameter for `options` and `events` (same input produces same output)
- TypeScript definitions are always up to date (`@types/overlayscrollbars` is obsolete now)

### New Features:

- If applied to `body` all the native functionality in modern browsers (e.g. swipe down to refresh on mobile, scroll restoration etc.) is preserved (#376, #425, #273, #320) 
- If you scroll while the cursor hovers a scrollbar element the viewport is now scrolled (#128, #322)
- The initialization process can be fully customized now. This makes it possible to itegrate with other plugins / libraries (#432, #304, #149, #148, #139, #49)
- Scrollbars can be cloned and positioned anywhere in the DOM tree. (#404, #323, #158, #17)
- The update behavior of the `MutationObserver` for the content can be customized with the `update` options. (#307, #183, #23)
- It works now without adjustments with CSS-Grid, CSS-Flexbox etc.

### Breaking changes:

- Browser support changed. The minimal version is now IE11.
- The `scroll` function is missing. (WIP will be added as a plugin)
- Initialization to `textarea` element is not suppored. (WIP will be added as a plugin)
- Because scrollbars can be cloned and positioned anywhere in the DOM, themes which worked in `v1` have to be adapted slightly.
- `extensions` are replaced with `plugins`. Plugins are more powerful but work nothing like `extensions`.
- Any helper functions for `extensions` are removed.
- `TypesScript` definitions changed completely.
- There is no `jQuery` version anymore and no `jQuery` compat functionality
- The following changed for the `initialization`:
  - Arrays of elements are not supported anymore. If you want to initialize the plugin to multiple elements, you have to loop over them.
  - Since the initialization is now fully customizable, the plugin won't have special behavior anymore if it has children with `os-` classnames
  - The third parameter are `events` now instead of `eventsions` since `extensions` are removed
- The following **options** were removed / replaced / renamed:
  - `className` is replaced with `scrollbars.theme`
  - `resize` is removed
  - `sizeAutoCapable` is removed (works always now)
  - `clipAlways` is removed (works automatically now)
  - `normalizeRTL` is removed since the `scroll` function isn't implemented yet there is nothing to normalize
  - `autoUpdate` is removed since all browser support the `MutationObserver` api there is no need for customizing a update loop
  - `autoUpdateInterval` is removed
  - `updateOnLoad` is replaced with `update.elementEvents`
  - `nativeScrollbarsOverlaid.showNativeScrollbars`: is renamed to `showNativeOverlaidScrollbars`
  - `nativeScrollbarsOverlaid.initialize` is replaced with the `Initialization` concept. You can pass a object as target now where you can specify when to cancel the initialization of the plugin.
  - `scrollbars.dragScrolling` is renamed to `scrollbars.dragScroll`
  - `scrollbars.clickScrolling` is renamed to `scrollbars.clickScroll` and animates the scroll change only with the `ClickScrollPlugin` otherwise its instant
  - `scrollbars.touchSupport` is replaced with `scrollbars.pointers`
  - `scrollbars.snapHandle` is removed
  - `textarea` is removed since `textarea` initialization isn't possible yet
  - `callbacks` is removed / replaced with the `events` concept. You can pass listeners / callback separately to the options.
- The following **instance methods** were removed / replaced / renamed:
  - `sleep()` is removed since it doesn't fit into the new structure and shouldn't be needed anymore
  - `scroll()` is removed (WIP)
  - `scrollStop()` is removed (WIP)
  - `getElements()` is renamed to `elements()` and doesn't support any argumens anymore.
  - `getState()` is renamed to `state()` and doesn't support any argumens anymore.
  - `ext()` is removed
  - `addExt()` is removed
  - `removeExt()` is removed
- The following **static methods** were removed / replaced / renamed:
  - `defaultOptions()` is replaced with `env().getDefaultOptions()` and `env().setDefaultOptions()`
  - `globals()` is replaced with `env()`
  - `extension()` is removed
- If you used any fields from the `globals()` result, please refer to the TypeScript definitions for the correct replacement in `env()`
