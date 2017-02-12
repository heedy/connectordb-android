import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import styles from './styles';

import { ScrollView, View, Text, TouchableOpacity } from 'react-native';


const Render = ({state, actions}) => (
    <ScrollView style={styles.tabView}>
        <View style={styles.card}>
            <Text style={styles.h1}>
                Settings
            </Text>
            <Text style={styles.p}>
                Looks like you don't have any downlinks set up.
          </Text>
            <Text style={styles.p}>
                With Downlinks, you can control things with ConnectorDB, such as your lights or thermostat.
          </Text>
        </View>
        <TouchableOpacity onPress={actions.logout}>
            <Text style={{ color: '#005c9e' }}>
                LOG OUT
                        </Text>
        </TouchableOpacity>
    </ScrollView>
);

export default connect(
    (state) => ({ state: state }),
    (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(Render);