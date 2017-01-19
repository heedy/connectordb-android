/**
*	Shows a checkbox which toggles background data-gathering

WARNING: Do not put this component on the login page. I don't know why on earth,
but the app crashes if this component is on the login page during the first run of the app
when the "Google Login" form is shown to give access to google fit. I spent like... 3 hours
trying to figure out what was wrong, before using several expletives, and giving up.
**/
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Checkbox} from 'react-native-material-design';

import {setGather} from '../actions/logger';

const render = ({checked, callback}) => (<Checkbox value="gather" label="Gather data in the background" checked={checked} onCheck={callback}/>);

render.propTypes = {
    checked: PropTypes.bool.isRequired,
    callback: PropTypes.func.isRequired
}

export default connect((state) => ({checked: state.logger.gather}), (dispatch) => ({
    callback: (value) => {
        dispatch(setGather(value));
    }
}))(render);
