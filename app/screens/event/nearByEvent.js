import React, { PureComponent } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    ImageBackground,
    ActivityIndicator,
    PermissionsAndroid,
    Platform,
    Text
} from 'react-native';
import { RkText, RkButton } from 'react-native-ui-kitten';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNGooglePlaces from 'react-native-google-places';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import geolib from 'geolib'
import { EventItem } from './eventItem';
import { eventUrl } from '../../utils/globle';
import { checkResponse } from '../../utils/commonService';
import { scale } from '../../utils/scale';

export class NearByEvent extends PureComponent {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.renderNoEvents = this.renderNoEvents.bind(this);
        this.renderData = this.renderData.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.state = {
            events: [],
            eventsLoading: false,
            refreshing: false,
            latitude: 0,
            longitude: 0,
            hasLocationPermission: false
        };

        this.requestPermission = this.requestPermission.bind(this);
    }



    requestPermission() {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(result => {
                if (result === PermissionsAndroid.RESULTS.GRANTED) {
                    this.setState({ hasLocationPermission: true, eventsLoading: true, }, () => { this.getData() });
                    RNGooglePlaces.getCurrentPlace()
                        .then((results) =>
                            this.setState({
                                latitude: results[0].latitude,
                                longitude: results[0].longitude
                            })
                        ).catch((error) => console.log(error.message));
                } else {
                    this.setState({ hasLocationPermission: false });
                }
            })
    }

    componentDidMount() {
        this.requestPermission();
    }


    getData() {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }

        fetch(eventUrl, config)
            .then(res => checkResponse(res, eventUrl, config).json())
            .then(resJson => {
                let reversedArray = resJson.reverse();
                this.setState({ events: resJson, eventsLoading: false });
            }).catch(err => console.log(err));
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getData();
        this.setState({ refreshing: false });
    }

    createPost(eventId) {
        this.props.goToCreatePost(eventId);
    }

    goToProfile(ownerId) {
        this.props.goToProfile(ownerId)
    }

    renderData = () => {
        const { events, latitude, longitude } = this.state;
        const data = [];
        let temp = [];
        let nearestEvent = [];

        const cloest = events.map((eachEvent) => {
            const lat = eachEvent.eventLocationLat;
            const lng = eachEvent.eventLocationLng;
            const id = eachEvent.eventId;
            const coord = { lat, lng };
            const current = { latitude, longitude };
            return data.push({ coord, dist: geolib.getDistance(current, coord), id: id });
        });

        data.sort((a, b) => a.dist - b.dist)
            .map((each) => {
                events.map((eachEvent) => {
                    if (each.coord.lat === eachEvent.eventLocationLat && each.coord.lng === eachEvent.eventLocationLng) {
                        temp.push(eachEvent);
                    }
                })
            });

        nearestEvent = temp.filter(function (val, ind) { return temp.indexOf(val) == ind; })

        return (
            this.renderFLatList(nearestEvent)
        )
    }

    renderFLatList(nearestEvent) {
        return (
            <FlatList
                data={nearestEvent}
                //extraData={this.state}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                style={{ paddingVertical: 8 }}
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
            />
        )
    }

    _keyExtractor = (item, index) => item.eventId;

    _renderItem = (eachEvent) => {
        const event = eachEvent.item;
        return (
            <EventItem event={event}
                {...this.props} />
        )
    }

    renderNoEvents = () => {
        return (
            <TouchableOpacity style={styles.centerLoading} onPress={() => this.getData()}>
                <Icon name="feed" size={50} style={{ color: '#fff' }} />
                <RkText style={{ color: '#fff' }}>No events to show !</RkText>
                <RkText style={{ color: '#fff' }}>Create your event.</RkText>
            </TouchableOpacity>
        )
    }

    renderNoPermission = () => {
        return (
            <View style={styles.centerLoading}>
                <RkText style={{ color: '#fff' }}>You don't have location permission.</RkText>
                <TouchableOpacity
                    style={{ backgroundColor: '#ECC951', marginTop: scale(10), padding: scale(10) }}
                    onPress={this.requestPermission}
                >
                    <Text style={{ color: '#191e1f' }}>Request Permission</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { events, eventsLoading, hasLocationPermission } = this.state;
        return (
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.imgBackground} >
                {
                    !hasLocationPermission ?
                        this.renderNoPermission()
                        :
                        !eventsLoading ?
                            events.length === 0 ?
                                this.renderNoEvents()
                                :
                                this.renderData()
                            :
                            <View style={styles.centerLoading}>
                                <ActivityIndicator size={50} color='#ECC951' />
                            </View>
                }

            </ImageBackground>)
    }
}
const styles = StyleSheet.create({
    imgBackground: {
        flex: 1,
        width: null,
        height: null
    },
    centerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

})
