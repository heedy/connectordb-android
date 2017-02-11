import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


import { addInput } from './input';

addInput("type:boolean", ({stream, insert}) => (
    <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={{ marginTop: 15, flex: 1 }} onPress={() => insert(true)}>
            <Text style={{ color: '#005c9e', textAlign: "center" }}>
                TRUE
            </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 15, flex: 1 }} onPress={() => insert(false)}>
            <Text style={{ color: '#005c9e', textAlign: "center" }}>
                FALSE
            </Text>
        </TouchableOpacity>
    </View>
));