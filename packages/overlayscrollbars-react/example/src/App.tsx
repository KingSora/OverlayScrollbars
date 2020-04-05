import './App.css';
import React, { RefObject } from 'react';
import OverlayScrollbars from 'overlayscrollbars';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';

export interface AppState {
    loremList: Array<string>;
    componentContent: string;
    osComponentOptions: OverlayScrollbars.Options;
    hasCustomClassName: boolean;
}

export default class App extends React.Component<any, AppState> {
    framework: string = 'React';
    customClassName: string = 'custom-class-name-test'
    componentClass: string = 'OverlayScrollbarsComponent';
    loremIpsumLong: string = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
    loremIpsumMedium: string = 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.';
    loremIpsumShort: string = 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.';
    osComponentRef1: RefObject<OverlayScrollbarsComponent>;
    osComponentRef2: RefObject<OverlayScrollbarsComponent>;

    constructor(props: any) {
        super(props);
        this.osComponentRef1 = React.createRef<OverlayScrollbarsComponent>();
        this.osComponentRef2 = React.createRef<OverlayScrollbarsComponent>();
        this.state = {
            hasCustomClassName: false,
            componentContent: 'Lorem Ipsum',
            loremList: [],
            osComponentOptions: {
                resize: 'both',
                paddingAbsolute: true,
                scrollbars: {
                    autoHide: 'never'
                }
            }
        };
    }

    componentDidMount() {
        console.log(`${this.componentClass} (1)`);
        console.log(this.osComponentRef1.current);

        console.log(`${this.componentClass} (2)`);
        console.log(this.osComponentRef2.current);
    }

    onBtnScrollRandom(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, refArray: Array<RefObject<OverlayScrollbarsComponent>>) {
        if (refArray) {
            for (let i = 0; i < refArray.length; i++) {
                if (refArray[i] && refArray[i].current) {
                    const osInstance = refArray[i].current!.osInstance();
                    if (osInstance) {
                        osInstance.scrollStop().scroll({
                            x: Math.floor((Math.random() * osInstance.scroll().max.x) + 0),
                            y: Math.floor((Math.random() * osInstance.scroll().max.y) + 0)
                        }, 1000, 'easeOutElastic');
                    }
                }
            }
        }
    }

    onBtnChangeOptions() {
        this.setState({
            hasCustomClassName: !this.state.hasCustomClassName,
            osComponentOptions: {
                resize: this.state.osComponentOptions.resize === 'both' ? 'none' : 'both',
                scrollbars: {
                    autoHide: this.state.osComponentOptions.scrollbars!.autoHide === 'never' ? 'scroll' : 'never',
                }
            }
        });
    }

    onBtnChangeContent() {
        this.setState({
            componentContent: this.state.componentContent + '\r\n' + this.randomIpsum(),
            loremList: [...this.state.loremList, this.randomIpsum()]
        });
    }

    onBtnLog() {
        console.log(`== ${this.componentClass} (1) ==`);
        console.log('Instance:');
        console.log(this.osComponentRef1.current!.osInstance());
        console.log('Target:');
        console.log(this.osComponentRef1.current!.osTarget());
        console.log('');
        console.log(`== ${this.componentClass} (2) ==`);
        console.log('Instance:');
        console.log(this.osComponentRef2.current!.osInstance());
        console.log('Target:');
        console.log(this.osComponentRef2.current!.osTarget());
    }

    randomIpsum(): string {
        const loremIpsums = [this.loremIpsumLong, this.loremIpsumMedium, this.loremIpsumShort];
        return loremIpsums[Math.floor(Math.random() * loremIpsums.length)];
    }

    render() {
        return (
            <div className="App">
                <div className="header">
                    <code>
                        <span className="code-keyword">import</span>
                        <span className="code-char">{' { '}</span>
                        <span className="code-variable">OverlayScrollbarsComponent</span>
                        <span className="code-char">{' } '}</span>
                        <span className="code-keyword">from</span>
                        <span className="code-string">{" 'overlayscrollbars-react'"}</span>
                        <span className="code-char">;</span>
                    </code>
                </div>
                <div className="content">
                    <div className="content-section skew">
                        <div className="content-section-content content-section-content-framework">
                            <span className="framework-logo"></span>
                            <span>+</span>
                            <span className="os-logo"></span>
                        </div>
                    </div>
                    <div className="content-section">
                        <div className="content-section-title">
                            <h2>Component</h2>
                            <table>
                                <tbody>
                                    <tr>
                                        <td><span>Class:</span></td>
                                        <td><span>{this.componentClass}</span></td>
                                    </tr>
                                    <tr>
                                        <td><span>Description:</span></td>
                                        <td>OverlayScrollbars as a {this.framework}-Component.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="content-section-content">

                            <OverlayScrollbarsComponent ref={this.osComponentRef1}
                                options={this.state.osComponentOptions}
                                style={{ maxHeight: '350px' }}
                                className={`${this.framework} ${this.state.hasCustomClassName ? this.customClassName : ''}`}
                            >
                                <div className="bonus-content">
                                    {this.state.componentContent}
                                </div>
                                {this.loremIpsumShort}
                                <OverlayScrollbarsComponent ref={this.osComponentRef2}
                                    options={this.state.osComponentOptions}
                                    style={{ maxHeight: '150px' }}
                                    className={this.state.hasCustomClassName ? this.customClassName : ''}
                                >
                                    <div className="bonus-content">
                                        {this.state.componentContent}
                                    </div>
                                    {this.loremIpsumLong}
                                    <br />
                                    <br />
                                    {this.loremIpsumShort}
                                </OverlayScrollbarsComponent>
                                {this.loremIpsumMedium}
                                <br />
                                <br />
                                {this.loremIpsumShort}
                                <br />
                                <br />
                                {this.loremIpsumLong}
                                {
                                    this.state.loremList.map((item, index) => {
                                        return <div key={index} data-key={index}><br />{item}</div>;
                                    })
                                }
                            </OverlayScrollbarsComponent>

                            <div className="buttons">
                                <button onClick={(event) => { this.onBtnScrollRandom.call(this, event, [this.osComponentRef1, this.osComponentRef2]) }}>Scroll</button>
                                <button onClick={() => { this.onBtnChangeOptions.call(this) }}>Change Options</button>
                                <button onClick={() => { this.onBtnChangeContent.call(this) }}>Change Content</button>
                                <button onClick={() => { this.onBtnLog.call(this) }}>Log</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
