<p align="center">
  <a href="https://kingsora.github.io/OverlayScrollbars">
    <a href="https://kingsora.github.io/OverlayScrollbars"><img src="https://kingsora.github.io/OverlayScrollbars/design/logo.svg" width="200" height="133" alt="OverlayScrollbars"></a>
  </a>
</p>
<h6 align="center">
    <a href="https://github.com/KingSora/OverlayScrollbars/blob/master/package.json"><img src="https://img.shields.io/david/kingsora/overlayscrollbars.svg?style=flat-square" alt="Dependencies"></a>
    <a href="https://www.npmjs.com/package/overlayscrollbars"><img src="https://img.shields.io/npm/dt/overlayscrollbars.svg?style=flat-square" alt="Downloads"></a>
    <a href="https://www.npmjs.com/package/overlayscrollbars"><img src="https://img.shields.io/npm/v/overlayscrollbars.svg?style=flat-square" alt="Version"></a>
    <a href="https://github.com/KingSora/OverlayScrollbars/blob/master/LICENSE"><img src="https://img.shields.io/github/license/kingsora/overlayscrollbars.svg?style=flat-square" alt="License"></a>
</h6>
<h3 align="center">
    <a href="https://kingsora.github.io/OverlayScrollbars">Website</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!documentation">Documentation</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!demos">Demos</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!extensions">Extensions</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="https://kingsora.github.io/OverlayScrollbars/#!faq">FAQ</a>
</h3>

> OverlayScrollbars is a javascript scrollbar plugin which hides native scrollbars, provides
custom styleable overlay scrollbars and keeps the native functionality and feeling.

## Why

I've created this plugin because I hate ugly and space consuming scrollbars. Similar plugins haven't met my requirements in terms of features, quality, simplicity, license or browser support.

## Goals & Features

 - A simple, powerful and good documented API.
 - High browser compatibility (<b>IE8+</b>, <b>Safari6+</b>, <b>Firefox</b>, <b>Opera</b>, <b>Chrome</b> and <b>Edge</b>).
 - Usage of the most recent technologies to ensure maximum efficiency and performance on newer browsers.
 - Can be used without any dependencies or with jQuery.
 - Automatic update detection - after the initialization you don't have to worry about updating.
 - Extremely powerful scroll method with features like animations, relative coordinates, scrollIntoView and more.
 - Mouse and touch support.
 - Textarea and Body support.
 - RTL Direction support. (with normalization)
 - Simple and effective scrollbar-styling.
 - Rich extension system.
 - TypeScript support.

## Framework Wrapper

OverlayScrollbars provides its own wrapper components for popular component-based front-end frameworks:

<img align="left" src="https://kingsora.github.io/OverlayScrollbars/frameworks/react/logo.svg" width="80" height="80" alt="React">


<a href="https://www.npmjs.com/package/overlayscrollbars-react"><img src="https://img.shields.io/npm/v/overlayscrollbars-react.svg?style=flat-square" alt="Version"></a>
<a href="https://www.npmjs.com/package/overlayscrollbars-react"><img src="https://img.shields.io/npm/dt/overlayscrollbars-react.svg?style=flat-square" alt="Downloads"></a>
[README](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-react)

```sh
npm install overlayscrollbars-react
```

<img align="left" src="https://kingsora.github.io/OverlayScrollbars/frameworks/vue/logo.svg" width="80" height="80" alt="Vue">

<a href="https://www.npmjs.com/package/overlayscrollbars-vue"><img src="https://img.shields.io/npm/v/overlayscrollbars-vue.svg?style=flat-square" alt="Version"></a>
<a href="https://www.npmjs.com/package/overlayscrollbars-vue"><img src="https://img.shields.io/npm/dt/overlayscrollbars-vue.svg?style=flat-square" alt="Downloads"></a>
[README](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-vue)

```sh
npm install overlayscrollbars-vue
```

<img align="left" src="https://kingsora.github.io/OverlayScrollbars/frameworks/angular/logo.svg" width="80" height="80" alt="Angular">

<a href="https://www.npmjs.com/package/overlayscrollbars-ngx"><img src="https://img.shields.io/npm/v/overlayscrollbars-ngx.svg?style=flat-square" alt="Version"></a>
<a href="https://www.npmjs.com/package/overlayscrollbars-ngx"><img src="https://img.shields.io/npm/dt/overlayscrollbars-ngx.svg?style=flat-square" alt="Downloads"></a>
[README](https://github.com/KingSora/OverlayScrollbars/tree/master/packages/overlayscrollbars-ngx)

```sh
npm install overlayscrollbars-ngx
```

## Sponsors
<table>
    <tr>
        <td>
            <a href="https://www.browserstack.com" target="_blank">
                <img align="center" src="https://kingsora.github.io/OverlayScrollbars/img/browserstack.png" width="250">
            </a>
        </td>
        <td>
            Thanks to <a href="https://www.browserstack.com" target="_blank">BrowserStack</a> for sponsoring open source projects and letting me test OverlayScrollbars for free.
        </td>
    </tr>
</table>

## Dependencies

**The default version doesn't requires any dependencies!**

If you are using the jQuery dependent version it obviously requires [jQuery](https://jquery.com/) to work.  
It was tested with the jQuery versions: 1.9.1, 2.x, 3.x, and it won't work with jQuery slim.

## Download

#### manually
Download OverlayScrollbars manually from [Releases](https://github.com/KingSora/OverlayScrollbars/releases).

#### cdn
You can use OverlayScrollbars via a [cdn](https://cdnjs.com/libraries/overlayscrollbars).

#### npm
OverlayScrollbars can be downloaded from [npm](https://www.npmjs.com/package/overlayscrollbars).

```sh
npm install overlayscrollbars
```

## Usage

#### HTML

Load your CSS file(s) before the JS file(s), to prevent unexpected bugs.

Include **OverlayScrollbars.css** and **OverlayScrollbars.js** to your HTML file.  

```html
<!-- Plugin CSS -->
<link type="text/css" href="path/to/OverlayScrollbars.css" rel="stylesheet"/>
<!-- Plugin JS -->
<script type="text/javascript" src="path/to/OverlayScrollbars.js"></script>
```

If you are using the jQuery version, include [jQuery](https://jquery.com/) before the plugin and use **jquery.overlayScrollbars.js**

```html
<!-- Plugin CSS -->
<link type="text/css" href="path/to/OverlayScrollbars.css" rel="stylesheet"/>
<!-- jQuery JS -->
<script type="text/javascript" src="path/to/jquery.js"></script>
<!-- Plugin JS -->
<script type="text/javascript" src="path/to/jquery.overlayScrollbars.js"></script>
```

#### JavaScript

Initialize the plugin after your document has been fully loaded.

Default initialization:
```js
document.addEventListener("DOMContentLoaded", function() {
    //The first argument are the elements to which the plugin shall be initialized
    //The second argument has to be at least a empty object or a object with your desired options
    OverlayScrollbars(document.querySelectorAll('body'), { });
});
```

jQuery initialization:
```js
$(function() {
    //The passed argument has to be at least a empty object or a object with your desired options
    $('body').overlayScrollbars({ });
});
```

#### TypeScript

OverlayScrollbars provides its own [TypeScript declarations](https://www.npmjs.com/package/@types/overlayscrollbars):
```sh
npm install @types/overlayscrollbars
```

I recommend setting these options in your **tsconfig.json**:
```json
{
    "compilerOptions": {
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true
    }
}
```


## Options

Due to clarity I can't provide all informations here.  
Take the table below only as a overview of all options.  
[Please read the much more detailed documentation](https://kingsora.github.io/OverlayScrollbars/#!documentation).  


<table>
    <thead>
        <tr>
            <th align="left" colspan="2">option</th>
            <th align="left">type</th>
            <th align="left">default</th>
            <th align="left">description</th>
        </tr>
    </thead>
    <tr>
        <td colspan="2">className</td>
        <td>string / null</td>
        <td><code>"os-theme-dark"</code></td>
        <td>The class name which shall be added to the host element.</td>
    </tr>
    <tr>
        <td colspan="2">resize</td>
        <td>string</td>
        <td><code>"none"</code></td>
        <td>The resize behavior of the host element. This option works exactly like the CSS3 resize property.</td>
    </tr>
    <tr>
        <td colspan="2">sizeAutoCapable</td>
        <td>boolean</td>
        <td><code>true</code></td>
        <td>Indicates whether the host element is capable of "auto" sizes such as: <code>width: auto</code> and <code>height: auto</code>.</td>
    </tr>
    <tr>
        <td colspan="2">clipAlways</td>
        <td>boolean</td>
        <td><code>true</code></td>
        <td>Indicates whether the content shall be clipped always.</td>
    </tr>
    <tr>
        <td colspan="2">normalizeRTL</td>
        <td>boolean</td>
        <td><code>true</code></td>
        <td>Indicates whether RTL scrolling shall be normalized.</td>
    </tr>
    <tr>
        <td colspan="2">paddingAbsolute</td>
        <td>boolean</td>
        <td><code>false</code></td>
        <td>Indicates whether the padding for the content shall be absolute.</td>
    </tr>
    <tr>
        <td colspan="2">autoUpdate</td>
        <td>boolean / null</td>
        <td><code>null</code></td>
        <td>Indicates whether the plugin instance shall be updated continuously within a update loop.</td>
    </tr>
    <tr>
        <td colspan="2">autoUpdateInterval</td>
        <td>number</td>
        <td><code>33</code></td>
        <td>The interval in milliseconds in which a auto update shall be performed for this instance.</td>
    </tr>
    <tr>
        <td colspan="2">updateOnLoad</td>
        <td>string / array / null</td>
        <td><code>["img"]</code></td>
        <td>Selectors of which the elements <code>load</code> event shall be handled by the plugin. Thats means OverlayScrollbars will trigger a automatic update if a element with a matching selector emits a <code>load</code> event. Per default OverlayScrollbars will update automatically if a <code>img</code> element loads.</td>
    </tr>
    <tr>
        <th align="left" colspan="5">nativeScrollbarsOverlaid : {</th>
    </tr>
    <tr>
        <td></td>
        <td>showNativeScrollbars</td>
        <td>boolean</td>
        <td><code>false</code></td>
        <td>Indicates whether the native overlaid scrollbars shall be visible.</td>
    </tr>
    <tr>
        <td></td>
        <td>initialize</td>
        <td>boolean</td>
        <td><code>true</code></td>
        <td>
            Indicates whether the plugin shall be initialized even if the native scrollbars are overlaid.<br>
            If you initialize the plugin on the body element, I recommend to set this option to false.
        </td>
    </tr>
    <tr>
        <th align="left" colspan="5">}</th>
    </tr>
    <tr>
        <th align="left" colspan="5">overflowBehavior : {</th>
    </tr>
    <tr>
        <td></td>
        <td>x</td>
        <td>string</td>
        <td><code>"scroll"</code></td>
        <td>The overflow behavior for the x (horizontal) axis.</td>
    </tr>
    <tr>
        <td></td>
        <td>y</td>
        <td>string</td>
        <td><code>"scroll"</code></td>
        <td>The overflow behavior for the y (vertical) axis.</td>
    </tr>
    <tr>
        <th align="left" colspan="5">}</th>
    </tr>
    <tr>
        <th align="left" colspan="5">scrollbars : {</th>
    </tr>
    <tr>
        <td></td>
        <td>visibility</td>
        <td>string</td>
        <td><code>"auto"</code></td>
        <td>The basic visibility of the scrollbars.</td>
    </tr>
    <tr>
        <td></td>
        <td>autoHide</td>
        <td>string</td>
        <td><code>"never"</code></td>
        <td>The possibility to hide visible scrollbars automatically after a certain action.</td>
    </tr>
    <tr>
        <td></td>
        <td>autoHideDelay</td>
        <td>number</td>
        <td><code>800</code></td>
        <td>The delay in milliseconds before the scrollbars gets hidden automatically.</td>
    </tr>
    <tr>
        <td></td>
        <td>dragScrolling</td>
        <td>boolean</td>
        <td><code>true</code></td>
        <td>Defines whether the scrollbar-handle supports drag scrolling.</td>
    </tr>
    <tr>
        <td></td>
        <td>clickScrolling</td>
        <td>boolean</td>
        <td><code>false</code></td>
        <td>Defines whether the scrollbar-track supports click scrolling.</td>
    </tr>
    <tr>
        <td></td>
        <td>touchSupport</td>
        <td>boolean</td>
        <td><code>true</code></td>
        <td>Indicates whether the scrollbar reacts to touch events.</td>
    </tr>
    <tr>
        <td></td>
        <td>snapHandle</td>
        <td>boolean</td>
        <td><code>false</code></td>
        <td>Indicates whether the scrollbar handle-offset shall be snapped.</td>
    </tr>
    <tr>
        <th align="left" colspan="5">}</th>
    </tr>
    <tr>
        <th align="left" colspan="5">textarea : {</th>
    </tr>
    <tr>
        <td></td>
        <td>dynWidth</td>
        <td>boolean</td>
        <td><code>false</code></td>
        <td>Indicates whether the textarea width will be dynamic (content dependent).</td>
    </tr>
    <tr>
        <td></td>
        <td>dynHeight</td>
        <td>boolean</td>
        <td><code>false</code></td>
        <td>Indicates whether the textarea height will be dynamic (content dependent).</td>
    </tr>
    <tr>
        <td></td>
        <td>inheritedAttrs</td>
        <td>string / array / null</td>
        <td><code>["style", "class"]</code></td>
        <td><b>During initialization:</b> Attributes which the generated host-element shall inherit from from the target textarea-element.<br/>
<b>During destruction:</b> Attributes which the target textarea-element shall inherit from from the generated host-element.</td>
    </tr>
    <tr>
        <th align="left" colspan="5">}</th>
    </tr>
    <tr>
        <th align="left" colspan="5">callbacks : {</th>
    </tr>
    <tr>
        <td></td>
        <td>onInitialized</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the plugin was initialized. It takes no arguments.</td>
    </tr>
    <tr>
        <td></td>
        <td>onInitializationWithdrawn</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the initialization of the plugin was aborted due to the option <code>nativeScrollbarsOverlaid : { initialize : false }</code>. It takes no arguments.</td>
    </tr>
    <tr>
        <td></td>
        <td>onDestroyed</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the plugin was destryoed. It takes no arguments.</td>
    </tr>
    <tr>
        <td></td>
        <td>onScrollStart</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the user starts scrolling. It takes one argument.</td>
    </tr>
    <tr>
        <td></td>
        <td>onScroll</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after every scroll. It takes one argument.</td>
    </tr>
    <tr>
        <td></td>
        <td>onScrollStop</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the user stops scrolling. It takes one argument.</td>
    </tr>
    <tr>
        <td></td>
        <td>onOverflowChanged</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the overflow has changed. It takes one argument.</td>
    </tr>
    <tr>
        <td></td>
        <td>onOverflowAmountChanged</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the overflow amount has changed. It takes one argument.</td>
    </tr>
    <tr>
        <td></td>
        <td>onDirectionChanged</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the direction has changed. It takes one argument.</td>
    </tr>
    <tr>
        <td></td>
        <td>onContentSizeChanged</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the content size has changed. It takes one argument.</td>
    </tr>
    <tr>
        <td></td>
        <td>onHostSizeChanged</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the host size or host padding has changed. It takes one argument.</td>
    </tr>
    <tr>
        <td></td>
        <td>onUpdated</td>
        <td>function / null</td>
        <td><code>null</code></td>
        <td>Gets fired after the host size has changed. It takes one argument.</td>
    </tr>
    <tr>
        <th align="left" colspan="5">}</th>
    </tr>
</table>

## Methods

Click on the method name to open a more detailed documentation.

#### Instance methods:

<table>
    <thead>
        <tr>
            <th align="left">name</th>
            <th align="left">description</th>
        </tr>
    </thead>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-options" target="_blank">.options()</a></b></td>
        <td>Returns or sets the options of the instance.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//get options
var options = instance.options();
//set options
instance.options({ className : null });</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-update" target="_blank">.update()</a></b></td>
        <td>Updates the instance.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//soft update
instance.update();
//hard update
instance.update(true);</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-sleep" target="_blank">.sleep()</a></b></td>
        <td>Disables every observation of the DOM and puts the instance to "sleep". This behavior can be reset by calling the <code>update()</code> method.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//put the instance to sleep
instance.sleep();</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-scroll" target="_blank">.scroll()</a></b></td>
        <td>Returns the scroll information or sets the scroll position.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//get scroll information
var scrollInfo = instance.scroll();
//scroll 50px on both axis
instance.scroll(50);
//add 10px to the scroll offset of each axis
instance.scroll({ x : "+=10", y : "+=10" });
//scroll to 50% on both axis with a duration of 1000ms
instance.scroll({ x : "50%", y : "50%" }, 1000);
//scroll to the passed element with a duration of 1000ms
instance.scroll($(selector), 1000);</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-scrollstop" target="_blank">.scrollStop()</a></b></td>
        <td>Stops the current scroll-animation.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//scroll-animation duration is 10 seconds
instance.scroll({ y : "100%" }, 10000);
//abort the 10 seconds scroll-animation immediately
instance.scrollStop();
//scroll-animation duration is 1 second
instance.scroll({ y : "100%" }, 1000);</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-getelements" target="_blank">.getElements()</a></b></td>
        <td>Returns all relevant elements.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//get the element to which the plugin was applied
var pluginTarget = instance.getElements().target;</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-getstate" target="_blank">.getState()</a></b></td>
        <td>Returns a object which describes the current state of this instance.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//get the state of the plugin instance
var pluginState = instance.getState();</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-destroy" target="_blank">.destroy()</a></b></td>
        <td>Destroys and disposes the current instance and removes all added elements form the DOM.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//destroy the instance
instance.destroy();</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-ext" target="_blank">.ext()</a></b></td>
        <td>Returns the instance of a certain extension of the current plugin instance.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//get the instance of the extension "myExtension"
var extensionInstance = instance.ext("myExtension");</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-addext" target="_blank">.addExt()</a></b></td>
        <td>Adds a extension to the current instance.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//add the registered extension "myExtension" to the plugin instance
var extensionInstance = instance.addExt("myExtension");</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/method-removeext" target="_blank">.removeExt()</a></b></td>
        <td>Removes a extension from the current instance.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//add the registered extension "myExtension" to the plugin instance
instance.addExt("myExtension");
//remove the added extension "myExtension" from the plugin instance
instance.removeExt("myExtension");</pre>
        </td>
    </tr>
</table>

#### Global methods:

<table>
    <thead>
        <tr>
            <th align="left">name</th>
            <th align="left">description</th>
        </tr>
    </thead>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/gmethod-defaultoptions" target="_blank">OverlayScrollbars.defaultOptions()</a></b></td>
        <td>Returns or Sets the default options for each new plugin initialization.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//get the current defaultOptions
var defaultOptions = OverlayScrollbars.defaultOptions();
//set new default options
OverlayScrollbars.defaultOptions({
    className : "my-custom-class",
    resize    : "both"
});</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/gmethod-globals" target="_blank">OverlayScrollbars.globals()</a></b></td>
        <td>Returns a plain object which contains global information about the plugin and each instance of it.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//get the global information
var globals = OverlayScrollbars.globals();</pre>
        </td>
    </tr>
    <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/gmethod-extension" target="_blank">OverlayScrollbars.extension()</a></b></td>
        <td>Registers, Unregisters or returns extensions.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//register a dummy extension with the name "myExtension"
OverlayScrollbars.extension("myExtension", function() { return { }; });
//unregister the extension with the name "myExtension"
OverlayScrollbars.extension("myExtension", null);
//get the extension-object with the name "myExtension"
var registeredExtension = OverlayScrollbars.extension("myExtension");
//get all registered extension-objects
var extensionObjects = OverlayScrollbars.extension();</pre>
        </td>
    </tr>
        <tr>
        <td><b><a href="https://kingsora.github.io/OverlayScrollbars/#!documentation/gmethod-valid" target="_blank">OverlayScrollbars.valid()</a></b></td>
        <td>Checks whether the passed object is a non-destroyed OverlayScrollbars instance.</td>
    </tr>
    <tr>
        <td colspan="2">
            example(s):<br> 
            <pre lang="js">
//create OverlayScrollbars instance
var osInstance = OverlayScrollbars(document.body, { });
//returns true
OverlayScrollbars.valid(osInstance);
//destroy the instance
osInstance.destroy();
//returns false
OverlayScrollbars.valid(osInstance);
//returns false
OverlayScrollbars.valid({ });</pre>
        </td>
    </tr>
</table>

## Tests

It's a challenge to fully test a library like OverlayScrollbars, because it has to adapt to countless DOM setups and browsers.
Nevertheless I've developed basic GUI-Tests. In these tests a element with applied OverlayScrollbars is compared to a native element.

You can run the tests by visiting [this](https://kingsora.github.io/OverlayScrollbars/#!demos/capabilites) page and clicking on the `Run` button. Please be aware that the tests need some time to complete.
After the process is complete, the results are displayed in the console.

In case some tests are failing on your end, please open a issue with the console output of the tests (the `failed` array in particular).

## Future Plans

 - Minimize the code as much as possible.
 - Frequent updates in terms of bug-fixes and enhancements.
 - Improve tests

## License

MIT 
