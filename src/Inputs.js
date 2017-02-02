import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './actions';
import styles from './styles';

import getInput from './components/inputs';

import { ScrollView, View, Text, RefreshControl, Linking, Button, TouchableOpacity } from 'react-native';

// http://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const ratingURL = (state) => (state.main.url + "/" + state.main.user + "/user#create/rating.stars?apikey=" + state.main.apikey);

const Render = ({state, actions}) => (
    <ScrollView style={styles.tabView} contentContainerStyle={styles.tabViewRefreshContainer}
        refreshControl={
            <RefreshControl refreshing={state.inputs.refreshing} onRefresh={actions.refreshInputs} />
        }
        >{state.inputs.streams.length === 0 ? (
            <View style={styles.card}>
                <Text style={styles.h1}>
                    Inputs
                </Text>
                <Text style={styles.p}>
                    Looks like you don't have any inputs set up.
                </Text>
                <Text style={styles.p}>
                    ConnectorDB allows you to rate your mood or productivity, add events, or comments to your diary.
                </Text>
                <View style={{ marginTop: 20 }}>
                    <Button onPress={() => Linking.openURL(ratingURL(state))} title="Add Rating"
                        color='#005c9e' />
                </View>
            </View>
        )
            : (
                <View>
                    {state.inputs.streams.map(function (s) {
                        let Input = getInput(s.datatype, s.schema);
                        return (
                            <View style={styles.card} key={s.name}>
                                <Text style={styles.p}>
                                    {s.nickname !== "" ? s.nickname : capitalizeFirstLetter(s.name)}
                                </Text>
                                {Input !== null ? (<Input stream={s} insert={(data) => actions.insert(state.main.user, "user", s.name, data)} />) : null}
                            </View>
                        );
                    })}
                    <View style={{ marginTop: 20, paddingRight: 15, paddingBottom: 20, alignItems: "flex-end" }}>
                        <TouchableOpacity onPress={() => Linking.openURL(ratingURL(state))}>
                            <Text style={{ color: '#005c9e' }}>
                                ADD RATING
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

    </ScrollView>
);

export default connect(
    (state) => ({ state: state }),
    (dispatch) => ({ actions: bindActionCreators(Actions, dispatch) })
)(Render);