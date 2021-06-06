import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList
} from 'react-native';

import {
    RkText,
    RkButton,
} from 'react-native-ui-kitten';

import {
    SocialBar,
    TimeAgo
} from '../../components';

import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation';

import { checkResponse } from '../../utils/commonService';
import { feedUrl, baseUrl } from '../../utils/globle';
import { scale } from '../../utils/scale';
import { FontAwesome } from '../../assets/icons';
import { PostItem } from '../social/postItem';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

const bgColor = '#191e1f';
const yellowColor = '#ECC951';

export class Feed extends React.PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: 'Posts',
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
                onPress={() => { navigation.openDrawer() }}>
                <RkText rkType='awesome'>{FontAwesome.bars}</RkText>
            </RkButton>
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            //selected feed id
            feedId: null,
            //initial datas
            feeds: [],
            //flags to show loading sign
            feedsLoading: true,
            refreshing: false,
            footerLoading: false,
            //flag to show reload page
            showReloadPage: false,
            //different modals
            photoModalVisible: false,
            videoModalVisible: false,
            replyModalVisible: false,
            //media(video or image) path 
            mediaPaths: [],
            videoPath: null,
            selectedMediaIndex: null,
            page: 1,
            hasNext: null,
            ownerId: props.ownerId
        };
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        //this.getFeedData(this.state.ownerId);
        console.log(this.props.navigation);
    }

    getFeedData(ownerId) {

        this.setState({ ownerId: ownerId, feedsLoading: true });
        console.log("Geeting Feed ......", ownerId)
        const { page } = this.state;

        const form_data = {
            ownerId: ownerId
        }

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
            body: JSON.stringify(form_data)
        }

        const url = baseUrl + "/posts/getOwnerPosts?page=" + page;

        fetch(url, config)
            .then(res => checkResponse(res, url, config).json())
            .then(resJson => {
                console.log('feed....', resJson)
                this.setState({
                    feeds: page === 1 ? resJson.docs : [...this.state.feeds, ...resJson.docs],
                    hasNext:resJson.pages > page,
                    feedsLoading: false,
                    showReloadPage: false,
                    refreshing: false,
                    footerLoading: false
                });
            })
            .catch(err => this.setState({
                showReloadPage: true,
                refreshing: false,
                footerLoading: false
            }));
    }

    _keyExtractor(feed) {
        if (feed) {
            return feed.feedId;
        }
    }

    handleLoadMore = () => {
        const { hasNext, ownerId } = this.state;
        if (hasNext) {
            this.setState({ page: this.state.page + 1, footerLoading: true }, () => this.getFeedData(ownerId));
        }
    }

    renderFooterComponent() {
        const { footerLoading } = this.state;
        if (footerLoading) {
            return (
                <View>
                    <ActivityIndicator animating size='large' color='#ECC951' />
                </View>
            )
        } else return null;
    }

    tapToRetryBtnPress() {
        this.setState({ feedsLoading: true, showReloadPage: false });
        setTimeout(() => this.getFeedData(this.state.ownerId), 1000);
    }

    navigate(route) {
        const { navigate } = this.props.navigation;
        switch (route) {
            case 'btn_upload_post': navigate('PostUpload', { 'refresh': () => this.getFeedData(this.state.ownerId) });
                break;
        }
    }

    renderNoFeeds() {
        return (
            <View style={styles.centerLoading}>
                <Icon name="feed" size={50} style={{ color: '#fff' }} />
                <RkText style={{ color: '#fff' }}>No posts to show !</RkText>
            </View>
        )
    }

    onRefresh = () => {
        this.setState({ refreshing: true, page: 1 });
        this.getFeedData(this.state.ownerId);
        this.setState({ refreshing: false });
    }

    goToProfile(ownerId) {
        this.props.refreshOwnerProfile(ownerId);
        this.props.refreshPetList(ownerId);
        this.props.navigation.navigate("MainOwnerProfile", { "ownerId": ownerId });
    }

    _renderItem = (eachFeed) => {
        const feed = eachFeed.item;
        return (
            <PostItem
                goToProfile={(id) => { this.goToProfile(id) }}
                feed={feed}
                from="ownerProfile"
                isTouchable={false}
                {...this.props}
            />
        )
    }

    render() {
        const {
            feeds,
            feedsLoading,
            refreshing,
            showReloadPage,
        } = this.state;

        if (showReloadPage) {
            return (
                <RkButton
                    rkType='clear'
                    onPress={() => this.tapToRetryBtnPress()}
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
            <View style={{ flex: 1 }} >
                {
                    !feedsLoading ?
                        feeds && feeds.length === 0 ?
                            this.renderNoFeeds()
                            :
                            <FlatList
                                data={feeds}
                                renderItem={this._renderItem.bind(this)}
                                keyExtractor={this._keyExtractor}
                                style={styles.container}
                                keyboardShouldPersistTaps="handled"
                                keyboardDismissMode="on-drag"
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                                ListFooterComponent={() => this.renderFooterComponent()}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={0.5}
                            />
                        :
                        <View style={styles.centerLoading}>
                            <ActivityIndicator size={40} color='#ECC951' />
                        </View>
                }
            </View>
        )
    }
}

let styles = StyleSheet.create(
    {
        centerLoading: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        container: {
            paddingVertical: 8
        },
    }
);
