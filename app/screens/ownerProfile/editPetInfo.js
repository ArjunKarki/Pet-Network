import React, { Component } from 'react';
import Icons from 'react-native-vector-icons/MaterialIcons'
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    TextInput,
    ImageBackground,
    ActivityIndicator,
    Modal,
    Dimensions

} from 'react-native';

import {
    RkCard,
    RkText,
    RkButton,
} from 'react-native-ui-kitten';

const { height } = Dimensions.get('window');
import ImagePicker from 'react-native-image-crop-picker';
import { scale } from '../../utils/scale';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { petProPicUrl, petListUrl, updatePetInfoWithoutProPicUrl, updatePetInfoWithProPicUrl } from '../../utils/globle';

export class EditPetInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petInfo: props.navigation.state.params.petInfo,
            petProPic: null,
            petDaddyName: '',
            petMommyName: '',
            petReward: '',
            petName: '',
            petDaddyId: '',
            petMommyId: '',
            petWeight: '',
            petDescription: '',
            petsList: [],
            petsLoading: false,
            loading: false,
            disEditBtn: false,
            petDaddyModalVisible: false,
            petMommyModalVisible: false,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Edit Pet Info',
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
        )
    });

    async pickImage() {
        let images = null
        try {
            images = await ImagePicker.openPicker({ multiple: false, cropping: true });
            this.setState({ petProPic: images });
        } catch (e) {
            console.log(e)
        }
    }

    componentDidMount() {
        let { petInfo } = this.state;
        this.fetchPets();

        this.setState({
            petName: petInfo.petName,
            petReward: petInfo.petReward,
            petWeight: petInfo.petWeight,
            petDescription: petInfo.petDescription,
            petDaddyName: petInfo.petDaddyName,
            petMommyName: petInfo.petMommyName,
            petDaddyId: petInfo.petDaddyId,
            petMommyId: petInfo.petMommyId
        })
    }

    async fetchPets() {
        this.setState({ petsLoading: true, });
        const url = petListUrl + '/' + LoggedUserCredentials.getOwnerId();
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }
        const res = await fetch(url, config);
        const resJson = await res.json();
        this.setState({
            petsList: resJson,
            petsLoading: false
        });
    }

    renderImg() {

        let {
            petProPic,
            petInfo
        } = this.state
        if (petProPic === null) {
            return (
                <Image
                    indicatorProps={{ color: '#ECC951' }}
                    style={styles.imgStyle}
                    source={{ uri: petProPicUrl + "/" + petInfo.petProPic }}
                />
            )
        }
        return <Image style={{ width: scale(170), height: scale(170) }} source={{ uri: petProPic.path }} />
    }

    renderPetDaddyPicker() {
        const { petsList } = this.state;
        let tempPetsList = []

        tempPetsList = petsList.map((pet) => {
            return (
                <View>
                    <TouchableOpacity
                        key={pet.petId}
                        onPress={() => this.setState({ petDaddyName: pet.petName, petDaddyId: pet.petId, petDaddyModalVisible: false })}
                        style={[styles.wrapperText, { alignItems: 'center' }]} >
                        <Text style={styles.textStyle}>{pet.petName}</Text>
                    </TouchableOpacity >
                    <View style={styles.spacer} />
                </View>
            )
        })

        tempPetsList.push(
            <View>
                <View style={styles.spacer} />
                <TouchableOpacity
                    onPress={() => this.setState({ petDaddyName: "Not Known", petDaddyId: "", petDaddyModalVisible: false })}
                    style={[styles.wrapperText, { alignItems: 'center' }]} >
                    <Text style={styles.textStyle}>Not Known</Text>
                </TouchableOpacity >
            </View>
        )

        if (petsList.length != 0) {
            return (
                <View style={[styles.modalStyle, { height: height - 150 }]}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 20 }}>Select Pet</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {tempPetsList}
                    </ScrollView>
                </View>
            )
        } else
            return (
                <View style={[styles.modalStyle, { height: height - 150, justifyContent: 'center' }]}>
                    <Text style={{ color: '#ECC951', fontSize: 18 }}>There is no pet to select !</Text>
                </View>
            )
    }

    renderPetMommyPicker() {
        const { petsList } = this.state;
        let tempPetsList = [];
        tempPetsList = petsList.map(pet => {
            return (
                <View>
                    <TouchableOpacity
                        key={pet.petId}
                        onPress={() => this.setState({ petMommyName: pet.petName, petMommyId: pet.petId, petMommyModalVisible: false })}
                        style={[styles.wrapperText, { alignItems: 'center' }]} >
                        <Text style={styles.textStyle}>{pet.petName}</Text>
                    </TouchableOpacity >
                    <View style={styles.spacer} />
                </View>
            )
        })
        tempPetsList.push(
            <View>
                <View style={styles.spacer} />
                <TouchableOpacity
                    onPress={() => this.setState({ petMommyName: "Not Known", petMommyId: "", petMommyModalVisible: false })}
                    style={[styles.wrapperText, { alignItems: 'center' }]} >
                    <Text style={styles.textStyle}>Not Known</Text>
                </TouchableOpacity >
            </View>
        )

        if (petsList.length != 0) {
            return (
                <View style={[styles.modalStyle, { height: height - 150 }]}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 20 }}>Select Pet</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {tempPetsList}
                    </ScrollView>
                </View>
            )
        } else
            return (
                <View style={[styles.modalStyle, { height: height - 150, justifyContent: 'center' }]}>
                    <Text style={{ color: '#ECC951', fontSize: 18 }}>There is no pet to select !</Text>
                </View>
            )
    }

    render() {
        let {
            petName,
            petWeight,
            petDescription,
            loading,
            disEditBtn,
            petDaddyName,
            petMommyName,
            petReward,
            petDaddyModalVisible,
            petMommyModalVisible,
            petsLoading
        } = this.state


        if (petsLoading) {
            return (
                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(25, 30, 31,0.5)', flex: 1 }}>
                    <ActivityIndicator size="large" color='#FFEB3B' />
                </View>
            )
        } else {
            return (
                <ImageBackground
                    style={styles.imgBack}
                    source={require('../../assets/images/background.jpg')}
                >
                    <ScrollView showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps='always'>
                        <View style={[styles.imgContainer, { marginVertical: scale(15) }]}>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => { this.pickImage() }}
                            >
                                <View style={styles.centerItem} >
                                    {this.renderImg()}
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.petInfoContainer}>
                            <RkCard
                                rkCardContent
                                style={{ backgroundColor: 'rgba(25, 30, 31,0.5)' }}
                            >
                                <View style={styles.eachItem}>
                                    <RkText style={styles.commonTxt}>Pet Name</RkText>
                                    <TextInput placeholder='Pet Name'
                                        placeholderTextColor='#ffffff'
                                        underlineColorAndroid='transparent'
                                        onChangeText={(input) => this.setState({ petName: input })}
                                        value={petName}
                                        style={{ flex: 3, color: '#ffffff' }} />
                                </View>
                                <View style={styles.border}></View>
                                <View style={styles.eachItem}>
                                    <RkText style={styles.commonTxt}>Pet Reward</RkText>
                                    <TextInput placeholder='Pet Reward'
                                        placeholderTextColor='#ffffff'
                                        underlineColorAndroid='transparent'
                                        onChangeText={(input) => this.setState({ petReward: input })}
                                        value={petReward}
                                        style={{ flex: 3, color: '#ffffff' }} />
                                </View>
                                <View style={styles.border}></View>
                                <View style={[styles.eachItem, { marginVertical: scale(10) }]}>
                                    <RkText style={styles.commonTxt}>Pet Daddy</RkText>
                                    <TouchableOpacity style={{ flex: 3 }} onPress={() => { this.setState({ petDaddyModalVisible: true }) }}>
                                        <RkText style={{ color: '#ffffff', fontSize: scale(13) }} >{petDaddyName}</RkText>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.border}></View>
                                <View style={[styles.eachItem, { marginVertical: scale(10) }]}>
                                    <RkText style={styles.commonTxt}>Pet Mommy</RkText>
                                    <TouchableOpacity style={{ flex: 3, color: '#ffffff' }} onPress={() => { this.setState({ petMommyModalVisible: true }) }}>
                                        <RkText style={{ color: '#ffffff', fontSize: scale(13) }}>{petMommyName}</RkText>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.border}></View>
                                <View style={styles.eachItem}>
                                    <RkText style={styles.commonTxt} >Pet Weight</RkText>

                                    <TextInput placeholder='Pet Weight (In Lbs)'
                                        placeholderTextColor='#ffffff'
                                        keyboardType="numeric"
                                        underlineColorAndroid='transparent'
                                        onChangeText={(input) => { this.setState({ petWeight: input }) }}
                                        value={petWeight}
                                        style={{ flex: 3, color: '#ffffff' }} />
                                </View>
                            </RkCard>
                        </View>
                        <View style={{ marginHorizontal: 15, marginTop: scale(15) }}>
                            <RkCard rkCardContent style={{ backgroundColor: 'rgba(25, 30, 31,0.5)', borderColor: '#ECC951' }}>
                                <TextInput placeholder="Give a descriptions about your pet"
                                    multiline={true}
                                    value={petDescription}
                                    numberOfLines={4}
                                    placeholderTextColor="#ffffff"
                                    underlineColorAndroid='transparent'
                                    onChangeText={(input) => { this.setState({ petDescription: input }) }}
                                    style={{ textAlignVertical: 'top', color: '#ffffff' }}
                                />
                            </RkCard>
                        </View>
                        <View style={styles.btnContainer}>
                            <RkButton
                                disabled={disEditBtn}
                                rkType='stretch'
                                style={styles.addbtn}
                                onPress={() => this.EditBtnClick()}
                            >
                                {
                                    loading ? <ActivityIndicator size="small" color='#FFEB3B'></ActivityIndicator>
                                        : <RkText style={{ color: '#ECC951', fontSize: scale(19) }}>EDIT</RkText>
                                }

                            </RkButton>
                        </View>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={petDaddyModalVisible}
                            onRequestClose={() => this.setState({ petDaddyModalVisible: false })}>
                            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                                {this.renderPetDaddyPicker()}
                            </View>
                        </Modal>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={petMommyModalVisible}
                            onRequestClose={() => this.setState({ petMommyModalVisible: false })}>
                            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                                {this.renderPetMommyPicker()}
                            </View>

                        </Modal>

                    </ScrollView>

                </ImageBackground>
            )

        }

    }

    async EditBtnClick() {
        this.setState({ loading: true, disEditBtn: true })
        let {
            petProPic,
            petName,
            petReward,
            petDaddyName,
            petMommyName,
            petDaddyId,
            petMommyId,
            petWeight,
            petDescription,
            petInfo
        } = this.state;
        let temDaddyName = petDaddyName === "Select pet Daddy" ? 'Not Known' : petDaddyName
        let temMommyName = petMommyName === "Select pet Mommy" ? 'Not Known' : petMommyName

        let editedData = new FormData();
        let path, config

        let petEditedInfo = {
            "petName": petName,
            "petReward": petReward,
            "petDaddyName": temDaddyName,
            "petMommyName": temMommyName,
            "petDaddyId": petDaddyId,
            "petMommyId": petMommyId,
            "petWeight": petWeight,
            "petDescription": petDescription
        }
        console.log("Send Data", petEditedInfo);

        editedData.append('editedInfo', JSON.stringify(petEditedInfo))
        editedData.append('petId', petInfo.petId)

        if (petProPic === null) {
            path = updatePetInfoWithoutProPicUrl;
            config = {
                headers: {
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
                },
                method: 'POST',
                body: editedData
            }
        } else {
            path = updatePetInfoWithProPicUrl;

            editedData.append("editedPetProPic", {
                uri: petProPic.path,
                type: petProPic.mime,
                name: "editedPetPhoto" + '.' + petProPic.mime.split('/')[1]
            })
            config = {
                headers: {
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                    'Content-Type': 'multipart/mixed',
                },
                method: 'POST',
                body: editedData
            }
        }

        let res = await fetch(path, config);
        let resJson = await res.json();
        if (resJson === "OK") {
            this.setState({ loading: false, disEditBtn: false })
            this.props.navigation.goBack();
        } else if (resJson === "NOT_OK") {
            this.setState({ loading: false, disEditBtn: false });
        } else {
            alert("Something went wrong!");
        }


    }
}

const styles = StyleSheet.create({
    imgBack: {
        flex: 1,
        width: null,
        height: null
    },
    imgContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgStyle: {
        width: scale(170),
        height: scale(170),
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ECC951',
        overflow: 'hidden'
    },
    centerItem: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    petInfoContainer: {
        marginHorizontal: scale(15),
        borderWidth: 1,
        borderColor: '#ECC951'
    },
    eachItem: {
        flex: 1,
        flexDirection: 'row',
    },
    commonTxt: {
        flex: 2,
        alignSelf: 'center',
        fontSize: scale(15),
        color: '#ffffff'
    },
    btnContainer: {
        marginHorizontal: scale(15),
        marginVertical: scale(15),
    },
    textStyle: {
        color: '#fff',
        fontSize: 18,
        margin: 5
    },
    wrapperText: {
        padding: 5,
        marginVertical: 5
    },
    spacer: {
        height: 1,
        backgroundColor: '#FFEB3B',
        width: 200
    },

    addbtn: {
        backgroundColor: 'rgba(25, 30, 31,0.5)',
        height: scale(55),
        borderWidth: 1,
        borderColor: '#ECC951'
    },
    border: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ECC951'
    },
    modalStyle: {
        backgroundColor: '#242124',
        minWidth: 300,
        borderWidth: 2,
        borderRadius: 3,
        borderColor: '#FFEB3B',
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
