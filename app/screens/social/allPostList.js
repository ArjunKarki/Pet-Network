import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    BackHandler
} from 'react-native';

import {
    RkText,
    RkButton,
} from 'react-native-ui-kitten';
//"socket.io-client": "^2.2.0"
//import io from 'socket.io-client/dist/socket.io';
//import jwt_decode from 'jwt-decode';

import FIcon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation';
import Toast from 'react-native-another-toast';

import { baseUrl } from '../../utils/globle';
import { scale } from '../../utils/scale';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { PostItem } from './postItem';
import { Color } from '../../utils/color';

export class AllPostList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //initial datas
            posts: [],
            //flags to show loading sign
            postsLoading: false,
            refreshing: false,
            //flag to show reload page
            showReloadPage: false,
            totalPages: 1,
            page: 1,
            showToast: false,
            ssePosts: []
        };

        //this.socket = io(baseUrl + '/all_posts');
    }

    scrollToTop(post) {
        
        if (post) {
            const uploadedPost = [post];
            this.setState(prevState =>
                (
                    { posts: [...uploadedPost, ...prevState.posts] }
                )
            );

            if (this.state.posts.length > 0) {
                // this.flatListRef.scrollToIndex({ animated: true, index: 0 });
                this.flatListRef.scrollToOffset({ x: 0, y: 0, animated: true })
            }
        }
    }

    showToast = (feed) => {
        if (feed) {
            if (LoggedUserCredentials.getUserId() !== feed.owner._id) {
                this.setState({ ssePosts: [feed], showToast: true });
            }
        }
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        
        //this.subscribeToIO();
        this.setState({ postsLoading: true }, () => this.getData());
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    // subscribeToIO() {
    //     this.socket.on('post::created', this.showToast);
    // }

    componentWillUnmount() {
        //this.socket.off('post::created');
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    getData() {

        const { page, posts } = this.state;
        console.log("getting all postlist data......")
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }

        const url = baseUrl + '/posts/getAllPosts?page=' + page;
        //let res = await fetch(url, config);
        fetch(url, config)
            .then(res => res.json())
            .then(resJson => {
               
                this.setState(
                    {
                        posts: page === 1 ? resJson.docs : [...posts, ...resJson.docs],
                        totalPages: resJson.pages,
                        postsLoading: false,
                        showReloadPage: false,
                        refreshing: false
                    }
                );
            })
            .catch(err => this.setState({
                showReloadPage: true,
                refreshing: false
            }));
    }

    handleLoadMore = () => {
        const { page, totalPages } = this.state;
        // check if the current page reaches the last page
        console.log("handle load more")
        if (page < totalPages) {
            this.setState({ page: page + 1 }, () => this.getData());
        }
    }

    handleBackPress = () => {
        const { page } = this.state;

        if (page === 1) {
            return false;
        } else {
            this._onRefresh();
            //this.flatListRef.scrollToIndex({ animated: true, index: 0 });
            this.flatListRef.scrollToOffset({ x: 0, y: 0, animated: true });
            return true;
        }
    }

    _keyExtractor = (post, index) => post._id + index;

    navigate(route) {
        const { navigate } = this.props.navigation;

        switch (route) {
            case 'btn_upload_post': navigate('PostUpload', { 'updatePost': (post) => this.scrollToTop(post) });
                break;
        }
    }

    _onRefresh = () => {
        this.setState({ refreshing: true, page: 1, totalPages: 1 }, () => this.getData());
    }

    _renderItem = (eachPost) => {
        const post = eachPost.item;

        return (
            <PostItem feed={post} {...this.props} />
        )
    }

    onToastTap = () => {
        const { ssePosts, posts } = this.state;
        this.setState({ posts: [...ssePosts, ...posts], showToast: false }, () => this.toast.closeToast());
        if (posts.length > 0) {
            this.flatListRef.scrollToIndex({ animated: true, index: 0 });
        }
    }

    onClose = () => {
        this.setState({ showToast: false });
    }

    renderNoFeeds() {
        return (
            <View style={styles.centerLoading}>
                <FIcon name="feed" size={scale(50)} style={{ color: '#fff' }} />
                <RkText style={{ color: '#fff' }}>No posts to show !</RkText>
                <RkText style={{ color: '#fff' }}>Please add your lovely pet posts.</RkText>
                <RkButton
                    style={{ flexDirection: 'row', backgroundColor: '#ECC951', marginTop: scale(10) }}
                    onPress={() => this.navigate('btn_upload_post')}
                >
                    <Text style={{ color: '#191e1f' }}>Add Post</Text>
                </RkButton>
            </View>
        )
    }

    _renderFooter = () => {
        const { page, totalPages } = this.state;

        if (page === totalPages) return null;

        return (
            <View style={{ flex: 1 }}>
                <ActivityIndicator size='large' color='#ECC951' />
            </View>
        );
    }

    tapToRetryBtnPress() {
        this.setState({ postsLoading: true, showReloadPage: false });
        setTimeout(() => this.getData(), 1000);
    }

    setListRef = (ref) => {
        this.flatListRef = ref;
    };

    render() {
        const {
            posts,
            postsLoading,
            refreshing,
            showReloadPage,
            showToast
        } = this.state;

        if (showReloadPage) {
            return (
                <RkButton
                    rkType='clear'
                    onPress={() => this.tapToRetryBtnPress()}
                    style={styles.centerLoading}
                >
                    <View style={{ alignItems: "center" }}>
                        <FIcon name="wifi" size={scale(50)} color="#fff" />
                        <RkText style={{ color: '#fff' }}>Couldn't Connect To Network !</RkText>
                        <View style={{ flexDirection: 'row', marginTop: scale(7) }}>
                            <FIcon name="refresh" size={scale(15)} color="#fff" />
                            <Text style={{ color: '#fff', marginLeft: scale(5) }}>Tap to Retry</Text>
                        </View>
                    </View>
                </RkButton>
            )
        }


        return (
            <View style={{ flex: 1 }} >
                {
                    !postsLoading ?
                        posts && posts.length === 0 ?
                            this.renderNoFeeds()
                            :
                            <FlatList
                                ref={this.setListRef}
                                initialNumToRender={10}
                                data={posts}
                                keyboardShouldPersistTaps="handled"
                                keyboardDismissMode="on-drag"
                                renderItem={this._renderItem}
                                keyExtractor={this._keyExtractor}
                                style={styles.container}
                                refreshing={refreshing}
                                onRefresh={this._onRefresh}
                                ListFooterComponent={this._renderFooter}
                                onEndReached={this.handleLoadMore}
                                onEndReachedThreshold={0.5}
                            />
                        :
                        <View style={styles.centerLoading}>
                            <ActivityIndicator size={scale(50)} color='#ECC951' />
                        </View>
                }
                <Toast
                    ref={ref => this.toast = ref}
                    text='New Posts Available !'
                    showToast={showToast}
                    autoClose={true}
                    autoCloseTimeout={8000}
                    onToastTap={this.onToastTap}
                    onClose={this.onClose}
                />
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
        }
    }
);
