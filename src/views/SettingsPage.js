import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text} from 'react-native';
import t from 'tcomb-form-native';
import transform from 'tcomb-json-schema';
import {Card, Button, Checkbox} from 'react-native-material-design';
import GatherCheckbox from '../components/gathercheckbox';
import AutoSync from '../components/autosync';

class SettingsPage extends Component {

    render() {
        var l = this.props.loggers;
        return (
            <View>
                <Card>
                    <Card.Body>
                        <Text>Android Logger Settings</Text>
                        <GatherCheckbox/>
                        <AutoSync/>
                    </Card.Body>
                </Card>
                {Object.keys(l).map((key) => {
                    return (
                        <Card key={key}>
                            <Card.Body>
                                <Text>{l[key].nickname != ""
                                        ? l[key].nickname
                                        : key}</Text>
                                <Text>{l[key].description}</Text>
                                <Checkbox value={key} label="Enabled" checked={true}/></Card.Body>
                        </Card>
                    );
                })}
            </View>
        );
    }
}
export default connect((state) => ({loggers: state.logger.loggers}))(SettingsPage);
