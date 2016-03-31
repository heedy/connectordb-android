/**
*	Shows a textbox for typing in the connectordb username
**/
import React, {PropTypes, TextInput} from 'react-native';
import {connect} from 'react-redux';

const render = ({value, callback}) => (<TextInput placeholder="Username" autoCorrect={false} keyboardType="email-address" value={value} onChangeText={callback}/>);

render.propTypes = {
    value: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
}

export default connect((state) => ({value: state.app.username_textbox}), (dispatch) => ({
    callback: (value) => (dispatch({type: "APP_SET_USERNAME", value: value}))
}))(render);
