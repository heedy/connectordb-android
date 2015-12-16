'use strict';

var React = require("react-native");
var {
	Text,
    View,
	StyleSheet,
	Image,
	TextInput,
	ScrollView,
	TouchableNativeFeedback,
} = React;

var { Icon, } = require('react-native-icons');

//The Login screen uses its own custom styling
var styles = {
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		height: 550,
	},
	//The logo image shown at top
	logoImage: {
		width:100,
		height: 100,
		padding:25,
	},
	loginText: {
		fontSize: 30,
		color: "white",
		margin: 10,
	},
	loginBox: {
		color: "white",
		margin: 0,
	},
	advancedoptions: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
		borderRadius: 8,
		backgroundColor: "rgba(32,32,32,0.8)",
		width: 325,
	},
	advancedoption: {
		height: 45,
		width: 255,
		flexDirection: "row",
	},
	advancedText: {
		color: "gray",
		fontSize: 12,
	},
	advancedBox: {
		color: "gray",
		fontSize:10,
		height: 30,
		flex: 1,
	},
	submitButton: {
		backgroundColor: "#005c9e",
		width: 300,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 6,
	},
	submitText: {
		color: "white",

	},
	loginArea: {
		width: 320,
		justifyContent: 'center',
		alignItems: 'center',
	}
};

module.exports = React.createClass({

	submitClicked: function() {
		//Called when the submit button is pressed
	},

	getInitialState: function() {
		return {
			username: "",
			password: "",
			server: "https://connectordb.com",
			devicename: "phone-1",
			advancedoptions: true,
		};
	},
	render: function() {
		//Making things look good is *HARD*
		return (
			<View style={{justifyContent: 'center',alignItems: 'center', flex: 1}}>
			<Image style={{position:"absolute",top:0,bottom:0,left:0,right:0}} resizeMode="cover"
				source={require("./img/login_bg.png")} />
			<ScrollView contentContainerStyle={styles.container} >
				<Image style={styles.logoImage} resizeMode="contain"
					source={require("./img/logo.png")} />
				<Text style={styles.loginText}>Log In</Text>
				<View style={styles.loginArea} >
					<TextInput style={styles.loginBox} underlineColorAndroid="white" textAlign="center"
						placeholderTextColor="gray" placeholder="Username"
						onChangeText={(username) => this.setState({username})}
						value={this.state.username} />
					<TextInput style={styles.loginBox} underlineColorAndroid="white" textAlign="center"
						placeholderTextColor="gray" secureTextEntry={true} placeholder="Password"
						onChangeText={(password) => this.setState({password})}
						value={this.state.password} />

					<TouchableNativeFeedback onPress={this.submitClicked}
						background={TouchableNativeFeedback.Ripple()} delayPressIn={0} >
						<View style={styles.submitButton} >
							<Text style={styles.submitText}>Log In</Text>
						</View>
					</TouchableNativeFeedback>
				</View>

					<View style={{flex: 1}}>
					</View>

					<View style={styles.advancedoptions}>
						<Text style={{color:"lightgray", padding: 5}}>Advanced</Text>
						<View style={styles.advancedoption} >
						<Text style={styles.advancedText}>Server:</Text>
						<TextInput style={styles.advancedBox} underlineColorAndroid="gray"
							onChangeText={(server => this.setState({server}))}
							value={this.state.server} />
						</View>
						<View style={styles.advancedoption} >
						<Text style={styles.advancedText}>Device:</Text>
						<TextInput style={styles.advancedBox} underlineColorAndroid="gray"
							onChangeText={(devicename => this.setState({devicename}))}
							value={this.state.devicename} />
						</View>
					</View>


		</ScrollView>
		</View>
	);
	}
});
