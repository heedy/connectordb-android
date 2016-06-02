import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    DrawerLayoutAndroid,
    Image
} from 'react-native';

import {Button, Card, Ripple, Checkbox} from 'react-native-material-design';

import {connect} from 'react-redux';

import LogoPicture from '../components/logopicture';
import GatherCheckbox from '../components/gathercheckbox';

import ServerChooser from '../components/login/serverchooser';
import PasswordChooser from '../components/login/passwordchooser';
import UsernameChooser from '../components/login/usernamechooser';
import DeviceChooser from '../components/login/devicechooser';

import login from '../actions/login';

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#F5FCFF'
    },
    labeltext: {
        flex: 1,
        flexDirection: "row"
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});
/*
const render = (props) => (
    <View style={styles.container}>
        <LogoPicture width={100} height={100}/>
        <Text style={styles.welcome}>
            ConnectorDB
        </Text>
        <Card>
            <Card.Body>
                <Text>Log In to ConnectorDB</Text>
                <UsernameChooser/>
                <PasswordChooser/>
            </Card.Body>
            <Card.Actions position="left">
                <Button text="Login" onPress={() => props.login(props.loginState)}/>
            </Card.Actions>
        </Card>

        <Card>
            <Card.Body>
                <Text>Server:</Text>
                <ServerChooser/>
                <Text>Device Name:</Text>
                <DeviceChooser/>
            </Card.Body>
        </Card>
        <Card>
            <Card.Body>
                <Text>While Logged Out:</Text>
                <GatherCheckbox/>
            </Card.Body>
        </Card>

    </View>
);
*/
const render = (props) => (
    <View style={styles.container}>
        <LogoPicture width={100} height={100}/>
        <Text style={styles.welcome}>
            ConnectorDB
        </Text>
        <Card>
            <Card.Body>
                <Text>Log In to ConnectorDB</Text>
                <UsernameChooser/>
                <PasswordChooser/>
            </Card.Body>
            <Card.Actions>
                <Button text="Login" onPress={() => props.login(props.loginState)}/>
            </Card.Actions>
        </Card>
        <Card>
            <Card.Body>
                <Text>Server:</Text>
                <ServerChooser/>
                <Text>Device Name:</Text>
                <DeviceChooser/>
            </Card.Body>
        </Card>
    </View>
);

export default connect((state) => ({loginState: state.login}), (dispatch) => ({
    login: (state) => dispatch(login(state))
}))(render);
