import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    ActivityIndicator,
    Image,
    Switch
} from 'react-native';
import Icons from 'react-native-vector-icons/Entypo';
import FIcons from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-datepicker';
import RNGooglePlaces from 'react-native-google-places';
import ImagePicker from 'react-native-image-crop-picker';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { eventUrl } from '../../utils/globle';
import futch from '../../utils/futch';

let today = new Date();

export class CreateEvent extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Create Event',
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerTintColor: '#ECC951',
        headerStyle: {
            backgroundColor: '#191e1f'
        }
    });
    constructor() {
        super()
        this.state = {
            eventTitle: '',
            eventCoverImage: [],
            renderCoverImage: false,
            eventDescription: '',
            eventModalVisible: false,
            eventType: 'Enter Event Type',
            customType: false,
            showEventTextInput: false,
            privateSwitchIsOn: false,
            dateAndTimeModalVisible: false,
            eventDate: "01-01-2018",
            eventStartTime: "12:47",
            eventEndTime: "12:47",
            locationData: [],
            showActivityIndicator: false
        }
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    renderAutoCompleteModal() {
        return (
            RNGooglePlaces.openPlacePickerModal()
                .then((place) => {
                    this.setState({ locationData: place });
                }).catch(error => console.log(error.message))
        )
    }

    async renderEventCover() {
        const coverImg = await ImagePicker.openPicker({ mediaType: 'photo' });
        this.setState({ eventCoverImage: coverImg, renderCoverImage: true });
    }



    formatTime = (timeString) => {
        if (timeString) {
            let hr_min = timeString.split(':');

            console.log(hr_min);

            let hr = hr_min[0];
            let min = hr_min[1];

            let hours = Number(hr);
            let minutes = Number(min);

            console.log("hours " + hours + " min " + minutes);

            let ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            let strTime = hours + ':' + minutes + ' ' + ampm;

            console.log("final string " + strTime);
            return strTime;
        }

        return timeString;
    }

    renderTime() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#fff', fontSize: 16, marginTop: 8, marginLeft: 10 }}>From</Text>
                <DatePicker
                    style={{ marginTop: 1 }}
                    date={this.state.eventStartTime}
                    mode="time"
                    androidMode='default'
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    hideText={false}
                    customStyles={{
                        dateInput: {
                            borderWidth: 0,
                        },
                        dateText: {
                            color: this.state.eventStartTime === "12:47" ? "grey" : "#fff",
                            marginLeft: 5,
                        }
                    }}
                    onDateChange={date => this.setState({ eventStartTime: date })} />
                <Text style={{ color: '#fff', fontSize: 16, marginTop: 8 }}>To</Text>
                <DatePicker
                    style={{}}
                    date={this.state.eventEndTime}
                    mode="time"
                    androidMode='default'
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    showIcon={false}
                    customStyles={{
                        dateInput: {
                            borderWidth: 0,
                        },
                        dateText: {
                            color: this.state.eventEndTime === "12:47" ? "grey" : "#fff",
                            marginLeft: 5,
                        }
                    }}
                    onDateChange={(date) => { this.setState({ eventEndTime: date }) }} />
            </View>
        )
    }

    renderEventType() {
        return (
            <View style={styles.borderColorStyle}>
                <Text style={[styles.textStyle,
                { marginBottom: 20 }]}>Select Event </Text>
                <TouchableOpacity
                    onPress={() => this.setState({ eventType: "Public Functions", eventModalVisible: false })}>
                    <Text style={[styles.textStyle, { fontWeight: '300', fontStyle: 'italic' }]}>Public Functions</Text>
                </TouchableOpacity>
                <View style={[styles.divider, { marginVertical: 10 }]} />
                <TouchableOpacity
                    onPress={() => this.setState({ eventType: "Pet Dates", eventModalVisible: false })}>
                    <Text style={[styles.textStyle, { fontWeight: '300', fontStyle: 'italic' }]}>Pet Dates</Text>
                </TouchableOpacity>
                <View style={[styles.divider, { marginVertical: 10 }]} />
                <TouchableOpacity
                    onPress={() => this.setState({ eventType: "Pet Training", eventModalVisible: false })}>
                    <Text style={[styles.textStyle, { fontWeight: '300', fontStyle: 'italic' }]}>Pet Training</Text>
                </TouchableOpacity>
                <View style={[styles.divider, { marginVertical: 10 }]} />
                <TouchableOpacity
                    onPress={() => this.setState({ eventType: "Pet Fostering", eventModalVisible: false })}>
                    <Text style={[styles.textStyle, { fontWeight: '300', fontStyle: 'italic' }]}>Pet Fostering</Text>
                </TouchableOpacity>
                <View style={[styles.divider, { marginVertical: 10 }]} />
                <TouchableOpacity
                    onPress={() => this.setState({ showEventTextInput: true, eventModalVisible: false })}>
                    <Text style={[styles.textStyle, { fontWeight: '300', fontStyle: 'italic' }]}>Custom</Text>
                </TouchableOpacity>
            </View>
        )
    }

    removeCoverImage() {
        this.setState({ eventCoverImage: null, renderCoverImage: false })
    }

    async uploadData() {
        const {
            eventTitle,
            eventType,
            eventDate,
            eventEndTime,
            eventStartTime,
            privateSwitchIsOn,
            locationData,
            eventDescription,
            eventCoverImage
        } = this.state;

        if (eventTitle === "" || eventDate === "01-01-2018" || locationData.length == 0) {
            alert("Sorry, Can't Create Event");
            return null
        } else {
            let data = new FormData();
            data.append("ownerId", LoggedUserCredentials.getOwnerId());
            data.append("ownerName", LoggedUserCredentials.getOwnerName());
            data.append("eventTitle", eventTitle || "");
            data.append("eventType", eventType || "");
            data.append("eventDate", eventDate || "");
            data.append("eventStartTime", this.formatTime(eventStartTime) || "");
            data.append("eventEndTime", this.formatTime(eventEndTime) || "");
            data.append("isPrivate", privateSwitchIsOn);
            data.append("eventLocationName", locationData.name || "");
            data.append("eventLocationAddress", locationData.address || "");
            data.append("eventLocationLat", locationData.latitude || "");
            data.append("eventLocationLng", locationData.longitude || "");
            data.append("eventDescription", eventDescription || "");

            if (eventCoverImage) {
                data.append('media', {
                    uri: eventCoverImage.path,
                    type: eventCoverImage.mime,
                    name: 'media' + '.' + eventCoverImage.mime.split('/')[1]
                });
            } else {
                data.append('media', null);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/mixed',
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
                },
                method: 'POST',
                body: data
            }
            try {
                this.setState({ showActivityIndicator: true });
                let res = await futch(eventUrl, config);
                console.log(res);
                if (res) {
                    this.setState({ showActivityIndicator: false });
                    this.props.navigation.state.params.refreshEventList();
                    this.props.navigation.navigate("EventsList");
                } else {
                    this.setState({ showActivityIndicator: false })
                    alert("Sorry, can not upload the post");
                }
            } catch (error) {
                alert("Sorry, Can't upload the post");
                this.setState({ showActivityIndicator: false })
            }
        }
    }

    render() {
        const {
            eventTitle,
            showActivityIndicator,
            eventCoverImage,
            eventType,
            locationData,
            eventDescription,
            renderCoverImage,
            eventDate
        } = this.state;
        return (
            <ImageBackground
                style={styles.imgBack}
                source={require('../../assets/images/background.jpg')}>
                {
                    showActivityIndicator ?
                        <ActivityIndicator size='large' color='#ECC951' style={{ alignSelf: 'center' }} />
                        :
                        <ScrollView keyboardShouldPersistTaps='always'
                            style={{ backgroundColor: 'rgba(25, 30, 31,0.5)' }}>
                            <View style={styles.imgCover}>
                                <TouchableOpacity onPress={() => this.renderEventCover()}>
                                    {
                                        renderCoverImage ?
                                            <Image source={{ uri: eventCoverImage.path }}
                                                style={styles.coverImagStyle} />
                                            :
                                            <View>
                                                <FIcons name="image"
                                                    style={{ color: '#ECC951', fontSize: 60, alignSelf: 'center' }} />
                                                <Text style={{ color: '#fff', margin: 10 }}>Event Cover Picture</Text>
                                            </View>
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderWidth: 1, borderColor: '#ECC951', borderRadius: 7, paddingVertical: 7 }}>
                                <Text style={styles.textStyle}>Event Title</Text>
                                <TextInput placeholder="Enter Event Title"
                                    placeholderTextColor="grey"
                                    underlineColorAndroid="transparent"
                                    style={styles.textInputStyle}
                                    onChangeText={(value) => this.setState({ eventTitle: value })}
                                    value={eventTitle} />
                                <View style={styles.divider} />

                                <Text style={styles.textStyle}>Event Type</Text>
                                {
                                    this.state.showEventTextInput ?
                                        <TextInput placeholder="Enter Event Type"
                                            placeholderTextColor="grey"
                                            underlineColorAndroid="transparent"
                                            autoFocus={true}
                                            style={styles.textInputStyle}
                                            onChangeText={(value) => this.setState({ eventType: value })}
                                        />
                                        :
                                        <TouchableOpacity
                                            onPress={() => this.setState({ eventModalVisible: true })}
                                            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={eventType === 'Enter Event Type' ?
                                                { color: 'grey', margin: 10 }
                                                :
                                                { color: '#fff', margin: 10 }}>{eventType}</Text>
                                            <Icons name="chevron-right" style={{ color: '#ECC951', margin: 10, fontSize: 25 }} />
                                        </TouchableOpacity>
                                }
                                <View style={styles.divider} />

                                <Text style={styles.textStyle}>Event Date</Text>
                                <TouchableOpacity>
                                    <DatePicker
                                        style={{ marginLeft: 5, alignSelf: 'flex-start' }}
                                        date={eventDate}
                                        mode="date"
                                        placeholder="Select Event Date"
                                        format="DD-MM-YYYY"
                                        androidMode='calendar'
                                        minDate={today}
                                        maxDate="01-01-2020"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        showIcon={false}
                                        customStyles={{
                                            dateInput: {
                                                borderWidth: 0,
                                            },
                                            dateText: {
                                                color: eventDate === "01-01-2018" ? "grey" : "#fff",
                                                marginLeft: 5,
                                                alignSelf: 'flex-start'
                                            }
                                        }}
                                        onDateChange={(date) => { this.setState({ eventDate: date }) }}
                                    />
                                </TouchableOpacity>
                                <View style={styles.divider} />

                                <Text style={styles.textStyle}>Event Time</Text>
                                {this.renderTime()}
                                <View style={styles.divider} />

                                <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                                    <View style={{ flexDirection: 'row', marginRight: 10 }}>
                                        <Text style={styles.textStyle}>Private</Text>
                                        <Switch
                                            onValueChange={value => this.setState({ privateSwitchIsOn: value })}
                                            value={this.state.privateSwitchIsOn}
                                            tintColor="#fff"
                                            onTintColor="yellow"
                                            style={{ marginLeft: 10 }} />
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={styles.textStyle}>Public</Text>
                                        <Switch
                                            onValueChange={value => this.setState({ privateSwitchIsOn: !value })}
                                            value={!this.state.privateSwitchIsOn}
                                            tintColor="#fff"
                                            onTintColor="yellow"
                                            style={{ marginLeft: 10 }} />
                                    </View>
                                </View>
                                <View style={styles.divider} />

                                <Text style={styles.textStyle}>Tag Location</Text>
                                <TouchableOpacity
                                    onPress={() => this.renderAutoCompleteModal()}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {
                                        locationData.length == 0 ?
                                            <Text style={{ color: 'grey', margin: 10 }}>Select a Location</Text>
                                            :
                                            <Text style={{ color: '#fff', margin: 10 }}> {locationData.name} {locationData.address}</Text>
                                    }
                                </TouchableOpacity>
                            </View>

                            <View style={[styles.borderColorStyle, { padding: 0, marginTop: 5, minHeight: 100, backgroundColor: 'rgba(25, 30, 31,0.5)' }]}>
                                <TextInput placeholder="Describe the event"
                                    placeholderTextColor="grey"
                                    underlineColorAndroid="transparent"
                                    multiline={true}
                                    style={[styles.textInputStyle, { fontSize: 16, fontWeight: '400' }]}
                                    onChangeText={(value) => this.setState({ eventDescription: value })}
                                    value={eventDescription} />
                            </View>

                            <TouchableOpacity onPress={() => this.uploadData()}
                                style={{ borderWidth: 1, borderColor: '#ECC951', margin: 5, marginVertical: 20, padding: 10, alignItems: 'center', backgroundColor: 'rgba(25, 30, 31,0.5)' }}>
                                <Text style={styles.textStyle}>Create Event</Text>
                            </TouchableOpacity>
                        </ScrollView>
                }
                {/* Modal for event type */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.eventModalVisible}
                    onRequestClose={() => {
                        this.setState({ eventModalVisible: false })
                    }}>
                    <View style={styles.modalStyle}>
                        {this.renderEventType()}
                    </View>
                </Modal>

            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#fff',
        marginLeft: 10
    },
    textInputStyle: {
        color: '#fff',
        marginLeft: 6,
        fontSize: 14
    },
    divider: {
        borderTopWidth: 1,
        borderTopColor: '#ECC951',
        marginHorizontal: 10,
        marginBottom: 5
    },
    borderColorStyle: {
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 10,
        padding: 20,
    },
    modalStyle: {
        flex: 1,
        backgroundColor: '#191e1f',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgBack: {
        flex: 1,
        width: null,
        height: null,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgCover: {
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        minWidth: 220,
        minHeight: 200,
        marginVertical: 10,
        overflow: 'hidden',
    },
    coverImagStyle: {
        width: 280,
        height: 250,
        // borderWidth: 1,
        // borderColor: '#ECC951',
        overflow: 'hidden',
        resizeMode: 'stretch',
    }
})

