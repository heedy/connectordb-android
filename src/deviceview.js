
'use strict';

var React = require("react-native");
var {
	Text,
    View,
	StyleSheet,
} = React;
var { Icon, } = require('react-native-icons');

//Load the global app styling
var styles = require("./styles");

var DeviceView = React.createClass({
	render: function() {
		return (
		<View style={styles.container}>
		<Icon
  name='material|devices'
    size={70}
  color='#333333'
  style={styles.face}
/>
		  <Text style={styles.welcome}>
			{this.props.path}
		  </Text>
		  <Text style={styles.instructions}>
			This is the DeviceView
		  </Text>
		  <Text style={styles.instructions}>
			Shows properties of a single device
		  </Text>
		</View>);
	}
});


module.exports = DeviceView;
