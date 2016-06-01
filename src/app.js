import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ScrollView, Navigator} from 'react-native';
import Login from './views/LoginPage';
import Settings from './views/SettingsPage';

class App extends Component {
    render() {
        return (
            <ScrollView>
                {this.props.loggedIn
                    ? (<Settings/>)
                    : (<Login/>)}
            </ScrollView>
        );

    }
}

export default connect((state) => ({loggedIn: state.app.loggedIn}))(App);
