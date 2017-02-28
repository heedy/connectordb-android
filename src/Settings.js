import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import styles from './styles';

import { ScrollView, View, Text, TouchableOpacity, Button, Switch } from 'react-native';


const Render = ({state, actions}) => (
    <ScrollView style={styles.tabView}>
        <View style={styles.card}>
            <Text style={styles.p}>
                Basic Options
            </Text>
            <View style={{ flexDirection: "row", flex: 1, paddingTop: 10, paddingBottom: 10 }}>
                <Switch style={{ marginBottom: 10 }} value={state.settings.sync.enabled} onValueChange={(s) => actions.bgSync(s)} />
                <Text style={{ paddingTop: 5, paddingLeft: 10 }}>Sync to ConnectorDB in background</Text>
            </View>
            <Button onPress={actions.sync} title="Sync Now" accessibilityLabel="Write cached data to ConnectorDB server" />
        </View>
        <View style={styles.card}>
            <Text style={styles.p}>
                Data Logging
            </Text>
            {Object.keys(state.settings.loggers).map(function (key) {
                let s = state.settings.loggers[key];
                return (
                    <View key={key} style={{ flexDirection: "row", flex: 1, paddingTop: 10, paddingBottom: 10 }}>
                        <Switch style={{ marginBottom: 10 }} value={s.enabled} onValueChange={(v) => actions.setLoggerEnabled(key, v)} />
                        <View>
                            <Text style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10, color: '#333333' }}>{s.nickname}</Text>
                            <Text style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 40 }}>{s.description}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
        <View style={styles.card}>
            <Text style={styles.p}>
                Advanced
            </Text>
            <Button onPress={actions.logout} title="Log Out" accessibilityLabel="Log Out of ConnectorDB" />
        </View>
    </ScrollView>
);

export default connect(
    (state) => ({ state: state }),
    (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(Render);