import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';

import { ScrollView, View, Image, Text, TextInput, Switch, Button } from 'react-native';

import styles from './styles';


const Main = ({state, actions}) => (
    <ScrollView style={styles.loginView} >
        <Image style={{
            width: 100,
            height: 100,
            alignSelf: 'center',
            marginBottom: 20
        }} source={require('../branding/square.png')} />
        <View style={styles.card}>
            <Text style={styles.p}>
                Log into ConnectorDB
            </Text>
            <TextInput placeholder="Username" autoCorrect={false}
                keyboardType="email-address" value={state.login.username}
                onChangeText={(u) => actions.setLogin({ username: u })} />
            <TextInput placeholder="Password" secureTextEntry={true} value={state.login.password}
                onChangeText={(p) => actions.setLogin({ password: p })} />
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text style={{ marginBottom: 20, paddingRight: 10 }}>
                    DEVICE:
                </Text>
                <TextInput style={{ flex: 1 }} placeholder="Device Name" autoCorrect={false}
                    keyboardType="email-address" value={state.login.devicename}
                    onChangeText={(d) => actions.setLogin({ devicename: d })} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text style={{ marginBottom: 20, paddingRight: 10 }}>
                    SERVER:
                </Text>
                <TextInput style={{ flex: 1 }} placeholder="Server" autoCorrect={false} keyboardType="email-address" value={state.login.server}
                    onChangeText={(s) => actions.setLogin({ server: s })} />
            </View>
            <View style={{ paddingTop: 20 }}>
                <Button onPress={actions.login} title="Log In"
                    color='#005c9e' />
            </View>
        </View>
        <View style={styles.card}>
            <Text style={styles.p}>
                Advanced Options
            </Text>
            <View style={{ flexDirection: "row", flex: 1, paddingTop: 10 }}>
                <Switch style={{ marginBottom: 10 }} value={state.login.localnetwork} onValueChange={(s) => actions.setLogin({ localnetwork: s })} />
                <Text style={{ paddingTop: 5, paddingLeft: 10 }}>Only sync on wifi</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 1, paddingTop: 20 }}>
                <Switch style={{ marginBottom: 10 }} value={state.login.localnetwork} onValueChange={(s) => actions.setLogin({ localnetwork: s })} />
                <Text style={{ paddingTop: 5, paddingLeft: 10 }}>Only sync when on this wifi network</Text>
            </View>
        </View>
        <View style={{ height: 30 }}>
        </View>

    </ScrollView>
);


export default connect(
    (state) => ({ state: state }),
    (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(Main);