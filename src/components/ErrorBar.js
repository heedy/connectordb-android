import React, { Component } from 'react';

import { View, Text } from 'react-native';

const Render = ({error}) => (error === null || error.text === undefined || error.text === "" ? null :
    (
        <View style={{
            backgroundColor: error.color !== undefined ? error.color : '#ef553a',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            alignItems: "center"
        }}>
            <Text style={{
                color: "#fff",
                fontSize: 16
            }}>{error.text}</Text>
        </View>
    )
);

export default Render;