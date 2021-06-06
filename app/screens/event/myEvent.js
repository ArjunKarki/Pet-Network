import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    RefreshControl,
    TouchableOpacity,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import {
    RkButton,
    RkText
} from 'react-native-ui-kitten';
import { eventUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import Orientation from 'react-native-orientation';
import { checkResponse } from '../../utils/commonService';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale } from '../../utils/scale';
import { EventItem } from './eventItem';

export class MyEvent extends PureComponent {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.state = {
            events: [],
            eventsLoading: false,
            showReloadPage: false,
            refreshing: false
        }
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        this.setState({ eventsLoading: true }, () => this.getData());
    }

    getData() {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }
        let ownerId = LoggedUserCredentials.getOwnerId();
        const path = eventUrl + "/" + ownerId

        fetch(path, config)
            .then(res => checkResponse(res, path, config).json())
            .then(resJson => {
                let reversedArray = resJson.reverse();
                this.setState({ events: resJson, eventsLoading: false, showReloadPage: false });
            })
            .catch(err => this.setState({ showReloadPage: true }));
    }

    onRefresh() {
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

    _renderItem = (eachEvent) => {
        const event = eachEvent.item;
        return (
            <EventItem event={event}
                {...this.props} />
        )
    }

    renderNoEvents() {
        return (
            <TouchableOpacity onPress={() => this.getData()}
                style={styles.centerLoading}>
                <Icon name="feed" size={50} style={{ color: '#fff' }} />
                <RkText style={{ color: '#fff' }}>You haven't created </RkText>
                <RkText style={{ color: '#fff' }}>an event yet.</RkText>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item, index) => item.eventId;

    render() {
        const {
            events,
            eventsLoading,
            refreshing,
            showReloadPage,
        } = this.state;

        if (showReloadPage) {
            return (
                <RkButton
                    rkType='clear'
                    onPress={() => this.getData()}
                    style={styles.centerLoading}
                >
                    <View>
                        <Icon name="wifi" size={50} style={{ marginLeft: scale(28), color: '#fff' }} />
                        <RkText style={{ color: '#fff' }}>Can't Connect !</RkText>
                        <View style={{ flexDirection: 'row', marginLeft: scale(19) }}>
                            <Icon name="refresh" size={15} style={{ lineHeight: scale(20), marginRight: scale(5), color: '#fff' }} />
                            <Text style={{ color: '#fff' }}>Tap to Retry</Text>
                        </View>
                    </View>
                </RkButton>
            )
        }
        return (
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.imgBackground} >
                {
                    !eventsLoading ?
                        events.length === 0 ?
                            this.renderNoEvents()
                            :
                            <FlatList
                                data={events}
                                extraData={this.state}
                                renderItem={this._renderItem}
                                keyExtractor={this._keyExtractor}
                                style={styles.container}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={() => this.onRefresh()}
                                    />
                                } />
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