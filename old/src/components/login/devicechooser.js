/**
*	Shows a textbox for typing in the connectordb device name
**/
import React, {PropTypes} from 'react';
import {TextInput} from 'react-native';
import {connect} from 'react-redux';

const render = ({value, callback}) => (<TextInput placeholder="Device" autoCorrect={false} keyboardType="email-address" value={value} onChangeText={callback}/>);

render.propTypes = {
    value: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
}

export default connect((state) => ({value: state.login.device}), (dispatch) => ({
    callback: (value) => (dispatch({type: "login/SET_DEVICE", value: value}))
}))(render);
