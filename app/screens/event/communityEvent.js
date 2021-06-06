import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
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

export class CommunityEvent extends PureComponent {
    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this);
        this.onRefresh = this.onRefresh.bind(this);

        this.state = {
            events: [],
            eventsLoading: false,
            showReloadPage: false,
            refreshing: false,
            viewHeight: null,
            postHeight: null
        }
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        this.setState({ eventsLoading: true }, () => this.getData());
    }

    tabChange(event) {
        const { postHeight } = this.state
        if (event.ref.props.tabLabel === "Event Detail") {
            this.setState({ viewHeight: 350 })
        } else {
            if (postHeight !== 10) {
                this.setState({ viewHeight: postHeight })
            }
        }
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
                this.setState({ events: resJson, eventsLoading: false, showReloadPage: false });
            })
            .catch(err => this.setState({ showReloadPage: true }));
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getData();
        this.setState({ refreshing: false });
    }

    goToPostList(eventId) {
        this.props.goToPostList(eventId);
    }

    goToProfile(ownerId) {
        this.props.goToProfile(ownerId)
    }

    _renderItem = (eachEvent) => {
        const event = eachEvent.item;
        return (
            <EventItem
                goToPostList={(eventId) => this.goToPostList(eventId)}
                event={event}
                {...this.props}
            />
        )
    }

    renderNoEvents() {
        return (
            <TouchableOpacity onPress={() => this.getData()}
                style={styles.centerLoading}>
                <Icon name="feed" size={50} style={{ color: '#fff' }} />
                <RkText style={{ color: '#fff' }}>No events to show !</RkText>
                <RkText style={{ color: '#fff' }}>Create your event.</RkText>
            </TouchableOpacity>
        )
    }

    _keyExtractor = (item, index) => item.eventId;

    render() {
        const {
            events,
            eventsLoading,
            refreshing,
            showReloadPage
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
                                style={{ paddingVertical: 8 }}
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                            />
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
