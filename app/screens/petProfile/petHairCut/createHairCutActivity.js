import React, { Component } from 'react'
import { View, ImageBackground, ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
import { CreateActivity } from '../../../components';
import { RkButton, RkText } from 'react-native-ui-kitten'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcons from 'react-native-vector-icons/Feather';
import { scale } from '../../../utils/scale';
import { addPetHairCutUrl } from '../../../utils/globle';
import LoggedUserCredentials from '../../../utils/modal/LoggedUserCredentials';
import ImagePicker from 'react-native-image-crop-picker';
import { formatDate } from '../../../utils/commonService';
import DateTimePicker from 'react-native-modal-datetime-picker';
export class CreateHairCutActivity extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Hair",
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerTintColor: '#ECC951',
        headerStyle: {
            backgroundColor: '#191e1f'
        },
        // headerRight: (
        //     navigation.state.params != undefined ?
        //         navigation.state.params.showEditButton == true ?
        //             <TouchableOpacity style={{ marginRight: scale(20) }} onPress={() => navigation.state.params.onEditButtonPress()}>
        //                 <MIcon name="edit" color="#ECC951" size={scale(20)} />
        //             </TouchableOpacity>
        //             :
        //             null
        //         :
        //         null
        // )
    })

    constructor(props) {

        super(props)
        this.state = {
            caredType: "home",
            date: String(new Date()),
            note: "",
            //hairCutImg: null,
            hairCutImages: [],
            loading: false,
            disibleView: "auto",
            chooseCamera: false,
            isDateTimePickerVisible: false,
            currentSelectedImage: null
        }

    }

    // componentDidMount() {
    //     let { params } = this.props.navigation.state
    //     console.log(params)
    //     if (params.PetId) {
    //         this.props.navigation.setParams({ onEditButtonPress: this.onEditButtonPress, showEditButton: false })
    //     } else {
    //         this.props.navigation.setParams({ onEditButtonPress: this.onEditButtonPress, showEditButton: true })

    //         this.setState({
    //             date: params.data.cutDate,
    //             note: params.data.note,
    //             caredType: params.data.caredBy,
    //             visibleSaveCancleBtn: false,
    //             disibleView: "none"
    //         })
    //     }
    // }

    chooseBox() {

        return (
            <View style={[styles.card, { padding: 10 }]}>
                <TouchableOpacity onPress={() => this.pickCamera()}
                    style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <FIcons name='camera' style={{ color: 'yellow', fontSize: 22, margin: 10 }} />
                    <Text style={{ fontSize: 18, color: '#ffffff', margin: 10 }}>Open Camera</Text>
                </TouchableOpacity>
                <View style={styles.spacer} />
                <TouchableOpacity onPress={() => this.pickGallery()}
                    style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <Icons name='folder-multiple-image' style={{ color: 'yellow', margin: 10, fontSize: 22 }} />
                    <Text style={{ fontSize: 18, color: '#ffffff', margin: 10 }}>Choose from  Gallery</Text>
                </TouchableOpacity>
            </View>
        )
    }

    async pickGallery() {
        const img = await ImagePicker.openPicker({ height: 300, width: 300, multiple: false, compressImageQuality: 0.3 });
        let { hairCutImages } = { ...this.state }
        hairCutImages[this.state.currentSelectedImage] = img
        this.setState({ hairCutImages, chooseCamera: false, });
    }
    async pickCamera() {
        const img = await ImagePicker.openCamera({ height: 300, width: 300 });
        let { hairCutImages } = { ...this.state }
        hairCutImages[this.state.currentSelectedImage] = img
        this.setState({ chooseCamera: false, hairCutImages });
    }

    onEditButtonPress = () => {
        this.setState({ visibleSaveCancleBtn: true, disibleView: "auto" })
    }

    onCareSelect(index, value) {
        this.setState({
            caredType: value
        })
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (newDate) => {
        //alert(new Date(date))
        this.setState({ isDateTimePickerVisible: false, date: newDate })
    };

    _onSaveBtnClick = async () => {

        let { date, caredType, note, hairCutImages } = this.state
        if (hairCutImages.length == 0) {
            alert("Please select some photos of your pet!")
        } else {

            this.setState({ loading: true })
            let path = addPetHairCutUrl

            let Data = new FormData()

            for (let i = 0; i < hairCutImages.length; i++) {

                if (hairCutImages[i] != undefined) {
                    Data.append("hairCutImage", {
                        uri: hairCutImages[i].path,
                        type: hairCutImages[i].mime,
                        name: "hairCutImage" + i + "." + hairCutImages[i].mime.split("/")[1]
                    })
                }
            }

            let info = {
                cutDate: date,
                caredType: caredType,
                note: note,
                petId: this.props.navigation.state.params.PetId
            }

            Data.append("hairCutData", JSON.stringify(info))

            const config = {
                headers: {
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                    'Content-Type': 'multipart/form-data',
                },
                method: 'POST',
                body: Data
            }

            try {
                let res = await fetch(path, config)
                console.log(res)
                if (res.status == 201) {
                    this.setState({ loading: false })
                    this.props.navigation.state.params.refresh();
                    this.props.navigation.goBack();
                } else {
                    this.setState({ loading: false })
                    alert("Something Went Wrong!")
                }
            } catch (error) {
                this.setState({ loading: false })
                alert("Please check your connection!")
            }

        }
    }

    _openImagePicker = () => {
        this.setState({ chooseCamera: true })
    }

    render() {

        let { caredType, date, note, loading, disibleView, hairCutImages } = this.state
       
        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null, }}
                source={require('../../../assets/images/background.jpg')}
            >
                <CreateActivity
                    disibleView={disibleView}
                    loading={loading}
                    caredType={caredType}
                    date={date}
                    note={note}
                    onCareSelect={(index, value) => this.onCareSelect(index, value)}
                    showDateTimeModal={this._showDateTimePicker}
                    onInputChange={(input) => this.setState({ note: input })}
                />
                <View style={styles.imgContainer}>
                    <View style={{ padding: scale(10) }}>
                        <Text style={styles.title}>Image</Text>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                            <AddImg
                                index={0}
                                img={hairCutImages}
                                onPress={() => this.setState({ chooseCamera: true, currentSelectedImage: 0 })}
                            />
                            <AddImg
                                index={1}
                                img={hairCutImages}
                                onPress={() => this.setState({ chooseCamera: true, currentSelectedImage: 1 })}
                            />
                            <AddImg
                                index={2}
                                img={hairCutImages}
                                onPress={() => this.setState({ chooseCamera: true, currentSelectedImage: 2 })}
                            />
                            <AddImg
                                index={3}
                                img={hairCutImages}
                                onPress={() => this.setState({ chooseCamera: true, currentSelectedImage: 3 })}
                            />
                        </View>

                    </View>
                </View>
                <View style={{ flexDirection: 'row', padding: 10, marginTop: scale(20), borderWidth: scale(1), borderColor: "#ECC951", marginHorizontal: scale(10), borderRadius: scale(10) }}>
                    <RkButton onPress={() => this.props.navigation.goBack()} style={styles.btnStyle}>
                        <RkText style={styles.txtStyle}>Cancel</RkText>
                    </RkButton>
                    <RkButton onPress={() => this._onSaveBtnClick()} style={styles.btnStyle}>
                        {
                            loading ? <ActivityIndicator size="small" color='#FFEB3B' />
                                :
                                <RkText style={styles.txtStyle}>Save</RkText>
                        }
                    </RkButton>
                </View>
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
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
            </ImageBackground>
        )
    }
}

const AddImg = props => {
   
    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <View style={{ width: scale(70), height: scale(75), backgroundColor: 'rgba(25, 30, 31,0.5)', borderWidth: 1, borderColor: '#ECC951', borderRadius: 10, marginBottom: scale(10), alignItems: "center", justifyContent: "center" }}>
                {
                    props.img[props.index] == undefined ?
                        <MIcon name="add" style={{ fontSize: scale(50), color: "#ECC951", }} /> :
                        <View >
                            <Image source={{ uri: props.img[props.index].path }}
                                style={{ width: scale(70), height: scale(75), borderWidth: 1, borderColor: '#ECC951', overflow: 'hidden', borderRadius: scale(10) }} />
                        </View>
                }
            </View>
        </TouchableOpacity>
    )
}
let styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 10,
        margin: 10,

    },
    spacer: {
        borderWidth: 0,
        borderBottomColor: '#ECC951',
        borderBottomWidth: 1,
    },
    underLine: {
        marginHorizontal: scale(12),
        height: scale(1),
        backgroundColor: "#ECC951"
    },
    title: {
        color: "#fff",
        fontSize: scale(20)
    },
    imgContainer: {
        marginHorizontal: scale(10),
        borderColor: "#ECC951",
        borderWidth: 1,
        marginTop: scale(15),
        borderRadius: scale(15)
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
    txtStyle: {
        color: '#ffffff',
        fontSize: 22,
        marginLeft: 3,
        marginVertical: 5,
        marginBottom: 10
    },
})