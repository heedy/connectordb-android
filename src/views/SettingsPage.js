import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, Text} from 'react-native';
import t from 'tcomb-form-native';
import transform from 'tcomb-json-schema';
import {Card, Button} from 'react-native-material-design';
import GatherCheckbox from '../components/gathercheckbox';

class SettingsPage extends Component {

    render() {
        var l = this.props.loggers;
        return (
            <View>
                <Card>
                    <Card.Body>
                        <Text>Android Logger Settings</Text>
                        <GatherCheckbox/>
                    </Card.Body>
                </Card>
                {Object.keys(l).map((key) => {
                    return (
                        <Card key={key}>
                            <Card.Body></Card.Body>
                        </Card>
                    );
                })}
            </View>
        );
    }
}
export default connect((state) => ({loggers: state.logger.loggers}))(SettingsPage);
