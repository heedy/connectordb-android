import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';

import { StatusBar, View } from 'react-native';

import FacebookTabBar from './components/FacebookTabBar';
import ErrorBar from './components/ErrorBar';
import ScrollableTabView from 'react-native-scrollable-tab-view';


import Downlinks from './Downlinks';
import Inputs from './Inputs';
import Settings from './Settings';

const Main = ({state, actions}) => (
    <View style={{ flex: 1 }}>
        <StatusBar
            backgroundColor="#009e42"
            barStyle="light-content"
            />
        <ScrollableTabView renderTabBar={() => <FacebookTabBar />} locked={true}>
            <Inputs tabLabel="ios-star" />
            <Downlinks tabLabel="ios-bulb" />
            <Settings tabLabel="ios-settings" />
        </ScrollableTabView>
        <ErrorBar error={state.error} />
    </View>
);


export default connect(
    (state) => ({ state: state }),
    (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(Main);