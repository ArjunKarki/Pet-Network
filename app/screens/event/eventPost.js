import React, { PureComponent } from 'react';
import {
    View,
    TouchableWithoutFeedback,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Text,
    Image,
    Modal,
    ScrollView,
    ActivityIndicator,
    FlatList,
    Dimensions
} from 'react-native';
import { RkButton } from 'react-native-ui-kitten';
import PhotoView from "@merryjs/photo-viewer";
import Video from 'react-native-af-video-player';
import { PostSocialBar } from './eventpost';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import FIcons from 'react-native-vector-icons/Feather';
import EIcons from 'react-native-vector-icons/Entypo';
import { ownerProPicUrl, eventUrl } from '../../utils/globle';
import { scaleVertical } from '../../utils/scale';
import { checkResponse } from '../../utils/commonService';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import ImageScalable from 'react-native-scalable-image';


export class EventPost extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: 'Events Post List',
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
                onPress={() => { navigation.goBack() }}>
                <Icon name="arrow-left" style={{ color: '#ECC951', fontSize: 20 }} />
            </RkButton>
        )
    });

    constructor(props) {
        super(props);
        //this._renderItem = this._renderItem.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.state = {
            eventId: props.navigation.state.params.eventId,
            eventposts: [],
            refreshing: false,
            // media modal
            photoModalVisible: false,
            videoModalVisible: false,
            mediaPaths: [],
            videoPath: null,
            selectedMediaIndex: null,
            loading: false,
            imgHeight: null
        }
    }

    componentDidMount() {
        this.setState({ loading: true }, () => this.getAllPosts());
        this.props.navigation.setParams({ goToNavigationPage: () => this.goToNavigationPage() });
    }

    goToNavigationPage() {
        const { eventId } = this.state;
        this.props.navigation.navigate('CreatePost', {
            eventId,
            "refresh": () => this.onRefresh()
        });
    }

    getAllPosts() {
        const { eventId } = this.state;
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }
        const path = eventUrl + "/eventposts/" + eventId;

        fetch(path, config)
            .then(res => checkResponse(res, path, config).json())
            .then(resJson => {
                let reversedArray = resJson.reverse();
                this.setState({ eventposts: resJson, loading: false });
            }).catch((err) => console.log(err));
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        this.getAllPosts();
        this.setState({ refreshing: false });
    }

    renderMedia(data) {
        let firstMedia = data.media[0];
        if (firstMedia.contentType.startsWith("image/")) {
            return (
                <TouchableWithoutFeedback
                    onPress={() => this.setState({ photoModalVisible: true, mediaPaths: data.media, selectedMediaIndex: data.media.indexOf(data.media[0]) })}>
                    <View>
                        <ImageScalable
                            width={Dimensions.get('window').width}
                            source={{ uri: eventUrl + "/eventposts/media/" + data.media[0].mediaId }}
                        />
                        {
                            data.media.length === 1 ?
                                <View />
                                :
                                <ScrollView horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    style={{ flexDirection: 'row', zIndex: 2, position: 'absolute', right: 2, bottom: 2, backgroundColor: '#fff', borderRadius: 10 }}>
                                    {this.renderAvatars(data.media)}
                                </ScrollView>
                        }
                    </View>
                </TouchableWithoutFeedback>
            )
        } else {
            const placeholderPath = eventUrl + '/eventposts/media/' + data.media[0].mediaId + '/thumbnail';
            const videoPath = eventUrl + '/eventposts/media/' + data.media[0].mediaId;
            return (
                <TouchableWithoutFeedback
                    onPress={() => this.setState({ videoModalVisible: true, videoPath: videoPath })}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }} >
                        <ImageScalable
                            width={Dimensions.get('window').width}
                            source={{ uri: placeholderPath }}
                        />
                        <FIcons name="play-circle"
                            style={{ color: '#fff', fontSize: 50, zIndex: 2, position: 'absolute' }} />
                    </View>
                </TouchableWithoutFeedback>
            )
        }
    }

    _keyExtractor = (item, index) => item.eventPostId;

    _renderItem = (data) => {
        if (data.item !== null) {
            return (
                <View style={styles.card} key={data.eventPostId}>
                    {/* card header  */}
                    < View style={{ flexDirection: 'row', marginBottom: 5, margin: 5 }}>
                        <Image
                            style={styles.avatar}
                            source={{ uri: ownerProPicUrl + '/' + data.item.ownerId }} />
                        <TouchableOpacity>
                            <Text style={{ color: '#fff', marginTop: 17, fontWeight: '500', marginBottom: 5 }}>{data.item.ownerName}</Text>
                        </TouchableOpacity>
                    </View >

                    {/* description of post */}
                    {
                        data.item.description === "null" ?
                            null
                            :
                            <Text style={{ color: '#fff', marginLeft: 10, fontSize: 16, fontWeight: '400', letterSpacing: 2, marginBottom: 5 }}>{data.item.description}</Text>
                    }

                    {/* media  */}
                    {
                        data.item.media.length !== 0 ?
                            this.renderMedia(data.item)
                            :
                            <View />
                    }

                    {/* comments likes share */}
                    <PostSocialBar
                        eventPostLikes={data.item.likes ? data.item.likes : []}
                        eventPostCommentCount={data.item.comments ? data.item.comments.length : 0}
                        eventPostId={data.item.eventPostId}
                    />
                </View>
            )
        }

    }

    renderAvatars = (medias) => {
        let assets = medias.map(media => {
            let mediaPath = eventUrl + '/eventposts/media/' + media.mediaId;
            if (media.contentType.startsWith('image/')) {
                return (
                    <TouchableOpacity
                        key={media.mediaId}
                        onPress={() => this.setState({ photoModalVisible: true, mediaPaths: medias, selectedMediaIndex: medias.indexOf(media) })}>
                        <Image
                            source={{ uri: mediaPath }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                overflow: 'hidden',
                                margin: 3
                            }} />
                    </TouchableOpacity>
                )
            } else {
                let thumbnail = eventUrl + "/eventposts/media/" + media.mediaId + "/thumbnail";
                let videoPath = eventUrl + "/eventposts/media/" + media.mediaId;
                return (
                    <TouchableOpacity
                        key={medias.mediaId}
                        style={{ alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.setState({ videoModalVisible: true, videoPath: videoPath })}>
                        <Image
                            source={{ uri: thumbnail }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                overflow: 'hidden',
                                margin: 3
                            }} />
                        <Icon name='play' size={20}
                            style={{ color: '#fff', zIndex: 2, position: 'absolute', alignSelf: 'center' }} />
                    </TouchableOpacity>
                )
            }
        })
        return assets;
    }

    render() {
        const {
            refreshing,
            loading,
            eventposts,
            photoModalVisible,
            videoModalVisible,
            mediaPaths,
            videoPath,
            selectedMediaIndex
        } = this.state;

        let paths = [];
        if (mediaPaths) {
            paths = mediaPaths.map(path => {
                return { source: { uri: eventUrl + '/eventposts/media/' + path.mediaId } };
            })
        }
        return (
            <ImageBackground
                style={styles.imgBack}
                source={require('../../assets/images/background.jpg')} >
                {
                    !loading ?
                        eventposts.length === 0 ?
                            <View style={styles.centerLoading}>
                                <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>No Event Post Available!</Text>
                            </View>
                            :
                            <FlatList
                                data={eventposts}
                                extraData={this.state}
                                renderItem={this._renderItem}
                                keyExtractor={this._keyExtractor}
                                refreshing={refreshing}
                                onRefresh={this.onRefresh}
                                contentContainerStyle={{ marginVertical: 10, paddingBottom: 15 }}
                            />
                        :
                        <View style={styles.centerLoading}>
                            <ActivityIndicator size={30} color='#ECC951' />
                        </View>
                }

                <TouchableOpacity
                    onPress={() => this.props.navigation.state.params.goToNavigationPage()}
                    style={styles.fabBtn}>
                    <EIcons name="plus" style={{ color: '#ECC951', fontSize: 30, margin: 5 }} />
                </TouchableOpacity>

                {/* photo view modal */}
                <PhotoView
                    visible={photoModalVisible}
                    data={paths}
                    hideStatusBar={false}
                    hideCloseButton={true}
                    hideShareButton={true}
                    initial={selectedMediaIndex || 0}
                    onDismiss={e => {
                        this.setState({ photoModalVisible: false });
                    }} />

                {/* video modal */}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={videoModalVisible}
                    onRequestClose={() => this.setState({ videoModalVisible: false })}>
                    <View style={styles.videoContainer} >
                        <Video
                            url={videoPath}
                            autoPlay
                            fullScreenOnly
                            lockPortraitOnFsExit
                        />
                    </View>
                </Modal>
            </ImageBackground >
        )
    }
}

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        resizeMode: 'contain',
        overflow: 'hidden',
        margin: 5,
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#191e1f',
        paddingBottom: scaleVertical(25)
    },
    card: {
        borderRadius: 5,
        marginVertical: 3,
        marginHorizontal: 5,
        borderWidth: 0.5,
        borderColor: '#42413e',
        elevation: 2,
        backgroundColor: '#191e1f'
    },
    centerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgBack: {
        flex: 1,
        width: null,
        height: null
    },
    paginationStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginRight: 15
    },
    activeDot: {
        backgroundColor: '#ECC951',
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    dot: {
        backgroundColor: '#191e1f',
        width: 5,
        height: 5,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    fabBtn: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 60,
        height: 60,
        backgroundColor: '#191e1f',
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    }
});