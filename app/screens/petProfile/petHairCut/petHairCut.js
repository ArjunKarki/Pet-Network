import React, { Component } from 'react'
import { ImageBackground, View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import { scale } from '../../../utils/scale';
import FIcon from 'react-native-vector-icons/FontAwesome'
import { ActivityTimer, ActivityRecord } from '../../../components';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { formatDate } from '../../../utils/commonService';
import { hairCutListUrl, deleteHairCutUrl, addPetHairCutUrl, setHiarCutReminderUrl, removeHairCutReminderUrl, comfirmHairCutReminderUrl } from '../../../utils/globle';
import LoggedUserCredentials from '../../../utils/modal/LoggedUserCredentials';
export class PetHairCut extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Hair',
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerTintColor: '#ECC951',
        headerStyle: {
            backgroundColor: '#191e1f'
        }
    })

    constructor(props) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false,
            upCommingDate: null,
            previousRecord: [],
            loading: false,
            petId: this.props.navigation.state.params.PetId
        }
    }

    componentDidMount() {

        //let petId = this.state.petId
        this.getHairCutList()
    }

    async getHairCutList() {

        this.setState({ loading: true });

        let path = hairCutListUrl + "/" + this.state.petId;

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
            },
            method: 'GET',
        }

        try {

            let res = await fetch(path, config)

            if (res.status == 200) {
                let resJson = await res.json();
                console.log(resJson)
                this.setState({
                    previousRecord: resJson.previousRecord,
                    loading: false,
                    data: resJson,
                    upCommingDate: resJson.upcomming
                })
            } else {
                alert("Something Went Wrong!")
            }
        } catch (error) {
            alert("Something Went Wrong!")
        }
    }

    _doneBtnClick = async () => {
        // this.setState({ previousRecord: [...this.state.previousRecord, this.state.upCommingDate], upCommingDate: null })
        let { upCommingDate, petId } = this.state
        let path = comfirmHairCutReminderUrl

        let Data = {
            cutDate: upCommingDate.date,
            caredType: "home",
            note: "",
            petId: petId,
            reminderId: upCommingDate._id
        }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(Data)
        }

        try {

            let res = await fetch(path, config)
            if (res.status == 201) {
                let resJson = await res.json();
                this.setState({ previousRecord: resJson, upCommingDate: null })
            } else {
                alert("Something Went Wrong!")
            }
        } catch (error) {
            alert("Please, check your connection!")
        }
    }

    _onEachRecordPress = (data) => {
        this.props.navigation.navigate("EditHairCutActivity", { data: data })
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = async (date) => {
        let { petId } = this.state
        this.setState({ isDateTimePickerVisible: false })

        const Data = {
            petId: petId,
            date: date,
            type: "HAIR-CUT"
        }

        const path = setHiarCutReminderUrl

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(Data)
        }

        try {

            let res = await fetch(path, config);
            if (res.status == 201) {
                let resJson = await res.json()

                this.setState({ upCommingDate: resJson })
            } else {
                alert("Something wrong!")
            }
        } catch (error) {
            console.log(error)
            alert("Please, check your connection!")
        }
    };

    _OnDeleteRecord = async (item, index) => {
        let { previousRecord } = this.state
        previousRecord.splice(index, 1)
        this.setState({ previousRecord: previousRecord })
        let data = {
            hairCutRecordId: item._id,
            petId: item.petId
        }

        let path = deleteHairCutUrl

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(data)
        }

        try {
            let res = await fetch(path, config)
            alert(res.status)

        } catch (error) {
            alert("Please, check your connection!")
        }
    }

    _delBtnClick = async () => {

        const Data = {
            reminderId: this.state.upCommingDate._id,
            petId: this.state.petId
        }

        const path = removeHairCutReminderUrl

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(Data)
        }

        try {

            let res = await fetch(path, config);
            if (res.status == 200) {

                this.setState({ upCommingDate: null })
            } else {
                alert("Something wrong!")
            }
        } catch (error) {
            console.log(error)
            alert("Please, check your connection!")
        }
    }

    render() {
        let { upCommingDate, loading, previousRecord } = this.state
        if (loading) {

            return (
                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(25, 30, 31,0.5)', flex: 1 }}>
                    <ActivityIndicator size="large" color='#FFEB3B' />
                </View>
            )
        }

        return (
            <ImageBackground
                style={{ width: null, height: null, flex: 1 }}
                source={require('../../../assets/images/background.jpg')}
            >
                <View style={{ marginHorizontal: scale(20) }}>
                    <ActivityTimer
                        delBtnClick={this._delBtnClick}
                        doneBtnClick={this._doneBtnClick}
                        upCommingDate={upCommingDate}
                        showDateTimeModal={this._showDateTimePicker}

                    />
                    <ActivityRecord
                        onDeleteRecord={(item, index) => this._OnDeleteRecord(item, index)}
                        data={previousRecord}
                        onEachRecordPress={(data) => this._onEachRecordPress(data)}
                    />
                </View>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate("CreateHairCutActivity", { PetId: this.state.petId, refresh: () => this.getHairCutList() })}
                    style={styles.floatingButton}>
                    <FIcon name="plus" color="#191e1f" size={scale(25)} />
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
            </ImageBackground>
        )
    }
}

let styles = StyleSheet.create({
    floatingButton: {
        width: scale(55),
        height: scale(55),
        backgroundColor: "#ECC951",
        position: 'absolute',
        bottom: scale(30),
        right: scale(10),
        borderRadius: scale(30),
        alignItems: "center",
        justifyContent: 'center'
    }
})