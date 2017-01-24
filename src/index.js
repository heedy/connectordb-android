import React from 'react'
import { Component } from 'react-native';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createLogger from 'redux-logger';

// Imports the sagas (asynchronous actions) that run on certain things.
// All network requests and database updates are performed as sagas.
import sagas from './sagas';

// All state changes happen through the reducers
import reducers from './reducers';

import Main from './Main';

const sagaMiddleware = createSagaMiddleware();
const loggerMiddleware = createLogger({
    colors: {},
});

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(sagaMiddleware, loggerMiddleware)
);

// Start listening to the relevant sagas
sagaMiddleware.run(sagas);

const App = () => {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    )
}

export default App