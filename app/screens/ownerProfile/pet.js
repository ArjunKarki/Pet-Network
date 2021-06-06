import React, { Component } from 'react'
import Image from 'react-native-image-progress';
import PhotoView from "@merryjs/photo-viewer";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator
} from 'react-native'
import {
    RkButton,
    RkText,
} from 'react-native-ui-kitten';
import Icons from 'react-native-vector-icons/Foundation';
import { scale } from '../../utils/scale';
import { petListUrl, petProPicUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class Pet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            petName: '',
            petType: '',
            petWeight: '',
            resource: [],
            loading: false,
            refreshing: false,
            ownerId: this.props.ownerId,
            loggedOwnerId: this.props.loggedOwnerId
        }
    }

    componentDidMount() {
        let { ownerId } = this.state
        this.getAllPets(ownerId);
    }

    async getAllPets(ownerId) {
        this.setState({ loading: true, ownerId: ownerId });

        const path = petListUrl + '/' + ownerId;

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }
        try {
            const res = await fetch(path, config);

            if (res.status == 200) {
                const resJson = await res.json();
          
                this.setState({ resource: resJson.pets, loading: false })
            } else {
                this.setState({ loading: false, resource: [] })
            }

        } catch (error) {
            console.log(error);
            alert("Something wrong")
        }

    }

    render() {
        let { resource, loading, ownerId } = this.state

        if (loading) {
            return (
                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(25, 30, 31,0.5)', flex: 1 }}>
                    <ActivityIndicator size={40} color='#FFEB3B' />
                </View>
            )
        }

        return (
            <View style={{ backgroundColor: 'rgba(25, 30, 31,0.5)' }}>
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
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => this.props.goToPetProfile(pet.item._id)}>
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

                {
                    LoggedUserCredentials.getOwnerId() === ownerId ?
                        <View style={{ marginHorizontal: scale(10), marginVertical: scale(10) }}>
                            <RkButton rkType='stretch' style={styles.addBtn} onPress={() => this.props.addPet(resource)}>
                                <RkText style={{ color: '#ECC951' }}>ADD PET</RkText>
                            </RkButton>
                        </View>
                        :
                        null
                }

            </View>
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

// <RkCard style={{ marginHorizontal: 10, marginVertical: 10 }}>
// <View style={{ flexDirection: 'row', marginVertical: 5 }}>


//     <Image style={styles.imgStyle} source={{ uri: petProPicUrl + "/" + pet.item.petProPic }} />
//     <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
//         <RkText>{pet.item.petName}</RkText>
//         <RkText>{pet.item.petType}</RkText>
//         <RkText>{pet.item.petGender}</RkText>
//     </View>
// </View>
// </RkCard>

