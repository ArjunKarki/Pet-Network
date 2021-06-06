import React, { PureComponent } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Modal,
    Text,
    View,
} from 'react-native';
import MapView from 'react-native-maps';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { eventUrl } from '../../utils/globle';

export class EventDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.onGoingPress = this.onGoingPress.bind(this);
        this.onMaybePress = this.onMaybePress.bind(this);
        this.onNoPress = this.onNoPress.bind(this);
        this.state = {
            data: props.data,
            yes: false,
            no: false,
            maybe: false,
            mapVisible: false,
            //are you going
            goingCount: props.data.going.length,
            maybeCount: props.data.maybe.length,
            isGoing: props.data.going.includes(LoggedUserCredentials.getOwnerId()),
            isMayBe: props.data.maybe.includes(LoggedUserCredentials.getOwnerId()),
        }
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    componentDidMount() {
        const { isGoing, isMayBe } = this.state;
        if (isGoing) {
            this.setState({ yes: true })
        } else if (isMayBe) {
            this.setState({ maybe: true })
        } else {
            this.setState({ no: true })
        }
    }

    onGoingPress() {
        const { isGoing, isMayBe, maybeCount, goingCount } = this.state;
        if (isGoing) {
            if (isMayBe) {
                this.setState({ maybeCount: maybeCount - 1, isMayBe: false, maybe: false, no: false, yes: false }, () => this.onNotInterest());
            } else {
                this.setState({ goingCount: goingCount - 1, isGoing: false, maybe: false, no: false, yes: false }, () => this.onNotGoing());
            }
        } else {
            if (isMayBe) {
                this.setState({ maybeCount: maybeCount - 1, isMayBe: false, maybe: false, no: false, yes: false }, () => this.onNotInterest());
            } else {
                this.setState({ goingCount: goingCount + 1, isGoing: true, maybe: false, no: false, yes: true }, () => this.onGoing());
            }
        }
    }

    onNoPress() {
        const { isGoing, isMayBe, maybeCount, goingCount } = this.state;
        if (isMayBe) {
            this.setState({ maybeCount: maybeCount - 1, isMayBe: false, maybe: false, no: true, yes: false },
                this.onNotInterest());
        }
        if (isGoing) {
            this.setState({ goingCount: goingCount - 1, isGoing: false, maybe: false, no: true, yes: false },
                this.onNotGoing());
        }
        this.setState({ no: true })
    }

    onMaybePress() {
        const { isGoing, isMayBe, maybeCount, goingCount } = this.state;
        if (isMayBe) {
            if (isGoing) {
                this.setState({ goingCount: goingCount - 1, isGoing: false, maybe: false, no: false, yes: false },
                    this.onNotGoing());
            }
            this.setState({ maybeCount: maybeCount - 1, isMayBe: false, maybe: false, no: false, yes: false },
                this.onNotInterest());
        } else {
            if (isGoing) {
                this.setState({ goingCount: goingCount - 1, isGoing: false, maybe: false, no: false, yes: false },
                    this.onNotGoing());
            }
            this.setState({ maybeCount: maybeCount + 1, isMayBe: true, maybe: true, no: false, yes: false },
                this.onInterest());
        }
    }

    onNotGoing() {
        const { data } = this.state;
        let res = new FormData();
        res.append('ownerId', LoggedUserCredentials.getOwnerId());
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
            body: res
        }
        let notGoingUrl = eventUrl + "/" + data.eventId + "/notgoing";
        fetch(notGoingUrl, config)
            .catch(err => alert("Something went wrong.Please try again later"));
    }

    onGoing() {
        const { data } = this.state;
        let res = new FormData();
        res.append('ownerId', LoggedUserCredentials.getOwnerId());
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
            body: res
        }
        const goingUrl = eventUrl + "/" + data.eventId + "/going"
        fetch(goingUrl, config)
            .catch(err => alert('Something went wrong.Please try later.'));
    }

    onNotInterest() {
        const { data } = this.state;
        let res = new FormData();
        res.append('ownerId', LoggedUserCredentials.getOwnerId());
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
            body: res
        }
        let notInterestUrl = eventUrl + "/" + data.eventId + "/notinterest";
        fetch(notInterestUrl, config)
            .catch(err => alert("Something went wrong.Please try again later"));
    }

    onInterest() {
        const { data } = this.state;
        let res = new FormData();
        res.append('ownerId', LoggedUserCredentials.getOwnerId());
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
            body: res
        }
        const onInterestUrl = eventUrl + "/" + data.eventId + "/interest"
        fetch(onInterestUrl, config)
            .catch(err => alert('Something went wrong.Please try later.'));
    }

    render() {
        const { data, yes, no, maybe } = this.state;
        let latitude = parseFloat(data.eventLocationLat);
        let longitude = parseFloat(data.eventLocationLng);
        return (
            <View style={{ marginTop: 10 }}>
                {/* map view  */}
                <TouchableOpacity onPress={() => this.setState({ mapVisible: true })}
                    style={{ width: undefined, height: 100, marginHorizontal: 5 }}>
                    {
                        latitude && longitude == null ?
                            <Text style={styles.textStyle}>Location Not Available</Text>
                            :
                            <MapView style={styles.map}
                                initialRegion={{
                                    latitude: latitude,
                                    longitude: longitude,
                                    latitudeDelta: 1,
                                    longitudeDelta: 1,
                                }}
                                maxZoomLevel={20}
                                minZoomLevel={15}
                                scrollEnabled={false} >

                                {!!latitude && !!longitude && <MapView.Marker
                                    coordinate={{ "latitude": latitude, "longitude": longitude }}
                                    title={"Event Location"}
                                />}
                            </MapView>
                    }
                </TouchableOpacity>


                {/* are you going */}
                <View style={{ marginVertical: 10, height: 80 }}>
                    <Text style={styles.largeText}>Are you going?</Text>
                    <View style={styles.borderColorStyle}>
                        <TouchableOpacity onPress={this.onGoingPress}
                            style={yes ? styles.btnPressStyle : styles.btnNotPressStyle}>
                            <Text style={[styles.textStyle, { marginHorizontal: 15 }]}>GOING</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={this.onNoPress}
                            style={no ? styles.btnPressStyle : styles.btnNotPressStyle}>
                            <Text style={[styles.textStyle, { marginHorizontal: 20 }]}>NO</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={this.onMaybePress}
                            style={maybe ? styles.btnPressStyle : styles.btnNotPressStyle}>
                            <Text style={[styles.textStyle, { marginHorizontal: 10 }]}>MAY BE</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.state.mapVisible}
                    onRequestClose={() => this.setState({ mapVisible: false })}>
                    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                        <MapView style={styles.map}
                            initialRegion={{
                                latitude: latitude,
                                longitude: longitude,
                                latitudeDelta: 1,
                                longitudeDelta: 1,
                            }}
                            maxZoomLevel={20}
                            minZoomLevel={15}
                            scrollEnabled={true} >

                            {!!latitude && !!longitude && <MapView.Marker
                                coordinate={{ "latitude": latitude, "longitude": longitude }}
                                title={"Event Location"}
                            />}
                        </MapView>
                    </View>
                </Modal>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    textStyle: {
        color: '#ffffff',
        margin: 5,
        flex: 1
    },
    borderColorStyle: {
        height: 40,
        borderWidth: 2,
        borderColor: '#ECC951',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    btnPressStyle: {
        backgroundColor: 'green'
    },
    btnNotPressStyle: {
        backgroundColor: 'black'
    },
    largeText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '500',
        letterSpacing: 2,
        alignSelf: 'center'
    },
    divider: {
        borderRightWidth: 1,
        borderRightColor: '#ECC951'
    }
})
