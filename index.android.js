/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {AppRegistry, Component,} from 'react-native';

import {Provider} from 'react-redux'
import {createStore, applyMiddleware,} from 'redux'

// Get the main reducer
import Reducer from './src/reducers'

// Set up the redux state storage
import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import filter from 'redux-storage-decorator-filter'

// Create the redux store for the android app

// Copy paste from https://github.com/michaelcontento/redux-storage
const reducer = storage.reducer(Reducer)
const engine = filter(createEngine("connectordb"), [], ["app", "loaded",]);

// Creates the redux store
let store = applyMiddleware(storage.createMiddleware(engine))(createStore)(reducer);

storage
    .createLoader(engine)(store)
    .then((loadedState) => (console.log(loadedState)));

// App is the main component that sets up the app
import App from './src/app'

class connectordb extends Component {
    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('connectordb_android', () => connectordb);
