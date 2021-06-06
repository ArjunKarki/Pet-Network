import React, { Component } from 'react';

import {
    View,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
    ImageBackground
} from 'react-native';

import {
    RkButton,
    RkText,
    RkTextInput,
    RkStyleSheet
} from 'react-native-ui-kitten';

// import {
//     CitizenItem
// } from '../citizen/components';

import Icon from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import ImageLoad from 'react-native-image-placeholder';

import { TimeAgo } from '../../components';

import { postUrl, baseUrl, ownerProPicUrl, petProPicUrl, ownerProfileUrl } from '../../utils/globle';
import { scale } from '../../utils/scale';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { PostItem } from '../social';
import { NotificationService } from '../../utils/service';
import { EachComment } from '../social';
import { Color } from '../../utils/color';

export class Notification extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: 'Notifications',
        headerStyle: {
            backgroundColor: '#191e1f',
        },
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerLeft: (
            <RkButton
                rkType='clear'
                style={{ width: 40, marginLeft: 8 }}
                onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={scale(17)} color='#ECC951' />
            </RkButton>
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            noti: [],
            loading: true,
            modalVisible: false,
            showCommentView: false,
            dataLoading: false,
            data: null,
            showError: false,
            comments: [],
            message: ''
        }
    }

    componentDidMount() {
        this.getNotiData();
    }

    _keyExtractor = (noti) => {
        return noti.id;
    }

    async showSelectedPost(postId) {

        this.setState({ modalVisible: true, dataLoading: true });

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }

        const url = postUrl + '/' + postId;

        try {
            
            const res = await fetch(url, config);
            const status = res.status;
            switch (status) {
                case 401: {
                    alert('Something went wrong.Please try later !');
                    break;
                }
                case 500: {
                    alert('Something went wrong.Please try later !');
                    break;
                }
                case 200: {
                    const resJson = await res.json();
                    console.log(resJson)
                    this.setState({ data: resJson, dataLoading: false, showError: false });
                    break;
                }
            }
        } catch (err) {
            alert("Please connect to internet and try again !");
        }
    }

    showPetProfile(petId) {
        console.log(petId)
        this.props.navigation.navigate("PetProfile", { petId: petId });
    }

    // async showSelectedCitizen(postId) {
    //     this.setState({ modalVisible: true, dataLoading: true });

    //     const config = {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
    //         },
    //         method: 'GET',
    //     }

    //     const url = citizenUrl + '/' + postId;

    //     try {
    //         const res = await fetch(url, config);
    //         const status = res.status;
    //         switch (status) {
    //             case 401: {
    //                 alert('Something went wrong.Please try later !');
    //                 break;
    //             }
    //             case 500: {
    //                 alert('Something went wrong.Please try later !');
    //                 break;
    //             }
    //             case 200: {
    //                 const resJson = await res.json();
    //                 this.setState({ data: resJson, dataLoading: false, showError: false });
    //                 break;
    //             }
    //         }
    //     } catch (err) {
    //         alert("Please connect to internet and try again !");
    //     }
    // }

    updateRow(isViewed, id) {
        if (!isViewed) {
            NotificationService.updateIsView((repository) => repository.create('Notification', { id, isViewed: true }, true));
            this.getNotiData();
        }
    }

    getNotiData() {
        let result = NotificationService.findAll();
        this.setState({ noti: result, loading: false });
    }

    navigate(row) {
        this.updateRow(row.isViewed, row.id);
        switch (row.type) {
            case 'CREATE-POST': this.showSelectedPost(row.dataId);
                break;
            case 'LIKE-POST': this.showSelectedPost(row.dataId);
                break;
            case 'COMMENT-POST': this.showSelectedPost(row.dataId);
                break;
            case 'MATCH-REQUEST': this.showPetProfile(row.dataId);
                break;
            case 'HAIR-CUT': this.showPetProfile(row.dataId);
                break;
            // case 'CREATE-SUBCITIZEN': this.showSelectedCitizen(row.dataId);
            //     break;
            // case 'COMMENT-CITIZEN': this.showSelectedCitizen(row.dataId);
            //     break;
            // case 'LIKE-CITIZEN': this.showSelectedCitizen(row.dataId);
            //     break;
            // case 'LIKE-SUBCITIZEN': this.showSelectedCitizen(row.dataId);
            //     break;
            // case 'COMMENT-SUBCITIZEN': this.showSelectedCitizen(row.dataId);
            //     break;
        }
    }

    renderRow = (row) => {
        console.log("Rowwww", row.item)
        let eachNoti = row.item;

        let attachment = <View />;

        let mainContentStyle;

        if (eachNoti.media) {
            let url;

            mainContentStyle = styles.mainContent;

            if (eachNoti.media.contentType.startsWith('video/')) {
                url = postUrl + '/media/' + eachNoti.media.mediaId + '/thumbnail';

            } else {
                if (eachNoti.type == "HAIR-CUT") {
                    url = null
                } else if (eachNoti.type === "MATCH-REQUEST" || eachNoti.type === "HAIR-CUT") {
                    url = petProPicUrl + "/" + eachNoti.media.mediaId
                } else {
                    url = postUrl + '/media/' + eachNoti.media.mediaId;
                }
            }

            attachment = <FastImage style={styles.attachment} source={{ uri: url }} />
        }

        let backgroundStyle = eachNoti.isViewed ? undefined : { backgroundColor: '#d5dcdd' };
        let imgLoad = eachNoti.type == "HAIR-CUT" ?
            petProPicUrl + "/" + eachNoti.pet.petProPic :
            ownerProfileUrl + "/" + eachNoti.userId

        return (
            <TouchableOpacity style={[styles.container, backgroundStyle]} onPress={() => this.navigate(eachNoti)}>
                <ImageLoad
                    style={styles.avatar}
                    source={{ uri: imgLoad }}
                    placeholderSource={require('../../assets/images/avator.png')}
                    isShowActivity={false}
                />
                <View style={styles.content}>
                    <View style={mainContentStyle}>
                        <View style={styles.text}>
                            <RkText>
                                <RkText style={{ fontSize: scale(15), fontFamily: 'Righteous-Regular' }}>{eachNoti.type == "HAIR-CUT" ? eachNoti.pet.petName : eachNoti.username}</RkText>
                                <RkText rkType='primary2'> {eachNoti.description}</RkText>
                            </RkText>
                        </View>
                        <TimeAgo style={{ marginTop: 6 }} time={eachNoti.createdAt} />
                    </View>
                    {attachment}
                </View>
            </TouchableOpacity>
        )
    }

    renderLoading() {
        return (
            <View style={styles.centerContent}>
                <ActivityIndicator animating size={scale(30)} />
            </View>
        )
    }


    renderErrorView() {
        return (
            <View style={styles.centerContent}>
                <Icon name="comments-o" size={scale(50)} />
                <RkText >Something went wrong !</RkText>
            </View>
        )
    }

    _CmtKeyExtractor(cmt) {
        return cmt.commentId;
    }

    feedWithCommentView() {
        const { comments } = this.state;
        return (
            <View >
                <FlatList
                    data={comments}
                    keyExtractor={this._CmtKeyExtractor}
                    renderItem={(comment) => (<EachComment comment={comment.item} />)}
                />

                <View style={styles.commentFooter}>
                    <RkButton style={styles.plus} rkType='clear'>
                        <Icon name='plus' size={scale(16)} />
                    </RkButton>

                    <RkTextInput
                        onChangeText={(message) => this.setState({ message })}
                        value={message}
                        rkType='row sticker'
                        placeholder="Add a comment..." />

                    <RkButton
                        onPress={() => { }}
                        style={styles.send}
                        rkType='circle highlight'>
                        <Image source={require('../../assets/icons/sendIcon.png')} />
                    </RkButton>
                </View>
            </View>
        )
    }

    feedWithoutCommentView() {
        const { data } = this.state;

        if (data && data.isAvailable) {
            console.log("Available", data)
            return (
                <ImageBackground
                    source={require('../../assets/images/background.jpg')}
                    style={{ flex: 1 }}
                >
                    <ScrollView>
                        <PostItem feed={data} isTouchable={false} />
                    </ScrollView>
                </ImageBackground>

            )
        }

        return (
            <View style={styles.centerContent}>
                <Icon name='info' style={{ marginBottom: 10 }} size={scale(16)} />
                <RkText >This post is currently not available.</RkText>
            </View>
        )
    }

    closePostModal = () => this.setState({ modalVisible: false });

    render() {
        const {
            noti,
            loading,
            modalVisible,
            showCommentView,
            dataLoading,
            showError
        } = this.state;

        if (loading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' animating />
                </View>
            )
        } else {
            if (noti && noti.length > 0) {
                return (
                    <View style={{ flex: 1 }} >
                        <FlatList
                            data={noti}
                            renderItem={this.renderRow}
                            keyExtractor={this._keyExtractor}
                            contentContainerStyle={styles.root}
                            initialNumToRender={10}
                        />

                        {/* modal without comments */}
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={modalVisible}
                            onRequestClose={this.closePostModal}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.headerBar}>
                                    <RkButton
                                        rkType='clear'
                                        style={{ width: 40 }}
                                        onPress={this.closePostModal}
                                    >
                                        <Icon name='arrow-left' color='#ECC951' size={17} />
                                    </RkButton>
                                    <RkText style={{ paddingTop: 8, marginLeft: 15, color: '#ECC951' }}>Post</RkText>
                                </View>
                                {
                                    dataLoading ?
                                        this.renderLoading()
                                        :
                                        showError ?
                                            this.renderErrorView()
                                            :
                                            showCommentView ? this.feedWithCommentView() : this.feedWithoutCommentView()
                                }
                            </View>
                        </Modal>
                    </View>
                )
            }

            return (
                <View style={styles.centerContent}>
                    <Icon name="bell-o" size={50} style={{ marginBottom: 10 }} />
                    <RkText >There is no notification !</RkText>
                </View>
            )
        }
    }
}
let styles = RkStyleSheet.create(theme => ({
    root: {
        backgroundColor: theme.colors.screen.base
    },
    container: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden'
    },
    text: {
        marginBottom: 5,
    },
    content: {
        flex: 1,
        marginLeft: 16,
        marginRight: 0
    },
    mainContent: {
        marginRight: 60
    },
    attachment: {
        position: 'absolute',
        right: 0,
        height: scale(50),
        width: scale(50)
    },
    headerBar: {
        flexDirection: 'row',
        minHeight: 55,
        padding: 5,
        backgroundColor: '#191e1f'
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.screen.base
    },
    commentFooter: {
        flexDirection: 'row',
        minHeight: scale(60),
        padding: 10,
        backgroundColor: Color.fontColor
    },
    plus: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginRight: 7
    },
}))