import React, { Component } from 'react';
import {
    View,
} from 'react-native';
import {
    RkButton,
    RkText
} from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/FontAwesome';

export class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { iconName, menuName, onClick, style } = this.props;
        return (
            <RkButton onPress={() => onClick()} rkType="clear" style={style} >
                <View>
                    <Icon name={iconName} size={30} style={{ textAlign: 'center', color: '#ECC951' }} />
                    <RkText rkType="small" style={{ color: '#ECC951' }}>{menuName}</RkText>
                </View>
            </RkButton>
        )
    }
}

