import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import { scale } from '../utils/scale';
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import { RkButton, RkText } from 'react-native-ui-kitten'
import { formatDate, checkResponse } from '../utils/commonService';
import { baseUrl } from '../utils/globle';

export class CreateActivity extends Component {

    render() {

        let { date, caredType, note, onInputChange, disibleView } = this.props
        return (
            <View pointerEvents={disibleView}>
                <View style={styles.container}>
                    <View style={{ padding: scale(10) }}>
                        <Text style={styles.title}>Date</Text>
                        <TouchableOpacity
                            onPress={() => { this.props.showDateTimeModal() }}
                            style={{ marginTop: scale(10) }}>
                            <Text style={{ color: "#fff", fontSize: scale(18), marginLeft: scale(5) }}>{formatDate(date)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.underLine} />
                    <View style={{ padding: scale(10) }}>
                        <Text style={styles.title}>Cared </Text>
                        <RadioGroup
                            onSelect={(index, value) => this.props.onCareSelect(index, value)}
                            selectedIndex={caredType == "home" ? 0 : 1}
                            color='#ECC951'
                            size={22}
                        >
                            <RadioButton value={'home'} >
                                <Text style={{ color: "#fff", marginLeft: scale(5) }}>At home</Text>
                            </RadioButton>
                            <RadioButton value={'professional'}>
                                <Text style={{ color: "#fff", marginLeft: scale(5) }}>By a professional</Text>
                            </RadioButton>
                        </RadioGroup>
                    </View>
                    <View style={styles.underLine} />
                    <View style={{ padding: scale(10) }}>
                        <Text style={styles.title}>Notes</Text>
                        <TextInput
                            placeholder="Enter Note..."
                            placeholderTextColor="grey"
                            multiline={true}
                            value={note}
                            onChangeText={(input) => onInputChange(input)}
                            style={{ color: '#ffffff' }}
                        />
                    </View>
                    

                </View>
                {/* {
                    visibleSaveCancleBtn ?
                        <View style={{ flexDirection: 'row', padding: 10, marginTop: scale(20), borderWidth: scale(1), borderColor: "#ECC951", marginHorizontal: scale(10), borderRadius: scale(10) }}>
                            <RkButton onPress={() => this.props.onCancleBtnlick()} style={styles.btnStyle}>
                                <RkText style={styles.txtStyle}>Cancel</RkText>
                            </RkButton>
                            <RkButton onPress={() => this.props.onSaveBtnClick()} style={styles.btnStyle}>
                                {
                                    loading ? <ActivityIndicator size="small" color='#FFEB3B' />
                                        :
                                        <RkText style={styles.txtStyle}>Save</RkText>
                                }
                            </RkButton>
                        </View>
                        :
                        null
                } */}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        width: 120,
        height: 40,
        borderWidth: 1,
        borderColor: '#ECC951',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 25,
        marginVertical: 5,
        backgroundColor: 'rgba(25, 30, 31,0.5)'
    },
    txtStyle: {
        color: '#ffffff',
        fontSize: 22,
        marginLeft: 3,
        marginVertical: 5,
        marginBottom: 10
    },
    container: {
        marginHorizontal: scale(10),
        borderColor: "#ECC951",
        borderWidth: 1,
        marginTop: scale(15),
        borderRadius: scale(15)
    },
    underLine: {
        marginHorizontal: scale(12),
        height: scale(1),
        backgroundColor: "#ECC951"
    },
    title: {
        color: "#fff",
        fontSize: scale(20)
    }
})