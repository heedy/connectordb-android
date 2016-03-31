/**
*	Shows a textbox for typing in your connectordb password
**/
import React, {PropTypes, TextInput,} from 'react-native';
import {connect} from 'react-redux';

const render = ({value, callback,}) => (<TextInput placeholder="Password" secureTextEntry={true} value={value} onChangeText={callback}/>);

render.propTypes = {
    value: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
}

export default connect((state) => ({value: state.app.password_textbox}), (dispatch) => ({
    callback: (value) => (dispatch({type: "APP_SET_PASSWORD", value: value,}))
}))(render);
