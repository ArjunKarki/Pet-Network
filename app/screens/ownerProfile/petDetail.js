import React, { Component } from 'react';
import Image from 'react-native-image-progress';
import { View, ScrollView, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { RkCard, RkText, RkButton } from 'react-native-ui-kitten';
import { scale } from '../../utils/scale';
import Icons from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/Ionicons';
import { petProPicUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import PhotoView from "@merryjs/photo-viewer";

class PetDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            petInfo: props.navigation.state.params.petInfo,
            photoModalVisible: false,
        };
        console.log("Pet Detail", this.state.petInfo)
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Pet Detail',
        headerStyle: {
            backgroundColor: '#191e1f',
        },
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerLeft: (
            <RkButton
                rkType='clear'
                contentStyle={{ color: '#ECC951' }}
                style={{ width: 40, marginLeft: 8 }}
                onPress={() => { navigation.goBack() }}>
                <RkText rkType='awesome' ><Icons name='arrow-back' style={{ fontSize: 25 }} /></RkText>
            </RkButton>
        ),
        headerRight: (
            <View>
                {
                    LoggedUserCredentials.getOwnerId() === navigation.state.params.petInfo.ownerId ?
                        <RkButton
                            rkType='clear'
                            contentStyle={{ color: '#ECC951' }}
                            style={{ width: 40, marginLeft: 8 }}
                            onPress={() => { navigation.state.params.goToEditPetInfo() }}>

                            <RkText rkType='awesome' ><Icons name='edit' style={{ fontSize: 25, marginRight: scale(10) }} /></RkText>
                        </RkButton>
                        :
                        null
                }

            </View>
        )
    });

    goToEditPetInfo() {
        this.props.navigation.navigate("EditPetInfo", { "petInfo": this.state.petInfo });
    }

    componentDidMount() {
        this.props.navigation.setParams({ goToEditPetInfo: () => { this.goToEditPetInfo() } })
    }

    showVaccinationInfo() {
        let { petInfo } = this.state
        this.props.navigation.navigate("PetVaccination", { "PetId": petInfo.id, "PetName": petInfo.petName });
    }

    goToPetProfile() {
        //this.props.navigation.navigate("ProfilePet", { "petInfo": this.state.petInfo })
        let { navigation } = this.props;
        navigation.navigate("PetProfile",
            {
                "petId": this.state.petInfo.petId,
                "refreshOwnerProfile": navigation.state.params.refreshOwnerProfile,
                //(ownerId) => { navigation.state.params.refreshOwnerProfile(ownerId) },
                "refreshPetList": navigation.state.params.refreshPetList,
                //(ownerId) => { navigation.state.params.refreshPetList(ownerId) },
            }
        )
    }

    render() {
        let { petInfo } = this.state;
        let mediaPath = petProPicUrl + "/" + petInfo.petProPic
        let photo = [{
            source: {
                uri:
                    mediaPath
            }
        }]

        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} style={{ backgroundColor: 'rgba(25, 30, 31,0.5)' }}>
                    {/* {
                    LoggedUserCredentials.getOwnerId()===petInfo.ownerId ?
                    <View style={{ alignItems: 'flex-end' }}>
                        <RkButton
                            rkType='clear'
                            contentStyle={{ color: '#ECC951', }}
                            style={{ width: 50, marginTop: scale(5) }}
                            onPress={() => { this.goToEditPetInfo() }}>
                            <RkText rkType='awesome' ><Icons name='edit' style={{ fontSize: 25 }} /></RkText>
                        </RkButton>
                    </View>
                    :
                    <View></View>
                } */}

                    <TouchableOpacity
                        onPress={() => { this.setState({ photoModalVisible: true }) }}
                        style={{ justifyContent: 'center', alignItems: 'center', marginTop: scale(15) }}>
                        <Image
                            source={{ uri: mediaPath }}
                            style={styles.petProPicStyle}
                            indicatorProps={{
                                size: 40,
                                color: '#ECC951',
                            }}
                        />
                    </TouchableOpacity>

                    <View style={{ marginHorizontal: scale(15), flexDirection: 'row', justifyContent: 'space-between', marginVertical: scale(10) }}>
                        <View style={{ flexDirection: 'row' }}>
                            {/* <Icon name='md-person' style={{ fontSize: scale(18), alignSelf: 'center', color: '#ECC951' }} /> */}
                            <TouchableOpacity
                                style={{ overflow: "hidden", alignSelf: "center" }}
                                onPress={() => { this.goToPetProfile() }}
                            >
                                <Image
                                    source={{ uri: mediaPath }}
                                    style={{ width: scale(35), height: scale(35), borderRadius: scale(30), borderWidth: 1, borderColor: '#ECC951', overflow: 'hidden' }}
                                    indicatorProps={{
                                        size: 15,
                                        color: '#ECC951',
                                    }}
                                />
                            </TouchableOpacity>

                            <RkText style={{ marginLeft: 10, alignSelf: 'center', color: '#ffffff' }}>{petInfo.petName}</RkText>
                        </View>

                        {
                            LoggedUserCredentials.getOwnerId() === petInfo.ownerId ?
                                <View>
                                    <RkButton style={{ width: scale(140), borderWidth: 2, borderColor: '#ECC951', backgroundColor: 'rgba(25, 30, 31,0.5)' }} onPress={() => this.showVaccinationInfo()}><RkText style={{ color: '#ECC951', fontSize: 15 }}>Pet Vaccination</RkText></RkButton>
                                </View>
                                :
                                null
                        }
                    </View>
                    <RkCard rkCardContent style={{ marginHorizontal: scale(10), marginBottom: scale(20), borderColor: '#ECC951', borderWidth: 2, backgroundColor: 'rgba(25, 30, 31,0.5)' }}>
                        <View style={{ flexDirection: 'row', marginBottom: scale(10), flex: 3 }}>
                            <RkText style={styles.txtLabelStyle}>Name</RkText>
                            <RkText style={{ flex: 0.04, color: '#ffffff' }}>:</RkText>
                            <RkText style={styles.txtValueStyle}>{petInfo.petName}</RkText>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: scale(10), flex: 3 }}>
                            <RkText style={styles.txtLabelStyle}>BirthDate</RkText>
                            <RkText style={{ flex: 0.04, color: '#ffffff' }}>:</RkText>
                            <RkText style={styles.txtValueStyle}>{petInfo.petDob}</RkText>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: scale(10), flex: 3 }}>
                            <RkText style={styles.txtLabelStyle}>Pet Daddy</RkText>
                            <RkText style={{ flex: 0.04, color: '#ffffff' }}>:</RkText>
                            <RkText style={styles.txtValueStyle}>{petInfo.petDaddyName}</RkText>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: scale(10), flex: 3 }}>
                            <RkText style={styles.txtLabelStyle}>Pet Mommy</RkText>
                            <RkText style={{ flex: 0.04, color: '#ffffff' }}>:</RkText>
                            <RkText style={styles.txtValueStyle}>{petInfo.petMommyName}</RkText>
                        </View>
                        {
                            petInfo.petReward === "" ?
                                <View></View>
                                :
                                <View style={{ flexDirection: 'row', marginBottom: scale(10), flex: 3 }}>
                                    <RkText style={styles.txtLabelStyle}>Pet Reward</RkText>
                                    <RkText style={{ flex: 0.04, color: '#ffffff' }}>:</RkText>
                                    <RkText style={styles.txtValueStyle}>{petInfo.petReward}</RkText>
                                </View>

                        }

                        {
                            petInfo.petWeight === "" ?
                                <View></View>
                                :
                                <View style={{ flexDirection: 'row', marginBottom: scale(10), flex: 3 }}>
                                    <RkText style={styles.txtLabelStyle}>Weight</RkText>
                                    <RkText style={{ flex: 0.04, color: '#ffffff' }}>:</RkText>
                                    <RkText style={styles.txtValueStyle}>{petInfo.petWeight}  (lbs)</RkText>
                                </View>
                        }

                        <View style={{ flexDirection: 'row', marginBottom: scale(10), flex: 3 }}>
                            <RkText style={styles.txtLabelStyle}>Gender</RkText>
                            <RkText style={{ flex: 0.04, color: '#ffffff' }}>:</RkText>
                            <RkText style={styles.txtValueStyle}>{petInfo.petGender}</RkText>
                        </View>
                        {
                            petInfo.petDescription === "" ?
                                <View></View>
                                :
                                <View style={{ flexDirection: 'row', marginBottom: scale(10), flex: 3 }}>
                                    <RkText style={styles.txtLabelStyle}>Description</RkText>
                                    <RkText style={{ flex: 0.04, color: '#ffffff' }}>:</RkText>
                                    <RkText style={styles.txtValueStyle}>{petInfo.petDescription}</RkText>
                                </View>
                        }

                    </RkCard>
                    <PhotoView
                        visible={this.state.photoModalVisible}
                        data={photo}
                        hideStatusBar={true}
                        initial={0}
                        hideCloseButton={true}
                        hideShareButton={true}
                        onDismiss={e => {
                            this.setState({ photoModalVisible: false });
                        }}
                    />
                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    txtLabelStyle: {
        flex: 1.1,
        color: '#ffffff',
        fontSize: scale(16)
    },
    txtValueStyle: {
        marginLeft: scale(30),
        flex: 1.86,
        color: '#ffffff',
        fontSize: scale(16)
    },
    petProPicStyle: {
        width: scale(250),
        height: scale(250),
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#ECC951',
        overflow: 'hidden'
    }
})

export { PetDetail };