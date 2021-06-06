import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { scale } from '../../../utils/scale';                         
const ACTIVITY_WIDTH = (Dimensions.get('window').width - scale(90)) / 3

export default class PetActivity extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        //let margin = this.props.activity == 2 ? { marginHorizontal: scale(10) } : null
        return (
            <View style={{ alignItems: "center" }}>
                <TouchableOpacity
                    onPress={() => this.props.onClick(this.props.activity)}
                    style={styles.activity(this.props.activity)}>
                    {this.props.Icon}
                </TouchableOpacity>
                <Text style={{ color: "#ECC951", marginTop: scale(7) }}>{this.props.text}</Text>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    activity: (num) => {
        return {
            width: ACTIVITY_WIDTH,
            height: ACTIVITY_WIDTH,
            borderRadius: scale(50),
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#ECC951",
            borderWidth: 1,
            marginHorizontal: num == 2 || num == 5 ? scale(25) : null
        }
    }
})