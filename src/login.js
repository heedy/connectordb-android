'use strict';

var React = require("react-native");
var {
	Text,
    View,
	StyleSheet,
	Image,
} = React;

var { Icon, } = require('react-native-icons');

//Load the global app styling
var styles = require("./styles");

module.exports = React.createClass({
	render: function() {
		return (
			<View style={styles.container}>
		<Image style={{width: 200, height: 200, borderColor: "red",borderWidth: 5}} source={require("./img/login_bg.png")} />

		  <Text style={styles.welcome}>
			Log In
		  </Text>
		  <Text style={styles.instructions}>
			This is the Login Screen
		  </Text>
		  <Text>Log into ConnectorDB
		  </Text></View>
	);
	}
});
