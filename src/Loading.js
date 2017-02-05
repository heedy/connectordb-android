import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';

import { View, ActivityIndicator, Text } from 'react-native';




const Main = ({state, actions}) => (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20, flex: 1 }}>
        <ActivityIndicator animating={true} size="large" />
        <Text>Loading...</Text>
    </View>
);


export default connect(
    (state) => ({ state: state }),
    (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(Main);