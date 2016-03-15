/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

import React, {AppRegistry, Component} from 'react-native';

import {Provider} from 'react-redux'
import {createStore} from 'redux'

// Get the main reducer
import {Reducer} from './src/reducers'

// App is the main component that sets up the app
import {App} from './src/app'

// Create the redux store for the android app
let store = createStore(Reducer);

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
