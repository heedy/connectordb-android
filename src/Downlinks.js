import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import styles from './styles';

import { ScrollView, View, Text, RefreshControl } from 'react-native';

import mapInputs from './components/inputs';

const Render = ({state, actions}) => (
    <ScrollView style={styles.tabView}
        contentContainerStyle={styles.tabViewRefreshContainer}
        refreshControl={
            <RefreshControl refreshing={state.downlinks.refreshing} onRefresh={actions.refreshDownlinks} />
        }
    >


        {state.downlinks.streams.length === 0 ? (
            <View style={styles.card}>
                <Text style={styles.h1}>
                    Downlinks
            </Text>
                <Text style={styles.p}>
                    Looks like you don't have any downlinks set up.
          </Text>
                <Text style={styles.p}>
                    With Downlinks, you can control things with ConnectorDB, such as your lights or thermostat.
          </Text>
            </View>
        )
            : (
                <View>
                    {mapInputs(state.downlinks.streams, actions.insert, state.main.user)}
                </View>
            )}
    </ScrollView>
);

export default connect(
    (state) => ({ state: state }),
    (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(Render);