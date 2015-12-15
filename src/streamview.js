
'use strict';

var React = require("react-native");

var {
	Text,
    View,
	StyleSheet,
} = React;

var { Icon, } = require('react-native-icons');


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  face: {
    width: 100,
    height: 100
  },
});
module.exports = React.createClass({
	render: function() {
		return (
		<View style={styles.container}>
		<Icon
  name='material|book'
    size={70}
  color='#333333'
  style={styles.face}
/>
		  <Text style={styles.welcome}>
			{this.props.path}
		  </Text>
		  <Text style={styles.instructions}>
			This is the StreamView
		  </Text>
		  <Text style={styles.instructions}>
			Shows properties of a single device
		  </Text>
		</View>);
	}
});
