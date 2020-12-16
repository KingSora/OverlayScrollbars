import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-ngx';
import OverlayScrollbars from 'overlayscrollbars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  framework: string = 'Angular';
  customClassName: string = 'custom-class-name-test';
  componentClass: string = 'OverlayScrollbarsComponent';
  loremIpsumLong: string =
    'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
  loremIpsumMedium: string =
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.';
  loremIpsumShort: string =
    'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.';
  loremList: Array<string> = [];
  hasCustomClassName: boolean = false;
  componentContent: string = 'Lorem Ipsum';
  osComponentOptions: OverlayScrollbars.Options = {
    resize: 'both',
    paddingAbsolute: true,
    scrollbars: {
      autoHide: 'never',
    },
  };
  @ViewChild('osComponentRef1', { read: OverlayScrollbarsComponent })
  osComponentRef1: OverlayScrollbarsComponent;
  @ViewChild('osComponentRef2', { read: OverlayScrollbarsComponent })
  osComponentRef2: OverlayScrollbarsComponent;

  ngAfterViewInit() {
    console.log(`${this.componentClass} (1)`);
    console.log(this.osComponentRef1);

    console.log(`${this.componentClass} (2)`);
    console.log(this.osComponentRef2);
  }

  onBtnScrollRandom(
    event: any,
    refArray: ReadonlyArray<OverlayScrollbarsComponent>
  ) {
    if (refArray) {
      for (let i = 0; i < refArray.length; i++) {
        if (refArray[i]) {
          const osInstance = refArray[i].osInstance();
          osInstance.scrollStop().scroll(
            {
              x: Math.floor(Math.random() * osInstance.scroll().max.x + 0),
              y: Math.floor(Math.random() * osInstance.scroll().max.y + 0),
            },
            1000,
            'easeOutElastic'
          );
        }
      }
    }
  }

  onBtnChangeOptions() {
    this.hasCustomClassName = !this.hasCustomClassName;
    this.osComponentOptions = {
      resize: this.osComponentOptions.resize === 'both' ? 'none' : 'both',
      scrollbars: {
        autoHide:
          this.osComponentOptions.scrollbars.autoHide === 'never'
            ? 'scroll'
            : 'never',
      },
    };
  }

  onBtnChangeContent() {
    this.componentContent = this.componentContent + '\r\n' + this.randomIpsum();
    this.loremList.push(this.randomIpsum());
  }

  onBtnLog() {
    console.log(`== ${this.componentClass} (1) ==`);
    console.log('Ref:');
    console.log(this.osComponentRef1);
    console.log('Instance:');
    console.log(this.osComponentRef1.osInstance());
    console.log('Target:');
    console.log(this.osComponentRef1.osTarget());
    console.log('');
    console.log(`== ${this.componentClass} (2) ==`);
    console.log('Ref:');
    console.log(this.osComponentRef2);
    console.log('Instance:');
    console.log(this.osComponentRef2.osInstance());
    console.log('Target:');
    console.log(this.osComponentRef2.osTarget());
  }

  randomIpsum(): string {
    const loremIpsums = [
      this.loremIpsumLong,
      this.loremIpsumMedium,
      this.loremIpsumShort,
    ];
    const random = Math.floor(Math.random() * loremIpsums.length);
    return loremIpsums[random];
  }
}
