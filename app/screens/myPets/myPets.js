import React, { Component } from 'react'
import Image from 'react-native-image-progress';

import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    ImageBackground
} from 'react-native'
import {
    RkText,
    RkButton
} from 'react-native-ui-kitten';

import Icons from 'react-native-vector-icons/Foundation';
import FIcon from 'react-native-vector-icons/FontAwesome';

import { scale } from '../../utils/scale';
import { petListUrl, petProPicUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class MyPets extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'My Pets',
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

    constructor(props) {
        super(props)
        this.state = {
            petName: '',
            petType: '',
            petWeight: '',
            resource: [],
            loading: false,
            refreshing: false,
        }

    }

    componentDidMount() {
        this.getAllPets();
    }

    async getAllPets() {
        this.setState({ loading: true });
        let { ownerId } = this.state;

        const path = petListUrl + '/' + LoggedUserCredentials.getOwnerId();

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }
        const res = await fetch(path, config);
        const resJson = await res.json();
        console.log("MyPet", resJson);
        this.setState({ resource: resJson, loading: false })
    }

    render() {
        let { resource, loading, } = this.state

        if (loading) {
            return (
                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(25, 30, 31,0.5)', flex: 1 }}>
                    <ActivityIndicator size="large" color='#FFEB3B' />
                </View>
            )
        }

        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                <ScrollView style={{ backgroundColor: 'rgba(25, 30, 31,0.5)' }}>
                    {
                        resource.length === 0 ?
                            <View style={{ alignItems: 'center', marginTop: scale(20) }}>
                                <RkText style={{ fontSize: 25, color: '#ECC951' }}>
                                    No Pet Yet!
                         </RkText>
                            </View>
                            :
                            <FlatList
                                data={resource}
                                renderItem={(pet) => {
                                    return (
                                        <TouchableOpacity activeOpacity={0.6} >
                                            <View style={styles.eachRow}>
                                                <Image source={{ uri: petProPicUrl + "/" + pet.item.petProPic }}
                                                    indicatorProps={{
                                                        color: '#ECC951',
                                                    }}
                                                    style={styles.imgBackground} />
                                                <View>
                                                    <Text style={{ color: '#ffffff', fontStyle: 'italic', marginLeft: 5, fontSize: 18 }}>{pet.item.petName}</Text>
                                                    <View style={{ width: 120, borderTopWidth: 2, borderTopColor: '#ECC951', marginVertical: 5 }} />
                                                    <Text style={{ color: 'grey', fontStyle: 'italic', fontSize: 16 }}>{pet.item.petType}</Text>
                                                </View>
                                                {
                                                    pet.item.petGender == 'Male' ?
                                                        <Icons name='male-symbol' style={styles.iconStyle} />
                                                        :
                                                        <Icons name='female-symbol' style={styles.iconStyle} />
                                                }
                                            </View>
                                        </TouchableOpacity >
                                    )
                                }}
                            />
                    }
                </ScrollView>
            </ImageBackground>
        )
    }
}


const styles = StyleSheet.create({
    addBtn: {
        backgroundColor: 'rgba(25, 30, 31,0.5)',
        borderWidth: 1,
        borderColor: '#ECC951'
    },
    eachRow: {
        margin: 10,
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 10,
        alignItems: 'center',
        padding: 5,
        flexDirection: 'row',
        backgroundColor: 'rgba(25, 30, 31,0.6)'
    },
    imgBackground: {
        borderColor: '#ECC951',
        borderWidth: 2,
        borderRadius: 50,
        width: 100,
        height: 100,
        overflow: 'hidden',
        margin: 5,
        marginRight: 10
    },
    iconStyle: {
        color: '#ECC951',
        fontSize: 30,
        alignSelf: 'flex-end',
        marginHorizontal: 15,
        marginTop: 5,
        position: 'absolute',
        top: 1,
        right: 1
    }
})