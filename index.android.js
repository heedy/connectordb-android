'use strict';
console.log("WORKING5");
global.Buffer = global.Buffer || require('buffer').Buffer;

import React, {Component} from 'react';
import {AppRegistry, Text} from 'react-native';

import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
// dispatching from actions
import thunk from 'redux-thunk'

import {reducers} from './src/reducers/index';

// App is the main component that sets up the app
import App from './src/app';

/*

// Set up the redux state storage
import * as storage from 'redux-storage'
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import filter from 'redux-storage-decorator-filter'



// Create the redux store for the android app

// Copy paste from https://github.com/michaelcontento/redux-storage
const reducer = storage.reducer(combineReducers(reducers))
const engine = createEngine("connectordb");

// Creates the redux store
let store = applyMiddleware(storage.createMiddleware(engine), thunk)(createStore)(reducer);

storage.createLoader(engine)(store).then((loadedState) => (console.log(loadedState)));


*/

const reducer = combineReducers(reducers);

let store = applyMiddleware(thunk)(createStore)(reducer);

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
