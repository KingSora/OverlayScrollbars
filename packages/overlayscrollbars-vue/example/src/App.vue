<template>
  <div id="app">
    <div class="header">
      <code>
        <span class="code-keyword">import</span>
        <span class="code-char">{{ ' { ' }}</span>
        <span class="code-variable">OverlayScrollbarsComponent</span>
        <span class="code-char">{{ ' } ' }}</span>
        <span class="code-keyword">from</span>
        <span class="code-string">{{ " 'overlayscrollbars-vue'" }}</span>
        <span class="code-char">;</span>
      </code>
    </div>
    <div class="content">
      <div class="content-section skew">
        <div class="content-section-content content-section-content-framework">
          <span class="framework-logo"></span>
          <span>+</span>
          <span class="os-logo"></span>
        </div>
      </div>
      <div class="content-section">
        <div class="content-section-title">
          <h2>Component</h2>
          <table>
            <tbody>
              <tr>
                <td>
                  <span>Class:</span>
                </td>
                <td>
                  <span>{{ componentClass }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>Description:</span>
                </td>
                <td>OverlayScrollbars as a {{ framework }}-Component.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="content-section-content">
          <overlay-scrollbars
            ref="osComponentRef1"
            :options="osComponentOptions"
            style="max-height: 350px"
            :class="[framework, hasCustomClassName ? customClassName : '']"
          >
            <div class="bonus-content">{{ componentContent }}</div>
            {{ loremIpsumShort }}
            <overlay-scrollbars
              ref="osComponentRef2"
              :options="osComponentOptions"
              style="max-height: 150px"
              :class="hasCustomClassName ? customClassName : ''"
            >
              <div class="bonus-content">{{ componentContent }}</div>
              {{ loremIpsumLong }}
              <br />
              <br />
              {{ loremIpsumShort }}
            </overlay-scrollbars>
            {{ loremIpsumMedium }}
            <br />
            <br />
            {{ loremIpsumShort }}
            <br />
            <br />
            {{ loremIpsumLong }}
            <div v-for="(item, index) in loremList" :key="index" :data-key="index">
              <br />
              {{ item }}
            </div>
          </overlay-scrollbars>

          <div class="buttons">
            <button
              @click="(event) => { this.onBtnScrollRandom.call(this, event, [this.$refs.osComponentRef1, this.$refs.osComponentRef2]) }"
            >Scroll</button>
            <button @click="() => { this.onBtnChangeOptions.call(this) }">Change Options</button>
            <button @click="() => { this.onBtnChangeContent.call(this) }">Change Content</button>
            <button @click="() => { this.onBtnLog.call(this) }">Log</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import OverlayScrollbars from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';

export interface AppData {
  framework: string;
  customClassName: string;
  componentClass: string;
  loremIpsumLong: string;
  loremIpsumMedium: string;
  loremIpsumShort: string;
  loremList: Array<string>
  componentContent: string;
  osComponentOptions: OverlayScrollbars.Options;
  hasCustomClassName: boolean;
}
export interface AppMethods {
  onBtnScrollRandom(
    event: MouseEvent,
    refArray: Array<OverlayScrollbarsComponent>
  ): void;
  onBtnChangeOptions(): void;
  onBtnChangeContent(): void;
  onBtnLog(): void;
  randomIpsum(): string;
}
export interface AppComputed { }
export interface AppProps { }

export default Vue.extend<AppData, AppMethods, AppComputed, AppProps>({
  name: 'app',
  data: function () {
    return {
      framework: 'Vue',
      customClassName: 'custom-class-name-test',
      componentClass: 'OverlayScrollbarsComponent',
      loremIpsumLong: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
      loremIpsumMedium: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
      loremIpsumShort: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.',
      hasCustomClassName: false,
      loremList: [],
      componentContent: 'Lorem Ipsum',
      osComponentOptions: {
        resize: 'both',
        paddingAbsolute: true,
        scrollbars: {
          autoHide: 'never'
        }
      }
    };
  },
  methods: {
    onBtnScrollRandom(event: MouseEvent, refArray: Array<OverlayScrollbarsComponent>) {
      if (refArray) {
        for (let i = 0; i < refArray.length; i++) {
          if (refArray[i]) {
            const osInstance = refArray[i].osInstance();
            if (osInstance) {
              osInstance.scrollStop().scroll({
                x: Math.floor(Math.random() * osInstance.scroll().max.x + 0),
                y: Math.floor(Math.random() * osInstance.scroll().max.y + 0)
              }, 1000, 'easeOutElastic');
            }
          }
        }
      }
    },
    onBtnChangeOptions() {
      this.hasCustomClassName = !this.hasCustomClassName;
      this.osComponentOptions = {
        resize: this.osComponentOptions.resize === 'both' ? 'none' : 'both',
        scrollbars: {
          autoHide: this.osComponentOptions.scrollbars!.autoHide === 'never' ? 'scroll' : 'never'
        }
      };
    },
    onBtnChangeContent() {
      this.componentContent = this.componentContent + '\r\n' + this.randomIpsum();
      this.loremList.push(this.randomIpsum());
    },
    onBtnLog() {
      console.log(`== ${this.componentClass} (1) ==`);
      console.log('Instance:');
      console.log((this.$refs.osComponentRef1 as OverlayScrollbarsComponent).osInstance());
      console.log('Target:');
      console.log((this.$refs.osComponentRef1 as OverlayScrollbarsComponent).osTarget());
      console.log('');
      console.log(`== ${this.componentClass} (2) ==`);
      console.log('Instance:');
      console.log((this.$refs.osComponentRef2 as OverlayScrollbarsComponent).osInstance());
      console.log('Target:');
      console.log((this.$refs.osComponentRef2 as OverlayScrollbarsComponent).osTarget());
    },
    randomIpsum() {
      let loremIpsums = [
        this.loremIpsumLong,
        this.loremIpsumMedium,
        this.loremIpsumShort
      ];
      return loremIpsums[Math.floor(Math.random() * loremIpsums.length)];
    }
  },
  mounted() {
    console.log(`${this.componentClass} (1)`);
    console.log(this.$refs.osComponentRef1);

    console.log(`${this.componentClass} (2)`);
    console.log(this.$refs.osComponentRef2);
  }
});
</script>

<style>
#app {
  min-width: 600px;
}
.header {
  background: #36befd;
  background: -moz-linear-gradient(-45deg, #36befd 1%, #6461f6 100%);
  background: -webkit-linear-gradient(-45deg, #36befd 1%, #6461f6 100%);
  background: linear-gradient(135deg, #36befd 1%, #6461f6 100%);
  margin: 0;
  color: #fff;
  letter-spacing: 0.1pt;
  text-shadow: 0px 1px 3px rgba(0, 0, 255, 0.1);
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  height: 76px;
  box-shadow: 0 15px 20px -15px rgba(57, 120, 253, 0.15),
    0 55px 50px -35px rgba(47, 78, 249, 0.12);
  position: relative;
  z-index: 1;
}
.header code {
  border-radius: 4px;
  margin: 2px;
  display: block;
  padding: 0.5em;
  background: #fff;
  font-size: 10pt;
  margin: 0px auto;
  box-shadow: 0px 1px 3px rgba(0, 0, 255, 0.15);
}
.header code .code-keyword {
  color: #0059ff;
  font-weight: bold;
}
.header code .code-char {
  color: #4d4d4c;
}
.header code .code-variable {
  color: #3778ad;
}
.header code .code-string {
  color: #279737;
  font-weight: 400;
}
.content {
  min-height: calc(100vh - 76px);
  position: relative;
  display: flex;
  flex-direction: column;
  flex-flow: column;
  flex-wrap: wrap;
}
.content-section {
  position: relative;
  padding: 40px 0px;
  background: #fff;
  z-index: 1;
  overflow: hidden;
}
.content-section:last-child {
  flex-grow: 1;
}
.content-section:before,
.content-section:after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
}
.content-section:nth-child(2n - 1) {
  background: #f6f8fb;
}
.content-section:nth-child(2n - 1):before,
.content-section:nth-child(2n - 1):after {
  background: #fff;
}
.content-section:nth-child(2n + 0) {
  background: #fff;
}
.content-section:nth-child(2n + 0):before,
.content-section:nth-child(2n + 0):after {
  background: #f6f8fb;
}
.content-section.skew:before,
.content-section.skew:after {
  transform: skewY(-7deg);
}
.content-section.skew + .content-section:before,
.content-section.skew + .content-section:after {
  transform: skewY(-7deg);
}
.content-section skew + .content-section.skew:before,
.content-section.skew + .content-section.skew:before {
  top: 0;
}
.content-section + .content-section.skew:before {
  top: -50vw;
}
.content-section.skew + .content-section:after {
  bottom: -50vw;
}
.content-section + .content-section:after {
  top: 0;
}
.content-section.skew + .content-section.skew:after {
  bottom: 0;
}
.content-section.skew:first-child:before {
  top: -50vw !important;
}
.content-section.skew:last-child:after {
  bottom: -50vw !important;
}
.content-section-content-framework > span {
  font-weight: bold;
  font-size: 30pt;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}
.content-section-content-framework > span:not(:nth-child(2)) {
  display: inline-block;
  color: transparent;
  height: 190px;
  width: 190px;
  vertical-align: middle;
}
.content-section-title {
  margin-bottom: 14px;
}
.content-section-title > h2 {
  text-align: center;
  font-size: 26pt;
  color: #39547a;
  margin: 24px 0px;
}
.content-section-title > table {
  text-align: left;
  margin: 0px auto;
}
.content-section-title > table tr {
  margin: 10px;
}
.content-section-title > table td {
  line-height: 18pt;
}
.content-section-title > table td:first-child {
  text-align: right;
  font-weight: bold;
  vertical-align: top;
}
.content-section-title > table td:first-child span {
  margin: 0px 6px;
}
.content-section-title > table td:last-child span {
  text-align: left;
  color: #36befd;
  font-weight: bold;
}
.content-section-content {
  display: table;
  margin: 0px auto;
}
.content-section-content .os-host,
.content-section-content .os-host-textarea {
  border: 2px solid #36befd;
  width: 480px;
  max-height: 300px;
  margin: 10px auto 20px auto;
  border-radius: 6px;
  padding: 10px;
  line-height: 16pt;
}
.content-section-content > .os-host .os-host,
.content-section-content > .os-host-textarea .os-host-textarea {
  border: 2px solid #6461f6;
  width: auto;
  height: auto;
  margin: 10px auto;
}
.content-section-content .bonus-content {
  display: inline-block;
  white-space: pre;
  background: #f0f3f6;
  padding: 0px 5px;
  margin: 2px;
  border-radius: 4px !important;
  border: 1px solid #dde3ed;
  font-size: 10pt;
  font-family: "Lucida Console", Monaco, monospace;
  color: #39547a;
}
.content-section-content-buttons {
  display: table;
  margin: 0px auto;
}
.info-span {
  background: #f7f7f7;
  padding: 2px 5px;
  margin: 2px;
  white-space: nowrap;
  border-radius: 4px;
  border: 1px solid #dedfe0;
  font-weight: bold;
  font-size: 10pt;
}
a {
  display: inline-block;
  text-decoration: none;
  position: relative;
  color: #36befd;
  transition: color 0.3s, text-shadow 0.3s;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  padding: 0px 1px;
  font-weight: 600;
  outline: none !important;
  cursor: pointer;
  z-index: 0;
}
a:hover {
  color: #fff;
  text-shadow: 0px 1px 6px rgba(0, 0, 0, 0.16);
}
a:before {
  content: "";
  position: absolute;
  display: block;
  bottom: 0;
  left: 0;
  height: 0%;
  width: 100%;
  background: transparent;
  z-index: -1;
  border-bottom: 1px dotted #36befd;
  transition: height 0.3s, border 0.3s, background-color 0.15s;
}
a:hover:before {
  height: 100%;
  background: #36befd;
  border-bottom: 1px solid #36befd;
}
.buttons {
  display: table;
  margin: 0px auto;
}
button {
  font-size: 10pt;
  line-height: 28pt;
  font-family: sans-serif;
  font-weight: bold;
  color: #555e6b;
  line-height: 40px;
  border: 1px solid #d6d6d6;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.3s, background-color 0.3s, border-color 0.3s,
    box-shadow 0.3s;
  padding: 0px 14px;
  display: block;
  float: left;
  margin: 5px;
  text-align: center;
  background: rgba(0, 0, 0, 0.02);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  min-width: 80px;
  outline: none !important;
}
button:hover {
  color: #fff;
  background: #6461f6;
  border-color: #6461f6;
  box-shadow: 0 4px 8px -1px rgba(170, 170, 170, 0.45);
}
button:active {
  box-shadow: inset 0 4px 9px -1px rgba(0, 0, 0, 0.15);
}
::selection {
  color: #fff;
  background: #6461f6;
  text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.28);
}
img {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
}
.os-logo {
  background: transparent url("assets/overlayscrollbars.svg") no-repeat center
    center;
  background-size: 80%;
}
.framework-logo {
  background: transparent url("assets/vue.svg") no-repeat center center;
  background-size: 80%;
}
.custom-class-name-test {
  background: rgba(0, 0, 0, 0.03);
}
</style>