import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';


import { addInput } from './input';


class NumberInserter extends Component {
    constructor(props) {
        super(props);
        this.state = { text: '' };
    }
    insertData() {
        let intvalue = parseInt(this.state.text, 10);
        if (!isNaN(intvalue)) {
            this.props.insert(intvalue);
            this.setState({ text: "" });
        }
    }

    render() {
        return (
            <View style={{ flex: 1, height: 40, flexDirection: "row" }}>
                <TextInput
                    style={{ flex: 1 }}
                    multiline={true}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                    keyboardType="numeric"
                    maxLength={10}
                />
                <TouchableOpacity style={{ marginTop: 15 }} onPress={() => this.insertData()} >
                    <Text style={{ color: '#005c9e' }}>
                        INSERT
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

addInput("type:number", NumberInserter);


