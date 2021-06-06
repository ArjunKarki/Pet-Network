import React, { Component } from 'react'
import { Text, View, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native'
import { scale } from '../utils/scale';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FIcon from 'react-native-vector-icons/Feather'
import { formatDate } from '../utils/commonService';

export class ActivityRecord extends Component {

    constructor(props) {
        super(props)
    }

    showAlert = (item, index) => {
        console.log(item)
        Alert.alert(
            'Please Verify!',
            'Sure to delete ' + formatDate(item.date) + " ?",
            [
                { 
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.props.onDeleteRecord(item, index) },
            ],
            { cancelable: false },
        );
    }

    render() {

        return (
            <View style={{ marginTop: scale(15) }}>
                <Text style={{ color: "#fff", fontSize: scale(20), marginLeft: scale(5) }}>Previous Records</Text>
                <View style={{ height: scale(1), backgroundColor: "#ECC951", width: scale(160) }} />
                {
                    this.props.data.length == 0 ?
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: scale(40) }}>
                            <Text style={styles.txtStyle}>No Entries Found!</Text>
                            <Text style={styles.txtStyle}>To add an entry use "+"</Text>
                            <Text style={styles.txtStyle}>add the bottom of the screen</Text>
                        </View>
                        :
                        <FlatList
                            data={this.props.data}
                            style={{ marginTop: scale(10) }}
                            renderItem={({ item, index }) =>
                                <View style={{ flexDirection: "row", flex: 1, height: scale(50), alignItems: "center" }}>
                                    <TouchableOpacity
                                        onLongPress={() => this.showAlert(item, index)}
                                        onPress={() => this.props.onEachRecordPress(item)}
                                        style={{ flexDirection: "row" }} >
                                        {
                                            item.caredBy == "home" ?
                                                <View style={{ flex: 1 }}>
                                                    <Image source={require("../assets/icons/home.png")} style={{ width: scale(30), height: scale(30) }} />
                                                </View>
                                                :
                                                <View style={{ flex: 1 }}>
                                                    <Image source={require("../assets/icons/doctor.png")} style={{ width: scale(30), height: scale(30) }} />
                                                </View>
                                        }
                                        <Text style={{ flex: 4, color: "#fff", fontSize: scale(15), marginTop: scale(5) }}>{formatDate(item.cutDate)}</Text>
                                    </TouchableOpacity >
                                    {/* <TouchableOpacity 
                                    onLongPress={()=>alert("hey")}
                                    //onPress={() => this.props.onDeleteRecord(item, index)}
                                     >
                                        <MIcon name="delete" size={scale(20)} color="#ECC951" />
                                    </TouchableOpacity> */}
                                </View>

                            }
                        />
                }


            </View>
        )
    }
}

let styles = StyleSheet.create({
    txtStyle: {
        color: "#ECC951",
        fontSize: scale(20)
    },

})