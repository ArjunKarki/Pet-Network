import React, { PureComponent } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal,
    ScrollView,
    Text
} from 'react-native';

import ImageLoad from 'react-native-image-placeholder';
import FastImage from 'react-native-fast-image';

import {
    SocialBar,
    TimeAgo,
    Tags,
    AutoResizeImage
} from '../../components';

import {
    RkCard,
    RkText,
    RkButton,
} from 'react-native-ui-kitten';

import ReadMore from 'react-native-read-more-text';
import PhotoView from "@merryjs/photo-viewer";
import Video from 'react-native-af-video-player';
import FIcons from 'react-native-vector-icons/Feather';
import PIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { postUrl, baseUrl, ownerProPicUrl } from '../../utils/globle';
import { scaleVertical, scale } from '../../utils/scale';
import Menu, { MenuItem } from 'react-native-material-menu';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

import { Color } from '../../utils/color';

export class PostItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //different modals
            photoModalVisible: false,
            videoModalVisible: false,
            replyModalVisible: false,
            //media(video or image) path 
            mediaPaths: [],
            videoPath: [],
            selectedMediaIndex: null,
            isVisible: true
        }
    }

    _menu = null;

    _renderTruncatedFooter = (handlePress) => {
        return (
            <RkButton rkType='clear' onPress={handlePress}>
                Read more
            </RkButton>
        );
    }

    _renderRevealedFooter = (handlePress) => {
        return (
            <RkButton rkType='clear' onPress={handlePress}>
                Show less
            </RkButton>
        );
    }

    onTagPress = () => {
        console.log('tag pressed');
    }

    renderHashTag(tags) {
        let hashTagArr = [];
        if (tags.length > 0) {
            hashTagArr = tags && tags.map(eachTag => eachTag.hashTagString);
            return (
                <Tags
                    initialTags={hashTagArr}
                    readonly={true}
                    onTagPress={this.onTagPress}
                />
            )
        }
        return (<View />);
    }

    renderAvatars = (medias) => {
        //console.log("medias", medias)
        let assets = medias.map(media => {
            if (media.contentType.startsWith('image/')) {

                let mediaPath = postUrl + '/media/' + media._id;

                return (
                    <TouchableOpacity
                        key={media._id}
                        onPress={() => this.setState({ photoModalVisible: true, mediaPaths: medias, selectedMediaIndex: medias.indexOf(media) })}>
                        <FastImage
                            source={{ uri: mediaPath }}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                overflow: 'hidden',
                                margin: 3,
                            }}
                        />
                    </TouchableOpacity>
                )
            }
        })
        return assets;
    }

    renderMedia(feed) {
        let firstMedia = feed.media[0];

        if (firstMedia.contentType.startsWith("video/")) {
            const placeholderPath = postUrl + '/media/' + feed.media[0]._id + '/thumbnail';
            const videoPath = postUrl + '/stream/' + firstMedia._id;
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        this.setState(
                            {
                                videoModalVisible: true,
                                videoPath: videoPath
                            }
                        );
                        //console.log(videoPath);
                    }
                    }
                >
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <AutoResizeImage
                            width={Dimensions.get('window').width}
                            source={{ uri: placeholderPath }}
                        />
                        <FIcons
                            name="play-circle"
                            style={{ color: '#fff', fontSize: 50, zIndex: 2, position: 'absolute' }}
                        />
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                        this.setState(
                            {
                                photoModalVisible: true,
                                mediaPaths: feed.media,
                                selectedMediaIndex: feed.media.indexOf(feed.media[0])
                            }
                        )
                    }
                >
                    <View>
                        <AutoResizeImage
                            width={Dimensions.get('window').width}
                            source={{ uri: postUrl + '/media/' + feed.media[0]._id }}
                        />
                        {
                            feed.media.length === 1 ?
                                <View />
                                :
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={{ flexDirection: 'row', zIndex: 2, position: 'absolute', right: 2, bottom: 2, backgroundColor: '#fff', borderRadius: 10 }}>
                                    {this.renderAvatars(feed.media)}
                                </ScrollView>
                        }
                    </View>
                </TouchableOpacity>
            )
        }
    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    editPost(feed) {
        this._menu.hide();
    };

    deletePost(feed) {
        this._menu.hide();
        this.setState({ isVisible: false });

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
        }

        const url = postUrl + '/' + feed._id + '/delete';

        fetch(url, config)
            .then(res => res.json())
        // .then(resJson => console.log(resJson));
    }

    showMenu(ownerId) {
        if (LoggedUserCredentials.getOwnerId === ownerId) {
            this._menu.show();
        }
    };

    _closeVideoModal = () => this.setState({ videoModalVisible: false });

    render() {
        const { feed, isTouchable = true } = this.props;
        const {
            photoModalVisible,
            videoPath,
            selectedMediaIndex,
            videoModalVisible,
            mediaPaths,
            isVisible
        } = this.state;
        let paths = [];

        if (mediaPaths) {
            paths = mediaPaths.map(path => {
                return { source: { uri: postUrl + '/media/' + path._id } };
            })
        }

        return (
            isVisible ?
                <View key={feed._id}>
                    <RkCard style={styles.card}>
                        <View rkCardHeader >
                            <RkButton
                                rkType='clear'
                                disabled={!isTouchable}
                                onPress={() => this.props.navigation.navigate('MainOwnerProfile', { ownerId: feed.owner._id })} >
                                <ImageLoad
                                    style={styles.avatar}
                                    source={{ uri: ownerProPicUrl + "/" + feed.owner._id }}
                                    placeholderSource={require('../../assets/images/avator.png')}
                                    isShowActivity={false}
                                />
                            </RkButton>

                            <View style={{ flex: 1 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <RkText
                                        disabled={!isTouchable}
                                        onPress={() => this.props.navigation.navigate('MainOwnerProfile', { ownerId: feed.owner._id })}
                                        rkType='header6'
                                        style={{ color: '#ECC951', marginTop: scale(5) }}
                                    >
                                        {feed.owner.firstName + " " + feed.owner.lastName}
                                    </RkText>
                                    <Menu
                                        ref={this.setMenuRef}
                                        button={
                                            <RkButton
                                                rkType='clear'
                                                onPress={() => this.showMenu(feed.owner._id)}
                                            >
                                                <PIcon
                                                    name='dots-vertical'
                                                    style={{ fontSize: scale(18), color: '#ECC951', marginTop: scale(5) }}
                                                />
                                            </RkButton>
                                        }
                                    >
                                        <MenuItem onPress={() => this.deletePost(feed)}>Delete Post</MenuItem>
                                    </Menu>
                                </View>

                                {
                                    feed.petName && feed.activity ?
                                        <View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <PIcon name='paw' style={{ fontSize: 18, marginRight: 5, color: '#ECC951' }} />
                                                {/* <Text style={{ color: '#ECC951', flexWrap: 'wrap', flex: 1 }} >{feed.petsName} is  {feed.activity} </Text> */}
                                                <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
                                                    <TouchableOpacity
                                                    //onPress={() => { this.props.navigation.navigate("PetProfile",{"petId":}) }} 
                                                    >
                                                        <Text style={{ color: "#ECC951", fontFamily: "Roboto-Medium" }}>{feed.petName}</Text>
                                                    </TouchableOpacity>
                                                    <Text style={{ color: "#ECC951", fontFamily: 'Roboto-Light' }}> is </Text>
                                                    <Text style={{ color: "#ECC951", fontFamily: 'Roboto-Light' }}>{feed.activity}</Text>
                                                </View>
                                            </View>
                                            <TimeAgo time={feed.createdAt} style={{ marginLeft: scale(3) }} />
                                        </View>
                                        :
                                        <TimeAgo time={feed.createdAt} />
                                }

                            </View>
                        </View>

                        {
                            feed.hashTags ?
                                <View style={styles.hashTagContainer}>
                                    {this.renderHashTag(feed.hashTags)}
                                </View>
                                :
                                <View />
                        }

                        {
                            feed.media.length > 0 ?
                                this.renderMedia(feed)
                                :
                                <View />
                        }

                        {
                            feed.status ?
                                <View rkCardContent>
                                    <ReadMore
                                        numberOfLines={2}
                                        renderTruncatedFooter={this._renderTruncatedFooter}
                                        renderRevealedFooter={this._renderRevealedFooter} >
                                        <RkText rkType='primary3' style={{ color: 'black' }}>{feed.status.data.msg}</RkText>
                                    </ReadMore>
                                </View>
                                :
                                <View />
                        }

                        <View rkCardFooter style={{ paddingBottom: 0, paddingTop: 0 }}>
                            <SocialBar
                                feedLikes={feed.likes}
                                // feedDislikes={feed.dislikes}
                                feedCommentCount={feed.comments.length}
                                feedId={feed._id}
                            />
                        </View >
                    </RkCard>
                    
                    <PhotoView
                        visible={photoModalVisible}
                        data={paths}
                        hideStatusBar={false}
                        hideCloseButton={true}
                        hideShareButton={true}
                        initial={selectedMediaIndex || 0}
                        onDismiss={e => {
                            // don't forgot set state back.
                            this.setState({ photoModalVisible: false });
                        }}
                    />

                    {/* video modal */}
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={videoModalVisible}
                        onRequestClose={this._closeVideoModal}>
                        <View style={styles.videoContainer} >
                            <Video
                                url={videoPath}
                                autoPlay
                                fullScreenOnly
                            // lockPortraitOnFsExit
                            />
                        </View>
                    </Modal>
                </View>
                : null
        )
    }
}


let styles = StyleSheet.create(
    {
        card: {
            marginVertical: 8,
            backgroundColor: "#191e1f",
            marginHorizontal: scaleVertical(5),
        },
        avatar: {
            marginRight: 16,
            width: 60,
            height: 60,
            borderRadius: 30,
            overflow: 'hidden'
        },
        paginationStyle: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginRight: 15
        },
        videoContainer: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'black',
            paddingBottom: scaleVertical(25)
        },
        hashTagContainer: {
            paddingHorizontal: 10,
            paddingBottom: 8,
        }
    }
);