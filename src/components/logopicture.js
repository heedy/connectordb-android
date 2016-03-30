import React, {PropTypes} from 'react-native';
import {View, Image,} from 'react-native';

const LogoPicture = ({width, height}) => (
    <View style={{
        justifyContent: 'center',
        alignItems: 'center',
    }}>
        <Image style={{
            width: width,
            height: height,
        }} source={require('../../branding/square.png')}/>
    </View>
);

LogoPicture.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
}

export default LogoPicture;
