/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  ToolbarAndroid,
} = React;

var DeviceView = require("./src/login");

var ConnectorDB = React.createClass({
  render: function() {

      var navigationView = (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>Im in the Drawer!</Text>
      </View>
      );

    return (
        <DrawerLayoutAndroid drawerWidth={300}
            drawerPosition={DrawerLayoutAndroid.positions.Left}
            renderNavigationView={() => navigationView}>
            <ToolbarAndroid title="ConnectorDB" />
            <DeviceView path="dkumor/device1"/>
      </DrawerLayoutAndroid>
    );
  }
});



AppRegistry.registerComponent('ConnectorDB', () => ConnectorDB);
