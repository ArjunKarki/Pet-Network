import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    AppState
} from 'react-native';

import {
    RkText,
    RkButton,
} from 'react-native-ui-kitten';

import io from 'socket.io-client/dist/socket.io';
import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation';
import { FloatingAction } from 'react-native-floating-action';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import { scale } from '../../utils/scale';
import { FontAwesome } from '../../assets/icons';
import { AllPostList } from './allPostList';
import { PopularPostList } from './popularPostList';
import { FollowerPostList } from './followerPostList';

import { NotificationService } from '../../utils/service';
import { NotificationModel } from '../../utils/modal/notificationModel';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { baseUrl } from '../../utils/globle';
import { checkResponse } from '../../utils/commonService';

const bgColor = '#191e1f';
const yellowColor = '#ECC951';

export class PostList extends React.PureComponent {

    static navigationOptions = ({ navigation }) => ({
        title: 'Posts',
        headerStyle: {
            backgroundColor: '#191e1f',
            elevation: 0
        },
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerLeft: (
            <RkButton
                rkType='clear'
                contentStyle={{ color: '#ECC951' }}
                style={{ width: 40, marginLeft: scale(8) }}
                onPress={() => navigation.openDrawer()}>
                <RkText rkType='awesome'>{FontAwesome.bars}</RkText>
            </RkButton>
        ),

        headerRight: (
            <View style={{ position: 'relative', height: '100%' }}>

                {
                    navigation.state.params != undefined ?
                        navigation.state.params.hasNoti ?
                            <Text style={styles.badge}></Text>
                            : null
                        : null
                }

                <RkButton
                    rkType='clear'
                    style={{ marginRight: 20, marginTop: 17 }}
                    onPress={() => navigation.state.params.goToNavigationPage()}>
                    <Icon name="bell-o" size={scale(23)} color='#ECC951' />
                </RkButton>
            </View>
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            noti: [],
            followerFeed: null
        };
        this.noti_socket = io(baseUrl + '/all_noties?userId=' + LoggedUserCredentials.getOwnerId());
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        this.subscribeToNotiSocket();
        this.getUnsavedNotis();
        AppState.addEventListener('change', this._handleAppStateChange);
        this.props.navigation.setParams({ hasNoti: LoggedUserCredentials.getNoti(), goToNavigationPage: () => this.goToNavigationPage() });
    }

    _handleAppStateChange = async (nextAppState) => {
        if (nextAppState) {
            const form_data = {
                playerId: LoggedUserCredentials.getPlayerId(),
                status: nextAppState
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
                },
                method: 'POST',
                body: JSON.stringify(form_data)
            }

            const url = baseUrl + '/owners/notifyAppChange/' + LoggedUserCredentials.getOwnerId();


            try {
                const res = await fetch(url, config);
                const status = res.status;
                switch (status) {
                    case 401: {
                        // alert('Something went wrong.Please try later !');
                        break;
                    }
                    case 500: {
                        // alert('Something went wrong.Please try later !');
                        break;
                    }
                    case 200: {
                        break;
                    }
                }
            } catch (err) {
                // alert("Please connect to internet and try again !");
            }
        }
    }

    _onNotiReceived = (data) => {
        console.log("New Noti Received", data)
        LoggedUserCredentials.setNoti(true);
        this.props.navigation.setParams({ hasNoti: true });
        this.saveNoti(data);
    };

    subscribeToNotiSocket() {
        this.noti_socket.on('noti::created', this._onNotiReceived);
    }

    async getUnsavedNotis() {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }

        const url = baseUrl + '/owners/getUnsavedNotis/' + LoggedUserCredentials.getOwnerId();

        try {
            const res = await fetch(url, config);
            const status = res.status;
            switch (status) {
                case 401: {
                    // alert('Something went wrong.Please try later !');
                    break;
                }
                case 500: {
                    // alert('Something went wrong.Please try later !');
                    break;
                }
                case 200: {
                    const resJson = await res.json();
                    console.log("DFFFFFFFFFFFFFFFFfffff",resJson)
                    if (resJson && resJson.length > 0) {
                        this.props.navigation.setParams({ hasNoti: true });
                        LoggedUserCredentials.setNoti(true);
                        for (let eachNoti of resJson) {

                            this.saveNoti(eachNoti);
                        }
                    }
                    break;
                }
            }
        } catch (err) {
            console.log("Error post List", err)
            // alert("Please connect to internet and try again !");
        }
    }

    componentWillUnmount() {

        this.noti_socket.off('noti::created', this._onNotiReceived);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    saveNoti(noti) {
        if (noti) {
            let notiModel = new NotificationModel(noti);
            console.log("notiModal",notiModel)
            NotificationService.save(notiModel);

            const config = {
                headers: {
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
                },
                method: 'POST',
            }

            const url = baseUrl + '/notifications/' + noti._id + '/notifySaved';

            fetch(url, config)
                .then(res => console.log(res))
                // .then(resJson => {
                // })
                .catch(err => console.log(err));
        }else{
            console.log('Undefined save noti')
        }
    }

    goToNavigationPage() {
        this.props.navigation.navigate('Noti');
        this.props.navigation.setParams({ hasNoti: false });
        LoggedUserCredentials.setNoti(false);
    }

    navigate(route) {
        const { navigate } = this.props.navigation;
        switch (route) {
            case 'btn_upload_post': navigate('PostUpload', { 'updatePost': (post) => this.updatePost(post) });
                break;
            case 'btn_upload_article': navigate('ArticleUpload');
                break;
        }
    }

    updatePost(post) {
        this.refs.scrollTabView.goToPage(1);
        this.refs.allPostRef.scrollToTop(post);
    }

    render() {
        const actions = [
            {
                color: '#ECC951',
                text: 'Upload Post',
                icon: (<Icon name='upload' size={scale(18)} color='#191e1f' />),
                name: 'btn_upload_post',
                position: 1
            },
            {
                color: '#ECC951',
                text: 'Upload Article',
                icon: (<Icon name='upload' size={scale(18)} color='#191e1f' />),
                name: 'btn_upload_article',
                position: 2
            }
        ];

        return (
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.imgBackground}
            >
                <ScrollableTabView
                    ref="scrollTabView"
                    initialPage={1}
                    tabBarBackgroundColor='#191e1f'
                    tabBarActiveTextColor='#ECC951'
                    tabBarInactiveTextColor='#ffffff'
                    tabBarUnderlineStyle={{ backgroundColor: '#ECC951' }}
                >
                    <PopularPostList
                        ref="popularPostRef"
                        tabLabel='Popular Posts'
                        {...this.props}
                    />
                    <AllPostList
                        ref="allPostRef"
                        tabLabel='All Posts'
                        {...this.props}
                    />
                    <FollowerPostList
                        ref="followerPostRef"
                        tabLabel='Follower Posts'
                        ssePost={this.state.followerFeed}
                        {...this.props}
                    />
                </ScrollableTabView>
                <FloatingAction
                    actions={actions}
                    color='#ECC951'
                    distanceToEdge={scale(15)}
                    floatingIcon={<Icon name='plus' size={scale(17)} color='#191e1f' />}
                    onPressItem={
                        (name) => this.navigate(name)
                    }
                />
            </ImageBackground>
        )
    }
}

let styles = StyleSheet.create(
    {
        imgBackground: {
            flex: 1,
            width: null,
            height: null
        },
        badge: {
            width: scale(10),
            height: scale(10),
            color: '#fff',
            textAlign: 'center',
            textAlignVertical: 'center',
            position: 'absolute',
            zIndex: 10,
            bottom: 32,
            right: 17,
            padding: scale(2),
            backgroundColor: 'red',
            borderRadius: scale(10 / 2)
        }
    }
);
