import React, { Component } from 'react';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'

import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    TextInput,
    Picker,
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

import DatePicker from 'react-native-datepicker'
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import { scale } from '../../utils/scale';
import { addPetUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

let today = new Date();
const { height } = Dimensions.get('window');

export class AddPet extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Add Pet',
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerTintColor: '#ECC951',
        headerStyle: {
            backgroundColor: '#191e1f'
        }
    });

    constructor(props) {
        super(props);
        this.state = {
            ownerId: props.navigation.state.params.ownerId,
            petListInfo: props.navigation.state.params.petInfo,
            petProPic: null,
            petType: "cat",
            petDaddyName: 'Select pet Daddy',
            petMommyName: 'Select pet Mommy',
            petReward: '',
            petName: '',
            date: "01-01-2000",
            gender: "Male",
            petDaddyId: '',
            petMommyId: '',
            petWeight: '',
            petDescription: '',
            petAddress: '',
            loading: false,
            disAddPetBtn: false,
            petDaddyModalVisible: false,
            petMommyModalVisible: false
        }
    }

    async pickImage() {
        let images = null
        try {
            images = await ImagePicker.openPicker({ multiple: false,mediaType: "photo" });
            this.setState({ petProPic: images });
        } catch (e) {
            console.log(e)
        }
    }

    renderImg() {
        let { petProPic } = this.state;
        if (petProPic === null) {
            return (
                <RkCard rkCardContent style={[styles.centerItem, styles.imgStyle]}>
                    <Icon name='md-photos' style={{ fontSize: scale(50), color: '#ECC951' }}></Icon>
                    <Text style={{ color: '#ffffff' }}>Add pet profile</Text>
                </RkCard>
            )
        }
        return <Image style={{ width: scale(170), height: scale(170), borderRadius: scale(20), borderColor: '#ECC951', borderWidth: 1 }} source={{ uri: petProPic.path }} />
    }

    renderPetDaddyPicker() {
        const { petListInfo } = this.state;
        let tempPetsList = [];
        tempPetsList = petListInfo.map(pet => {
            return (
                <View>
                    <TouchableOpacity
                        key={pet.id}
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
                    onPress={() => this.setState({ petDaddyName: "Not Known", petDaddyModalVisible: false })}
                    style={[styles.wrapperText, { alignItems: 'center' }]} >
                    <Text style={styles.textStyle}>Not Known</Text>
                </TouchableOpacity >
            </View>
        )

        if (petListInfo.length != 0) {
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
        const { petListInfo } = this.state;
        let tempPetsList = [];
        tempPetsList = petListInfo.map(pet => {
            return (
                <View>
                    <TouchableOpacity
                        key={pet.id}
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
                    onPress={() => this.setState({ petMommyName: "Not Known", petMommyModalVisible: false })}
                    style={[styles.wrapperText, { alignItems: 'center' }]} >
                    <Text style={styles.textStyle}>Not Known</Text>
                </TouchableOpacity >
            </View>
        )

        if (petListInfo.length != 0) {
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
            petType,
            petName,
            petWeight,
            loading,
            disAddPetBtn,
            petDaddyName,
            petMommyName,
            petReward,
            petDaddyModalVisible,
            petMommyModalVisible,
            petAddress
        } = this.state

        let petDaddyStyle = petDaddyName === "Select pet Daddy" ? { color: '#848482', fontSize: scale(13) } : { color: '#ffffff', fontSize: scale(13) }
        let petMommyStyle = petMommyName === "Select pet Mommy" ? { color: '#848482', fontSize: scale(13) } : { color: '#ffffff', fontSize: scale(13) }

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
                                <RkText style={styles.commonTxt}>Pet Category</RkText>
                                <Picker
                                    underlineColorAndroid='transparent'
                                    style={{ flex: 3, color: '#ffffff' }}
                                    selectedValue={petType}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ petType: itemValue })}>
                                    <Picker.Item label="Cat" value="cat" />
                                    <Picker.Item label="Dog" value="dog" />
                                    <Picker.Item label="Fish" value="fish" />
                                    <Picker.Item label="Horse" value="horse" />
                                    <Picker.Item label="Bird" value="bird" />
                                    <Picker.Item label="Mammal" value="mammals" />
                                    <Picker.Item label="Others" value="others" />
                                </Picker>
                            </View>
                            <View style={styles.border}></View>
                            <View style={styles.eachItem}>
                                <RkText style={styles.commonTxt}>Pet Name</RkText>
                                <TextInput placeholder='Pet Name'
                                    placeholderTextColor='#848482'
                                    underlineColorAndroid='transparent'
                                    onChangeText={(input) => this.setState({ petName: input })}
                                    value={petName}
                                    style={{ flex: 3, color: '#ffffff' }} />
                            </View>
                            <View style={styles.border}></View>
                            <View style={styles.eachItem}>
                                <RkText style={styles.commonTxt}>Pet Reward</RkText>
                                <TextInput placeholder='Pet Reward'
                                    placeholderTextColor='#848482'
                                    underlineColorAndroid='transparent'
                                    onChangeText={(input) => this.setState({ petReward: input })}
                                    value={petReward}
                                    style={{ flex: 3, color: '#ffffff' }} />
                            </View>
                            <View style={styles.border}></View>
                            {/* {
                                petType === "dog" ?
                                    <View>
                                        <View style={styles.eachItem}>
                                            <RkText style={styles.commonTxt}>Pet Breed</RkText>
                                            <TextInput
                                                placeholder='Choose Breed'
                                                placeholderTextColor='#848482'
                                                underlineColorAndroid='transparent'
                                                onChangeText={(input) => console.log(input)}

                                                style={{ flex: 3, color: '#ffffff' }} />
                                        </View>
                                        <View style={styles.border}></View>
                                    </View>
                                    :
                                    <View />
                            } */}
                            <View style={[styles.eachItem, { marginVertical: scale(10) }]}>
                                <RkText style={styles.commonTxt}>Pet Daddy</RkText>
                                <TouchableOpacity style={{ flex: 3 }} onPress={() => { this.setState({ petDaddyModalVisible: true }) }}>
                                    <RkText style={petDaddyStyle} >{petDaddyName}</RkText>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.border}></View>
                            <View style={[styles.eachItem, { marginVertical: scale(10) }]}>
                                <RkText style={styles.commonTxt}>Pet Mommy</RkText>
                                <TouchableOpacity style={{ flex: 3, color: '#ffffff' }} onPress={() => { this.setState({ petMommyModalVisible: true }) }}>
                                    <RkText style={petMommyStyle}>{petMommyName}</RkText>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.border}></View>
                            <View style={styles.eachItem}>
                                <RkText style={styles.commonTxt}>Pet Address</RkText>
                                <TextInput placeholder='Pet Address'
                                    placeholderTextColor='#848482'
                                    underlineColorAndroid='transparent'
                                    onChangeText={(input) => this.setState({ petAddress: input })}
                                    value={petAddress}
                                    style={{ flex: 3, color: '#ffffff' }} />
                            </View>
                            <View style={styles.border}></View>
                            <View style={[styles.eachItem, { marginVertical: scale(5) }]}>
                                <RkText style={styles.commonTxt} >Pet Birthdate</RkText>
                                <DatePicker
                                    style={{ width: scale(200), flex: 3, alignSelf: 'center' }}
                                    date={this.state.date}
                                    mode="date"
                                    placeholder="select date"
                                    format="DD-MM-YYYY"
                                    androidMode='spinner'
                                    minDate="01-01-2000"
                                    maxDate={today}
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            top: scale(4),
                                            marginLeft: 0,
                                            left: 0
                                        },
                                        dateInput: {
                                            marginLeft: scale(36),
                                        },
                                        dateText: {
                                            color: '#ffffff'
                                        }
                                    }}
                                    onDateChange={(date) => { this.setState({ date: date }) }}
                                />
                            </View>
                            <View style={styles.border}></View>
                            <View style={[styles.eachItem]}>
                                <RkText style={styles.commonTxt}>Gender</RkText>
                                <RadioGroup
                                    size={scale(22)}
                                    color='#ECC951'
                                    selectedIndex={0}
                                    style={{ flex: 3, flexDirection: 'row', marginRight: scale(15) }}
                                    onSelect={(index, value) => this.setState({ gender: value })}
                                >
                                    <RadioButton value={'Male'} color='#ECC951' >
                                        <Text style={{ color: '#ffffff' }}>Male</Text>
                                    </RadioButton>
                                    <RadioButton value={'Female'} color='#ECC951'>
                                        <Text style={{ color: '#ffffff' }}>Female</Text>
                                    </RadioButton>
                                </RadioGroup>
                            </View>
                            <View style={styles.border}></View>
                            <View style={styles.eachItem}>
                                <RkText style={styles.commonTxt} >Pet Weight</RkText>
                                <TextInput placeholder='Pet Weight (In Lbs)'
                                    placeholderTextColor='#848482'
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
                                numberOfLines={4}
                                placeholderTextColor='#848482'
                                underlineColorAndroid='transparent'
                                onChangeText={(input) => { this.setState({ petDescription: input }) }}
                                style={{ textAlignVertical: 'top', color: '#ffffff' }}
                            />
                        </RkCard>
                    </View>

                    <View style={styles.btnContainer}>
                        <RkButton
                            disabled={disAddPetBtn}
                            rkType='stretch'
                            style={styles.addbtn}
                            onPress={() => this.addPet()}
                        >
                            {
                                loading ? <ActivityIndicator size="small" color='#FFEB3B'></ActivityIndicator>
                                    : <RkText style={{ color: '#ECC951', fontSize: scale(19) }}>ADD PET</RkText>
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

    async addPet() {

        let {
            petProPic,
            ownerId,
            petType,
            petName,
            petReward,
            petDaddyName,
            petMommyName,
            petDaddyId,
            petMommyId,
            date,
            gender,
            petWeight,
            petDescription,
            petAddress
        } = this.state;

        let temDaddyName = petDaddyName === "Select pet Daddy" ? 'Not Known' : petDaddyName
        let temMommyName = petMommyName === "Select pet Mommy" ? 'Not Known' : petMommyName

        if (petProPic === null) {
            alert("Please select your lovely pet profile.");
        } else if (petName === '') {
            alert("Please enter your pet name");
        } else {
            let petInfo = {
                "ownerId": ownerId,
                "petType": petType,
                "petName": petName,
                "petReward": petReward,
                "petDaddyName": temDaddyName,
                "petMommyName": temMommyName,
                "petDaddyId": petDaddyId,
                "petMommyId": petMommyId,
                "petBirthDate": date,
                "petGender": gender,
                "petWeight": petWeight,
                "petDescription": petDescription,
                "petAddress": petAddress
            }

            let data = new FormData();

            let path = addPetUrl;
            this.setState({ loading: true, disAddPetBtn: true });

            data.append("petProPic", {
                uri: petProPic.path,
                type: petProPic.mime,
                name: "petProPic" + '.' + petProPic.mime.split('/')[1]
            });

            data.append("petInfo", JSON.stringify(petInfo));

            const config = {
                headers: {
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                    'Content-Type': 'multipart/form-data',
                },
                method: 'POST',
                body: data
            }

            try {
                let res = await fetch(path, config);
                console.log(res)

                let resJson = await res.json();
                console.log(resJson)
                this.setState({ loading: false, disAddPetBtn: false })
                if (res.status == 201) {
                    this.props.navigation.state.params.refreshOwnerProfile(this.state.ownerId);
                    this.props.navigation.state.params.refreshPetList();
                    this.props.navigation.navigate("MainOwnerProfile");
                    this.setState({ loading: false, disAddPetBtn: false })
                } else if (res.status === 500) {
                    this.setState({
                        loading: false,
                        disAddPetBtn: false
                    })
                    alert("Cannot save pet!")
                } else {
                    alert("Cannot save pet");
                }

            } catch (error) {
                alert("Something Went Wrong!")
                this.setState({ loading: false, disAddPetBtn: false })
            }


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
        backgroundColor: 'rgba(25, 30, 31,0.5)',
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: scale(20)
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
