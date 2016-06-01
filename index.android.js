'use strict';
global.Buffer = global.Buffer || require('buffer').Buffer;

import React, {Component} from 'react';
import {AppRegistry} from 'react-native';

import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'

import {reducers} from './src/reducers/index';

// Set up the redux state storage
import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import filter from 'redux-storage-decorator-filter'

// dispatching from actions
import thunk from 'redux-thunk'

// Create the redux store for the android app

// Copy paste from https://github.com/michaelcontento/redux-storage
const reducer = storage.reducer(combineReducers(reducers))
const engine = filter(createEngine("connectordb"), [], ["app", "loaded"]);

// Creates the redux store
let store = applyMiddleware(thunk, storage.createMiddleware(engine))(createStore)(reducer);

storage.createLoader(engine)(store).then((loadedState) => (console.log(loadedState)));

// App is the main component that sets up the app
import App from './src/app'

class Connectordb extends Component {
    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('connectordb_android', () => Connectordb);
