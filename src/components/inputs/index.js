import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from '../../styles';
import getInput from './input';

// http://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


// Takes an array of streams, and returns the necessary react elements to allow inputs
export default function mapInputs(streams, inserter, username = null, devicename = null) {
    return streams.map(function (s) {
        let Input = getInput(s.datatype, s.schema);
        if (Input == null) return null;   // Don't show the input if we can't display it
        let uname = (s.user !== undefined ? s.user : username);
        let dname = (s.device !== undefined ? s.device : devicename);
        return (
            <View style={styles.card} key={s.name}>
                <Text style={styles.p}>
                    {s.nickname !== "" ? s.nickname : capitalizeFirstLetter(s.name)}
                </Text>
                {Input !== null ? (<Input stream={s} insert={(data) => inserter(uname, dname, s.name, data)} />) : null}
            </View>
        );
    });
}