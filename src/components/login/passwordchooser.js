/**
*	Shows a textbox for typing in your connectordb password
**/
import React, {PropTypes} from 'react';
import {TextInput} from 'react-native';
import {connect} from 'react-redux';

const render = ({value, callback}) => (<TextInput placeholder="Password" secureTextEntry={true} value={value} onChangeText={callback}/>);

render.propTypes = {
    value: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
}

export default connect((state) => ({value: state.login.password}), (dispatch) => ({
    callback: (value) => (dispatch({type: "login/SET_PASSWORD", value: value}))
}))(render);
