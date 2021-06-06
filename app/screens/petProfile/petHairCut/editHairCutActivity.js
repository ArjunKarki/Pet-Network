import React, { Component } from 'react'
import { ImageBackground, TouchableOpacity, StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native'
import { CreateActivity } from '../../../components';
import MIcon from 'react-native-vector-icons/MaterialIcons'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { scale } from '../../../utils/scale';
import { baseUrl } from '../../../utils/globle';
import { RkButton, RkText } from 'react-native-ui-kitten'
import PhotoView from "@merryjs/photo-viewer";

export class EditHairCutActivity extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: "Hair Cut",
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerTintColor: '#ECC951',
        headerStyle: {
            backgroundColor: '#191e1f'
        },
        headerRight: (
            navigation.state.params != undefined ?
                navigation.state.params.showEditButton == true ?
                    <TouchableOpacity style={{ marginRight: scale(20) }} onPress={() => navigation.state.params.onEditButtonPress()}>
                        <MIcon name="edit" color="#ECC951" size={scale(20)} />
                    </TouchableOpacity>
                    :
                    null
                :
                null
        )
    })

    constructor(props) {
        super(props)
        this.state = {
            caredType: "home",
            date: String(new Date()),
            note: "",
            loading: false,
            disibleView: "none",
            isDateTimePickerVisible: false,
            hairCutPic: [],
            selectedMediaIndex: null,
            photoModalVisible: false,
            visibleSaveCancleBtn: false
        }
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (newDate) => {
        //alert(new Date(date))
        this.setState({ isDateTimePickerVisible: false, date: newDate })
    };

    onEditButtonPress = () => {
        this.setState({ visibleSaveCancleBtn: true, disibleView: "auto" })
    }

    componentDidMount() {
        console.log("aa", this.props.navigation.state.params)
        this.props.navigation.setParams({ onEditButtonPress: this.onEditButtonPress, showEditButton: true })
        let { params } = this.props.navigation.state
        console.log("params", params)
        this.setState({
            caredType: params.data.caredBy,
            date: params.data.cutDate,
            note: params.data.note,
            hairCutPic: params.data.hairCutPic.length > 0 ? params.data.hairCutPic : [],
            selectedMediaIndex: null
        })
    }

    onCareSelect = (index, value) => {
        this.setState({
            caredType: value
        })
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _onSaveBtnClick = () => alert("edited")


    render() {
        let { date, caredType, note, loading, visibleSaveCancleBtn, disibleView, hairCutPic, selectedMediaIndex } = this.state
        console.log(hairCutPic)
        let paths = []

        if (hairCutPic.length > 0) {
            paths = hairCutPic.map(path => {
                return { source: { uri: baseUrl + "/pets/showHairCutPic/" + path } };
            })
        }
        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null, }}
                source={require('../../../assets/images/background.jpg')}
            >
                <CreateActivity
                    disibleView={disibleView}
                    caredType={caredType}
                    date={date}
                    note={note}
                    onCareSelect={(index, value) => this.onCareSelect(index, value)}
                    showDateTimeModal={this._showDateTimePicker}
                    onInputChange={(input) => this.setState({ note: input })}
                />

                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                {
                    hairCutPic.length == 0 ?
                        null
                        :
                        <View style={styles.imgContainer}>
                            <View style={{ padding: scale(10) }}>
                                <Text style={styles.title}>Image</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        hairCutPic.map((item, index) => {
                                            return <ViewImg
                                                index={index}
                                                picId={item}
                                                onPress={() => this.setState({
                                                    photoModalVisible: true,
                                                    selectedMediaIndex: index
                                                })}
                                            />
                                        })
                                    }


                                </View>
                            </View>
                        </View>
                }
                {
                    visibleSaveCancleBtn ?
                        <View style={{ flexDirection: 'row', padding: 10, marginTop: scale(20), borderWidth: scale(1), borderColor: "#ECC951", marginHorizontal: scale(10), borderRadius: scale(10) }}>
                            <RkButton onPress={() => this.props.navigation.goBack()} style={styles.btnStyle}>
                                <RkText style={styles.txtStyle}>Cancel</RkText>
                            </RkButton>
                            <RkButton onPress={() => this._onSaveBtnClick()} style={styles.btnStyle}>
                                {
                                    loading ? <ActivityIndicator size="small" color='#FFEB3B' />
                                        :
                                        <RkText style={styles.txtStyle}>Edit</RkText>
                                }
                            </RkButton>
                        </View>
                        :
                        null

                }

                <PhotoView
                    visible={this.state.photoModalVisible}
                    data={paths}
                    hideStatusBar={true}
                    hideCloseButton={true}
                    hideShareButton={true}
                    initial={parseInt(selectedMediaIndex) || 0}
                    onDismiss={e => {
                        this.setState({ photoModalVisible: false });
                    }}
                />
            </ImageBackground>
        )
    }
}

const ViewImg = props => {

    return (
        <TouchableOpacity onPress={() => props.onPress(props.index)} style={{ marginRight: scale(5) }}>
            <View style={{ width: scale(70), height: scale(75), backgroundColor: 'rgba(25, 30, 31,0.5)', borderWidth: 1, borderColor: '#ECC951', borderRadius: 10, marginBottom: scale(10), alignItems: "center", justifyContent: "center" }}>
                <Image source={{ uri: baseUrl + "/pets/showHairCutPic/" + props.picId }}
                    style={{ width: scale(70), height: scale(75), borderWidth: 1, borderColor: '#ECC951', overflow: 'hidden', borderRadius: scale(10) }} />
            </View>
        </TouchableOpacity>
    )
}

let styles = StyleSheet.create({
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