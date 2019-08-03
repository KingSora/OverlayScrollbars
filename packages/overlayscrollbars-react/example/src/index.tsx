import 'overlayscrollbars/css/OverlayScrollbars.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import OverlayScrollbars from 'overlayscrollbars';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();

OverlayScrollbars(document.body, {
    nativeScrollbarsOverlaid: {
        initialize: false
    }
});