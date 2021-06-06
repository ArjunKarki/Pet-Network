import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { scale } from '../utils/scale';
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { formatDate } from '../utils/commonService';

export class ActivityTimer extends Component {

    render() {
        return (
            <View>
                <Text style={{ color: "#fff", fontSize: scale(20), marginTop: scale(15), marginLeft: scale(5) }}>Upcomming</Text>
                <View style={{ height: scale(1), backgroundColor: "#ECC951", width: scale(120) }} />
                {
                    this.props.upCommingDate == null ?
                        <TouchableOpacity
                            onPress={() => { this.props.showDateTimeModal() }}
                            style={{ flexDirection: 'row', justifyContent: "center", alignItems: "center", marginTop: scale(10) }}>
                            <MIcon name="timer" size={scale(18)} color="#fff" />
                            <Text style={{ color: "#fff", fontSize: scale(18), marginLeft: scale(5) }}>Add Reminder</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ flexDirection: "row", marginTop: scale(5) }}>
                            <View style={{ flex: 1, alignSelf: "flex-end" }}>
                                <Text style={{ color: "#fff", fontSize: scale(15) }}>{formatDate(this.props.upCommingDate.date)}</Text>
                            </View>
                            <View style={{ flexDirection: "row", flex: 1.4 }}>
                                <View style={{ flexDirection: "column", flex: 1, alignItems: "center", }}>
                                    <Text style={{ color: "#fff" }}>Delete</Text>
                                    <TouchableOpacity
                                        onPress={() => this.props.delBtnClick()}
                                        style={{ backgroundColor: "red", borderRadius: scale(20), }}>
                                        <MIcon name="close" size={scale(18)} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                {/* <View style={{ flexDirection: "column", flex: 1, alignItems: "center", }}>
                                    <Text style={{ color: "#fff" }}>Edit</Text>
                                    <TouchableOpacity
                                        onPress={() => this.props.editBtnClick()}
                                        style={{ backgroundColor: "#00BFFF", borderRadius: scale(20), height: scale(19), width: scale(19), alignItems: "center", justifyContent: "center" }}>
                                        <MIcon name="edit" size={scale(15)} color="#fff" />
                                    </TouchableOpacity>
                                </View> */}
                                <View style={{ flexDirection: "column", flex: 1, alignItems: "center", }}>
                                    <Text style={{ color: "#fff" }}>Done</Text>
                                    <TouchableOpacity
                                        onPress={() => this.props.doneBtnClick()}
                                        style={{ backgroundColor: "#27ae60", borderRadius: scale(20) }}>
                                        <MIcon name="done" size={scale(18)} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                }




            </View>
        )
    }
}
let styles = StyleSheet.create({

})