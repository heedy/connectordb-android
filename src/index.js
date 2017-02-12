import React from 'react'
import { Component } from 'react-native';
import { Provider, connect } from 'react-redux';

import { createStore, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'
import createLogger from 'redux-logger';

// Imports the sagas (asynchronous actions) that run on certain things.
// All network requests and database updates are performed as sagas.
import sagas from './sagas';

// All state changes happen through the reducers
import reducers from './reducers';

// Set up all the input types
import './components/inputs/registry';

import Main from './Main';
import Loading from './Loading';
import Login from './Login';

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

// This chooses whether to show the loading, login, or main screen of the app.
const ScreenChooser = connect(
    (state) => ({ state: state })
)(({state}) => {
    // main.loaded is set to true when the app is finished loading data from
    // the app storage
    if (!state.main.loaded) return (<Loading />);
    // If after loading data, there is no apikey, show the login screen
    if (state.main.apikey === "") return (<Login />);
    // There is an apikey, so show the main screen.
    return (<Main />);
});


const App = () => {
    return (
        <Provider store={store}>
            <ScreenChooser />
        </Provider>
    )
}

export default App

// TEMPORARY CODE: Get past the loading screen, since we don't yet have app storage
// configured
/*
store.dispatch({
    type: "SET_CREDENTIALS", value: {
        url: "http://10.0.2.2:3124",
        user: "test",
        apikey: "2911e03a-e0ef-4e8c-6515-dd3bfdb24174"
    }
});*/
store.dispatch({
    type: "SET_LOGIN",
    value: { server: "http://192.168.1.122:3124" }
});

// Loads all saved values from storage. The loading screen will be hidden when values 
// are all loaded.
store.dispatch({ type: "LOAD_STORAGE" });
// store.dispatch({ type: "LOAD_FINISHED" }); // For use when debugging without backend storage.
