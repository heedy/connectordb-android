import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import styles from './styles';

import { ScrollView, View, Text, TouchableOpacity, Button, Switch, Linking } from 'react-native';


const Render = ({ state, actions }) => (
    <ScrollView style={styles.tabView}>
        <View style={styles.card}>
            <Text style={styles.p}>
                Basic Options
            </Text>
            <View style={{ flexDirection: "row", flex: 1, paddingTop: 10, paddingBottom: 10 }}>
                <Switch style={{ marginBottom: 10 }} value={state.settings.sync.enabled} onValueChange={(s) => actions.bgSync(s)} />
                <Text style={{ paddingTop: 5, paddingLeft: 10 }}>Sync to ConnectorDB in background</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1, paddingTop: 10, paddingBottom: 30 }}>
                <Switch style={{ marginBottom: 10 }} value={state.settings.sync.ssid !== ""} onValueChange={(s) => actions.setSSID(s)} />
                <Text style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 40 }}>{state.settings.sync.ssid == "" ? "Only sync when connected to current wifi network" :
                    "Only sync when connected to " + state.settings.sync.ssid}</Text>
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
            <View style={{ marginTop: 20, paddingRight: 15, paddingBottom: 20, marginBottom: 20 }}>
                <TouchableOpacity onPress={() => Linking.openURL("https://github.com/connectordb/connectordb-android/issues")}>
                    <Text style={{ color: '#005c9e', textAlign: "center" }}>
                        Request Feature/Report Bug
                        </Text>
                </TouchableOpacity>
            </View>
            <Button onPress={actions.logout} title="Log Out" accessibilityLabel="Log Out of ConnectorDB" />
        </View>
        <View style={{ marginBottom: 20 }}><Text></Text></View>
    </ScrollView >
);

export default connect(
    (state) => ({ state: state }),
    (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(Render);

/* Should allow server updating at some point
 <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <TextInput style={{ flex: 1 }} placeholder="Server" autoCorrect={false} keyboardType="email-address" value={state.login.server}
                    onChangeText={(s) => actions.setLogin({ server: s })} />
                <TouchableOpacity onPress={() => Linking.openURL("https://github.com/connectordb/connectordb-android/issues")}>
                    <Text style={{ marginBottom: 20, paddingRight: 10 }}>
                        Update URL
                    </Text>
                </TouchableOpacity>
            </View>
 */