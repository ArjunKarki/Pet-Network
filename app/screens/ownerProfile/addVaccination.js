import React, { Component } from 'react';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import {
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Modal,
    StyleSheet,
    Dimensions,
    ImageBackground,
    ActivityIndicator,
    ViewComponent,
} from 'react-native';

import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePicker from 'react-native-image-crop-picker';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcons from 'react-native-vector-icons/Feather';
import { RkButton, RkText, RkChoice } from 'react-native-ui-kitten';
import { addPetVaccinationUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { scale } from '../../utils/scale';

let today = new Date();
const { width, height } = Dimensions.get('window')
export class AddVaccination extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Add Vaccination',
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
                <RkText rkType='awesome' ><Icon name='arrow-back' style={{ fontSize: 25 }} /></RkText>
            </RkButton>
        )
    });

    constructor(props) {
        super(props)
        this.state = {
            vaccineNote: "",
            injectionDate: "",
            nextInjectionDate: "",
            caredType: "home",
            renderDate: false,
            renderImage: false,
            vaccineImage: null,
            imageModalVisible: false,
            showVaccinePicker: false,
            checkboxSelected: false,
            showTextInput: false,
            chooseCamera: false,
            loading: false,
            names: "",
            modalVisible: false,
            showTextInput: false,
            disSaveBtn: false,
            disCancelBtn: false,
            vaccImages: [],
            currentSelectedVImage: null,
            data: [
                "Parvovirosis",
                "Canine Distemper",
                "Canine Adenovirus Type 2",
                "Canine Infectious Hepatits",
                "Leptospirosis",
                "Rabies",
                "Canine Parainfluenza virus",
                "Kennel cough",
                "bordetella bronchiseptica"
            ],
        }
    }

    async pickVaccineImageGallery() {
        const img = await ImagePicker.openPicker({ height: 300, width: 300, multiple: false, compressImageQuality: 0.3 });
        let { vaccImages } = { ...this.state }
        vaccImages[this.state.currentSelectedVImage] = img
        this.setState({ vaccImages, renderImage: true, chooseCamera: false, });
    }
    
    async pickVaccineImageCamera() {
        const img = await ImagePicker.openCamera({ height: 300, width: 300 });
        let { vaccImages } = { ...this.state }
        vaccImages[this.state.currentSelectedVImage] = img
        this.setState({ renderImage: true, chooseCamera: false, vaccImages });
    }

    chooseBox() {
        return (
            <View style={[styles.card, { padding: 10 }]}>
                <TouchableOpacity onPress={() => this.pickVaccineImageCamera()}
                    style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <FIcons name='camera' style={{ color: 'yellow', fontSize: 22, margin: 10 }} />
                    <Text style={{ fontSize: 18, color: '#ffffff', margin: 10 }}>Open Camera</Text>
                </TouchableOpacity>
                <View style={styles.spacer} />
                <TouchableOpacity onPress={() => this.pickVaccineImageGallery()}
                    style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <Icons name='folder-multiple-image' style={{ color: 'yellow', margin: 10, fontSize: 22 }} />
                    <Text style={{ fontSize: 18, color: '#ffffff', margin: 10 }}>Choose from  Gallery</Text>
                </TouchableOpacity>
            </View>
        )
    }
    renderModal() {
        const { data, names } = this.state
        const dataArray = []
        data.map((res, index) => {
            dataArray.push(
                <View key={index}>
                    <TouchableOpacity
                        onPress={() => this.setState({ names: res, modalVisible: false })}>
                        <Text style={styles.textStyle}>{res}</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                </View>
            )
        })
        dataArray.push(
            <TouchableOpacity onPress={() => this.setState({ showTextInput: true })}>
                <Text style={styles.textStyle}>Other</Text>
            </ TouchableOpacity>
        )
        return (
            <View style={styles.cardStyle}>
                <ScrollView>
                    {dataArray}
                </ScrollView>
                <TouchableOpacity
                    onPress={() => this.setState({ modalVisible: false })}
                    style={[styles.cardStyle, { height: null, width: null }]}>
                    <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
            </View>
        )
    }

    renderDatePicker() {
        let { checkboxSelected } = this.state;
        return (
            <View style={styles.dateContainer}>
                <Text style={styles.dateTitle}>Choose Vaccination Injection Date</Text>
                <View style={{ borderBottomColor: '#ECC951', borderBottomWidth: 1, marginHorizontal: 10 }} />
                <View style={styles.dateRow}>
                    <Text style={{ color: "#ffffff", marginLeft: 25, fontSize: 18, marginBottom: 10 }}>Injection Date</Text>
                    <DatePicker
                        style={{ width: 300, alignSelf: 'center' }}
                        date={this.state.injectionDate === "" ? new Date() : this.state.injectionDate}
                        mode="date"
                        placeholder="Select Injection Date"
                        format="YYYY-MM-DD"
                        androidMode='spinner'
                        minDate="01-01-2017"
                        maxDate="30-12-2029"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                top: 4,
                                marginLeft: 0,
                                left: 0
                            },
                            dateInput: {
                                marginLeft: 36,
                            },
                            dateText: {
                                color: '#fff'
                            }
                        }}
                        onDateChange={(date) => { this.setState({ injectionDate: date }) }}
                    />
                </View>
                <View style={{ flexDirection: "row", marginLeft: scale(35) }}>
                    <RkChoice selected={this.state.checkboxSelected} onChange={() => { this.setState({ checkboxSelected: !checkboxSelected }) }} />
                    <Text style={{ color: "#ffffff", marginLeft: scale(10), alignSelf: "center" }}>Has Next Vaccination?</Text>
                </View>

                {
                    checkboxSelected ?
                        <View style={styles.dateRow}>
                            <Text style={{ color: "#ffffff", marginLeft: 25, fontSize: 18, marginBottom: 10 }}>Next Injection Date</Text>
                            <DatePicker
                                style={{ width: 300, alignSelf: 'center' }}
                                date={this.state.nextInjectionDate === "" ? new Date() : this.state.nextInjectionDate}
                                mode="date"
                                placeholder="Select Next Injection Date"
                                format="YYYY-MM-DD"
                                androidMode='spinner'
                                minDate="2017-01-01"
                                maxDate="2050-12-30"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        top: 4,
                                        marginLeft: 0,
                                        left: 0
                                    },
                                    dateInput: {
                                        marginLeft: 36,
                                    },
                                    dateText: {
                                        color: '#fff'
                                    }
                                }}
                                onDateChange={(date) => { this.setState({ nextInjectionDate: date }) }}
                            />
                        </View>

                        : null
                }


                <View style={{ borderBottomColor: '#ECC951', borderBottomWidth: 1, marginHorizontal: scale(10), marginVertical: scale(10) }} />
                <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: scale(10) }}>
                    <RkButton onPress={() => this.setState({ renderDate: false })}
                        style={styles.dateModalBtn}><RkText style={{ color: "#ECC951" }}>Cancel</RkText></RkButton>
                    <RkButton onPress={
                        () => this.setState({ renderDate: false })}
                        style={styles.dateModalBtn}><RkText style={{ color: "#ECC951" }}>Ok</RkText></RkButton>
                </View>
            </View>

        )
    }

    async saveBtnClick() {
        let { petId } = this.props.navigation.state.params;
        let {
            names,
            injectionDate,
            nextInjectionDate,
            vaccineNote,
            vaccImages,
            caredType
        } = this.state

        let Data = new FormData();

        let path = addPetVaccinationUrl

        if (names === '') {
            alert('Please select your vaccine name.');
        } else if (vaccImages.length==0) {
            alert('Please select vaccine Image');
        } else if (injectionDate === "") {
            alert("Please select injection date.")
        } else {
            this.setState({ loading: true, disSaveBtn: true, disCancelBtn: true });

            let vaccinationInfo = {
                "vaccineName": names,
                "injectionDate": injectionDate,
                "nextInjectionDate": nextInjectionDate,
                "vaccinationNote": vaccineNote,
                "petId": petId,
                "caredType": caredType
            }

            for (let i = 0; i < vaccImages.length; i++) {

                if (vaccImages[i] != undefined) {
                    Data.append("vaccineImage", {
                        uri: vaccImages[i].path,
                        type: vaccImages[i].mime,
                        name: "vaccImg" + i + "." + vaccImages[i].mime.split("/")[1]
                    })
                }
            }

            Data.append("vaccinationInfo", JSON.stringify(vaccinationInfo));
            console.log("dDDdtaa", Data)
            const config = {
                headers: {
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                    'Content-Type': 'multipart/form-data',
                },
                method: 'POST',
                body: Data
            }

            try {
                let res = await fetch(path, config);
                // let resJson = await res.json();
                if (res.status === 200) {
                    this.setState({ loading: false, disSaveBtn: false, disCancelBtn: false });

                    this.props.navigation.state.params.refresh();
                    this.props.navigation.goBack();
                } else {
                    this.setState({ loading: false, disSaveBtn: false, disCancelBtn: false });
                    alert("Something went wrong!")
                }

            } catch (error) {
                this.setState({ loading: false, disSaveBtn: false, disCancelBtn: false });
                alert("Please check connection!")
            }

        }
    }

    onCareSelect(index, value) {
        this.setState({
            caredType: value
        })
    }

    render() {
        let {
            loading,
            names,
            injectionDate,
            disCancelBtn,
            disSaveBtn,
            vaccImages
        } = this.state;
        let time = new Date().toLocaleTimeString('en-US', { hour12: true, hour: "numeric", minute: "numeric" });
        console.log("tteme", time)
        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='always'>
                    <View style={styles.card}>
                        <View style={styles.eachRow}>
                            <Text style={styles.txtStyle}>Vaccine Names</Text>
                            <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
                                {
                                    names ?
                                        <Text style={{ color: '#fff', marginLeft: 5 }}>{names}</Text>
                                        :
                                        <Text style={{ color: 'grey', marginLeft: 5 }}>Choose Vaccine Name</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.eachRow}>
                            <Text style={styles.txtStyle}>Injection Date</Text>

                            <TouchableOpacity onPress={() => this.setState({ renderDate: true })}
                                style={styles.dateStyle}>

                                {
                                    injectionDate === "" ?
                                        <Text style={{ color: 'grey', marginBottom: 5 }}>Choose Injection Date</Text>
                                        :
                                        <Text style={{ color: '#ffffff' }}>{this.state.injectionDate}</Text>
                                    // <Text style={{ color: 'grey', marginBottom: 5 }}>Choose Injection Date</Text>
                                    // :
                                    // <Text style={{ color: '#fff', }}>{this.state.injectionDate}   -  Next  ( {this.state.nextInjectionDate} )</Text>
                                }

                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />
                        {
                            this.state.nextInjectionDate === "" || this.state.checkboxSelected === false ?
                                null
                                :
                                <View style={styles.eachRow}>
                                    <Text style={styles.txtStyle}>Next Injection Date</Text>
                                    <TouchableOpacity onPress={() => this.setState({ renderDate: true })}
                                        style={styles.dateStyle}>
                                        <Text style={{ color: '#ffffff' }}>{this.state.nextInjectionDate}</Text>
                                    </TouchableOpacity>
                                </View>
                        }
                        {
                            this.state.nextInjectionDate === "" || this.state.checkboxSelected === false ?
                                null
                                :
                                <View style={styles.divider} />
                        }
                        <View style={styles.eachRow}>
                            <Text style={styles.txtStyle}>Cared</Text>
                            <RadioGroup
                                onSelect={(index, value) => this.onCareSelect(index, value)}
                                selectedIndex={0}
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
                        <View style={styles.divider} />
                        <View style={[styles.eachRow,]}>

                            <Text style={styles.txtStyle}>Note</Text>
                            <TextInput
                                placeholder="Enter Note..."
                                placeholderTextColor="grey"
                                multiline={true}
                                onChangeText={(input) => this.setState({ vaccineNote: input })}
                                style={{ color: '#ffffff' }}
                            />
                        </View>

                        <View style={{ height: 1, backgroundColor: '#ECC951', marginBottom: scale(5), marginHorizontal: scale(10) }} />

                        {/* <View style={styles.eachRow}>

                            <View style={{ flexDirection: 'row' }}>

                                <Text onPress={() => this.setState({ chooseCamera: true })}
                                    style={styles.txtStyle}>Vaccine Image</Text>

                                {
                                    this.state.vaccineImage !== null ?
                                        <TouchableOpacity onPress={() => this.setState({ imageModalVisible: true })}>
                                            <Image source={{ uri: this.state.vaccineImage.path }}
                                                style={{ width: 55, height: 55, borderRadius: 55 / 2, resizeMode: 'contain', alignSelf: 'flex-end' }} />
                                        </TouchableOpacity>
                                        :
                                        null
                                }

                            </View>

                            {
                                this.state.vaccineImage === null ?
                                    <Text onPress={() => this.setState({ chooseCamera: true })}
                                        style={{ color: 'grey', marginBottom: scale(10), marginLeft: 2 }}>Choose Vaccine Image</Text>
                                    :
                                    null
                            }

                        </View> */}

                        <View style={[styles.eachRow,]}>
                            <Text style={styles.txtStyle}>Vaccine Images</Text>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                                <VaccImage
                                    img={0}
                                    vaccImg={vaccImages}
                                    onPress={() => this.setState({ chooseCamera: true, currentSelectedVImage: 0 })}
                                />
                                <VaccImage
                                    img={1}
                                    vaccImg={vaccImages}
                                    onPress={() => this.setState({ chooseCamera: true, currentSelectedVImage: 1 })}
                                />
                                <VaccImage
                                    img={2}
                                    vaccImg={vaccImages}
                                    onPress={() => this.setState({ chooseCamera: true, currentSelectedVImage: 2 })}
                                />
                                <VaccImage
                                    img={3}
                                    vaccImg={vaccImages}
                                    onPress={() => this.setState({ chooseCamera: true, currentSelectedVImage: 3 })}
                                />

                                {/* <TouchableOpacity onPress={() => this.setState({ chooseCamera: true })}>
                                    <View style={{ width: scale(70), height: scale(75), backgroundColor: 'rgba(25, 30, 31,0.5)', borderWidth: 1, borderColor: '#ECC951', borderRadius: 10, marginBottom: scale(10), alignItems: "center", justifyContent: "center" }}>

                                        {
                                            this.state.vaccineImage === null ?
                                                <AddIcon name="add" style={{ fontSize: scale(50), color: "#ECC951", }} />
                                                :
                                                <TouchableOpacity onPress={() => this.setState({ imageModalVisible: true })}>
                                                    <Image source={{ uri: this.state.vaccineImage.path }}
                                                        style={{ width: scale(70), height: scale(75), borderWidth: 1, borderColor: '#ECC951', overflow: 'hidden', borderRadius: scale(10) }} />
                                                </TouchableOpacity>
                                        }
                                    </View>
                                </TouchableOpacity> */}
                            </View>

                            {/* <TouchableOpacity onPress={() => this.setState({ chooseCamera: true })}>
                                <View style={{ marginLeft: scale(5), width: scale(70), height: scale(75), backgroundColor: 'rgba(25, 30, 31,0.5)',borderWidth:1,borderColor:'#ECC951',borderRadius:10, marginBottom: scale(10), alignItems: "center", justifyContent: "center" }}>

                                    {
                                        this.state.vaccineImage === null ?
                                            <AddIcon name="add" style={{ fontSize: scale(50),color:"#ECC951", }} />
                                            :
                                            <TouchableOpacity onPress={() => this.setState({ imageModalVisible: true })}>
                                                <Image source={{ uri: this.state.vaccineImage.path }}
                                                    style={{ width: scale(70),height: scale(75),borderWidth: 1,borderColor: '#ECC951',overflow: 'hidden',borderRadius:scale(10)}} />
                                            </TouchableOpacity>

                                    }

                                </View>
                            </TouchableOpacity> */}
                        </View>

                    </View>

                    <View style={[styles.card, { flexDirection: 'row', padding: 10, marginTop: 5 }]}>
                        <RkButton disabled={disCancelBtn} style={styles.btnStyle} onPress={() => { this.props.navigation.goBack() }}>
                            <RkText style={styles.txtStyle}>Cancel</RkText>
                        </RkButton>
                        <RkButton disabled={disSaveBtn} style={styles.btnStyle} onPress={() => { this.saveBtnClick() }}>
                            {
                                loading ? <ActivityIndicator size="small" color='#FFEB3B' />
                                    :
                                    <RkText style={styles.txtStyle}>Save</RkText>
                            }
                        </RkButton>
                    </View>
                    
                    {/* Render Date Modal */}

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.renderDate}
                        onRequestClose={() => {
                            this.setState({ renderDate: false })
                        }}>

                        <View style={{ flex: 1, backgroundColor: '#191e1f', justifyContent: 'center', }}>
                            {this.renderDatePicker()}
                        </View>

                    </Modal>

                    {/* Choose Image from camera or Gallary */}
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={this.state.chooseCamera}
                        onRequestClose={() => {
                            this.setState({ chooseCamera: false })
                        }}>
                        <View style={{ flex: 1, backgroundColor: '#191e1f', justifyContent: 'center', alignItems: 'center' }}>
                            {this.chooseBox()}
                        </View>
                    </Modal>

                    {/* <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.imageModalVisible}
                        onRequestClose={() => {
                            this.setState({ imageModalVisible: false })
                        }}>
                        <View style={{ flex: 1, backgroundColor: '#191e1f', justifyContent: 'center', alignItems: 'center' }}>

                            {
                                this.state.vaccineImage != null ?
                                    <View style={{ padding: 10, marginHorizontal: 10, marginVertical: 10 }}>
                                        <Image source={{ uri: this.state.vaccineImage.path }}
                                            style={styles.imgStyle} />
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 15 }}>
                                            <TouchableOpacity onPress={() => this.setState({ imageModalVisible: false, vaccineImage: null })} style={styles.removeLogo}>
                                                <Icons name='delete-forever' style={{ color: '#FFEB3B', fontSize: 30 }} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => this.setState({ imageModalVisible: false })} style={styles.removeLogo}>
                                                <FIcons name='arrow-right' style={{ color: '#FFEB3B', fontSize: 30 }} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    :
                                    null
                            }
                        </View>
                    </Modal> */}

                    {/* TexInputModal */}
                    <Modal
                        animationType="fade"
                        transparent={false}
                        visible={this.state.showTextInput}
                        onRequestClose={() => {
                            this.setState({ showTextInput: false })
                        }}>
                        <View style={{ flex: 1, backgroundColor: '#191e1f', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={[styles.cardStyle, { height: null }]}>
                                <TextInput
                                    placeholder="Enter Vaccine Name"
                                    placeholderTextColor="grey"
                                    multiline={true}
                                    underlineColorAndroid='yellow'
                                    onChangeText={(value) => this.setState({ names: value })}
                                    style={{ color: '#ffffff', fontSize: 20, margin: 10, minWidth: width - 100 }}
                                />
                                <TouchableOpacity
                                    onPress={() => this.setState({ showTextInput: false })}
                                    style={[styles.cardStyle, { height: null, width: null }]}>
                                    <Text style={styles.textStyle}>Cancle</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.setState({ showTextInput: false, modalVisible: false })}
                                    style={[styles.cardStyle, { height: null, width: null }]}>
                                    <Text style={styles.textStyle}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    {/* VaccineName Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setState({ modalVisible: false })
                        }}>
                        <View style={{ flex: 1, backgroundColor: '#191e1f', justifyContent: 'center', alignItems: 'center' }}>
                            {this.renderModal()}
                        </View>
                    </Modal>
                </ScrollView>
            </ImageBackground>
        )
    }
}

const VaccImage = props => {
    console.log("iii",props.vaccImg)
    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <View style={{ width: scale(70), height: scale(75), backgroundColor: 'rgba(25, 30, 31,0.5)', borderWidth: 1, borderColor: '#ECC951', borderRadius: 10, marginBottom: scale(10), alignItems: "center", justifyContent: "center" }}>
                {
                    props.vaccImg[props.img] == undefined ?
                        <Icon name="add" style={{ fontSize: scale(50), color: "#ECC951", }} /> :
                        <View >
                            <Image source={{ uri: props.vaccImg[props.img].path }}
                                style={{ width: scale(70), height: scale(75), borderWidth: 1, borderColor: '#ECC951', overflow: 'hidden', borderRadius: scale(10) }} />
                        </View>
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 10,
        margin: 10,

    },
    eachRow: {
        marginHorizontal: 10,
        marginVertical: 2,
    },
    txtStyle: {
        color: '#ffffff',
        fontSize: 22,
        marginLeft: 3,
        marginVertical: 5,
        marginBottom: 10
    },
    dateStyle: {
        marginLeft: 3,

    },
    dateContainer: {
        flexDirection: 'column',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ECC951',
        // justifyContent: 'center',
        // alignItems: 'center',
        marginHorizontal: scale(10)
    },
    dateModalBtn: {
        borderWidth: 1.5,
        borderColor: '#ECC951',
        backgroundColor: "#3c3c3c"
    },
    dateRow: {
        marginHorizontal: 10,
        marginVertical: 10
    },
    btnWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        marginTop: 1
    },
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
    dateTitle: {
        color: '#ffffff',
        fontSize: 16,
        alignSelf: 'center',
        marginVertical: 18
    },
    removeLogo: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15
    },
    vaccineName: {
        color: '#ffffff',
        fontSize: 14,
        marginHorizontal: 20
    },
    rowStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    headerStyle: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
        fontStyle: 'italic',
        alignSelf: 'center',
        marginVertical: 10,
        marginHorizontal: 25
    },
    spacer: {
        borderWidth: 0,
        borderBottomColor: '#ECC951',
        borderBottomWidth: 1,
    },
    imgStyle: {
        width: 300,
        height: 400,
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 10,
        resizeMode: 'contain',
        margin: 10
    },
    cardStyle: {
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 10,
        margin: 10,
        padding: 15,
        height: height - 150,
        width: width - 30,
    },
    textStyle: {
        fontSize: 14,
        color: '#ffffff',
        alignSelf: 'center'
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#ECC951',
        marginVertical: scale(10),
        marginHorizontal: scale(10)
    },
    removeStyle: {
        position: 'absolute',
        top: 1,
        right: 1,
        zIndex: 2,
        color: 'red',
        fontSize: 16
    }
});

