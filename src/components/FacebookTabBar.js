// https://github.com/skv-headless/react-native-scrollable-tab-view/blob/master/examples/FacebookTabsExample/FacebookTabBar.js

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const inactiveColor = {
    r: 240,
    g: 240,
    b: 240
};
const activeColor = {
    r: 255,
    g: 255,
    b: 255
};

const FacebookTabBar = React.createClass({
    tabIcons: [],

    propTypes: {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
    },

    componentDidMount() {
        this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
    },

    setAnimationValue({ value, }) {
        this.tabIcons.forEach((icon, i) => {
            const progress = Math.min(1, Math.abs(value - i))
            icon.setNativeProps({
                style: {
                    color: this.iconColor(progress),
                },
            });
        });
    },

    iconColor(progress) {
        const red = activeColor.r + (inactiveColor.r - activeColor.r) * progress;
        const green = activeColor.g + (inactiveColor.g - activeColor.g) * progress;
        const blue = activeColor.b + (inactiveColor.b - activeColor.b) * progress;
        return `rgb(${red}, ${green}, ${blue})`;
    },

    render() {
        return <View style={[styles.tabs, this.props.style,]}>
            {this.props.tabs.map((tab, i) => {
                return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={
                    this.props.activeTab === i ?
                        styles.activeTab : styles.tab
                } >
                    <Icon
                        name={tab}
                        size={30}
                        color={this.props.activeTab === i ?
                            `rgb(${activeColor.r},${activeColor.g},${activeColor.b})` :
                            `rgb(${inactiveColor.r},${inactiveColor.g},${inactiveColor.b})`}
                        ref={(icon) => { this.tabIcons[i] = icon; } }
                        />
                </TouchableOpacity>;
            })}
        </View>;
    },
});

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        borderBottomWidth: 3,
        borderBottomColor: "#009e42",
    },
    activeTab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#005c9e',
    },
    tabs: {
        height: 45,
        flexDirection: 'row',
        paddingTop: 5,
        //borderWidth: 1,
        //borderTopWidth: 0,
        //borderLeftWidth: 0,
        //borderRightWidth: 0,
        //borderBottomColor: 'rgba(0,0,0,0.05)',
        backgroundColor: "#009e42"
    },
});

export default FacebookTabBar;