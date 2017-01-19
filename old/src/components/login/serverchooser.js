/**
*	Shows a textbox for typing in the connectordb server
**/
import React, {PropTypes} from 'react';
import {TextInput} from 'react-native';
import {connect} from 'react-redux';

const render = ({value, callback}) => (<TextInput placeholder="Server" autoCorrect={false} keyboardType="email-address" value={value} onChangeText={callback}/>);

render.propTypes = {
    value: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
}

export default connect((state) => ({value: state.login.server}), (dispatch) => ({
    callback: (value) => (dispatch({type: "login/SET_SERVER", value: value}))
}))(render);
