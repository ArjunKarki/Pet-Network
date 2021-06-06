import React, { Component } from 'react'
import { View, Text, ImageBackground, TextInput, ScrollView } from 'react-native'
import { RkButton } from 'react-native-ui-kitten'
import FIcon from 'react-native-vector-icons/FontAwesome';
import { scale } from '../../utils/scale';
export class PetMedication extends Component {

    constructor(props) {
        super(props)
        this.state = {
            medicationName: ""
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Medication',
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerTintColor: '#ECC951',
        headerStyle: {
            backgroundColor: '#191e1f'
        },
        headerLeft: (
            <RkButton
                rkType='clear'
                contentStyle={{ color: '#ECC951' }}
                style={{ width: 40, marginLeft: 8 }}
                onPress={() => navigation.goBack(null)}>
                <FIcon name="arrow-left" size={17} color='#ECC951' />
            </RkButton>
        )
    })

    render() {
        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginHorizontal: scale(10), borderWidth: scale(1), borderColor: "#ECC951", borderRadius: 10, padding: scale(10) }}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={{ color: "#fff", fontSize: scale(17) }}>Medication Name</Text>
                            <TextInput
                                placeholder="Enter Medication Name"
                                placeholderTextColor="grey"
                                style={{ color: "#fff" }}
                                onChangeText={(text) => this.setState({ medicationName: text })}
                            />
                        </View>
                        <View style={{ height: 1, backgroundColor: "#ECC951",marginVertical:scale(5) }} />
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: "#fff", fontSize: scale(17) }}>Start Date</Text>
                        </View>
                    </View>
                    <View></View>
                </ScrollView>
            </ImageBackground>
        )
    }
}