/**
*	Shows a checkbox which toggles background data-gathering
**/
import React, {PropTypes} from 'react-native';
import {connect} from 'react-redux';
import {Checkbox} from 'react-native-material-design';

const render = ({checked, callback}) => (<Checkbox value="gather" label="Gather data in the background" checked={checked} onCheck={callback}/>);

render.propTypes = {
    checked: PropTypes.bool.isRequired,
    callback: PropTypes.func.isRequired,
}

export default connect((state) => ({checked: state.gather}), (dispatch) => ({
    callback: (value) => {
        dispatch({type: "SET_GATHER", value: value});
    }
}))(render);
