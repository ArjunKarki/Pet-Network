import React, { PureComponent } from 'react';
import {
    View,
    ActivityIndicator,
    Image,
    FlatList,
    Modal,
    Text,
    TouchableOpacity
} from 'react-native';

import {
    RkText,
    RkButton,
    RkTextInput,
    RkStyleSheet
} from 'react-native-ui-kitten';

import Icon from 'react-native-vector-icons/FontAwesome';
import SIcon from 'react-native-vector-icons/SimpleLineIcons';

import { postUrl, ownerProPicUrl } from '../../utils/globle';
import { scale } from '../../utils/scale';
import { EachComment } from './eachComment';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { checkResponse } from '../../utils/commonService';
import { FollowUnFollowBtn } from './';

export class CommentList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            message: null,
            likerModalVisible: false,
            likerLoading: false,
            liker: []
        }
        console.log('Porps', this.props)
    }

    sendComment() {
        const { message } = this.state;
        const { feedId } = this.props;
        console.log("length", message.trim().length)
        if (message.trim().length != 0) {
            const cmt_form = {
                type: 'POST',
                cmt_owner: feedId,
                commentor: LoggedUserCredentials.getOwnerId(),
                comment_type: 'TEXT',
                message
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
                },
                method: 'POST',
                body: JSON.stringify(cmt_form)
            };

            fetch(postUrl + '/' + feedId + '/comments', config)
                .then(res => res.json())
                .then(this._updateComment)
                .catch(this._onCmtSendErr);
        }
    }

    _updateComment = (resJson) => {
        const { updateComment } = this.props;
        this.setState({ message: '' });
        console.log("resJson", resJson)
        updateComment && updateComment([resJson]);
    }

    _onCmtSendErr = () => this.setState({ message: '' });

    _CmtKeyExtractor(cmt) {

        return cmt._id;
    }

    renderNoCommentsView() {
        return (
            <View style={cmtStyles.centerContent}>
                <Icon name="comments-o" size={50} />
                <RkText >No Comments Found !</RkText>
            </View>
        )
    }

    renderLoading() {
        return (
            <View style={cmtStyles.centerContent}>
                <ActivityIndicator animating size={30} />
            </View>
        )
    }

    getLikers() {
        const form_data = { userId: LoggedUserCredentials.getOwnerId() };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
            body: JSON.stringify(form_data)
        };

        const path = postUrl + '/' + this.props.feedId + '/reactions';

        fetch(path, config)
            .then(res => res.json())
            .then(this._getReactionsSuccess)
            .catch(this._getReactionsErr);
    }

    _getReactionsSuccess = ({ post_likers }) => {
        let routes = [];
        console.log("post likers", post_likers)
        // if (post_likers.length > 0) {
        //     routes.push({ key: 'like', icon: 'thumbs-o-up' });
        // }

        this.setState(
            {
                liker: post_likers,
                likerLoading: false,
            }
        );
    }

    onLikePressed = () => {
        this.setState({ likerModalVisible: true, likerLoading: true }, () => this.getLikers());
    }

    _keyExtractor = (item, index) => item.timestamp;

    dividerComponent = () => {
        return (
            <View style={{ borderTopWidth: 1, borderTopColor: 'grey', margin: 5 }} />
        )
    }

    _renderItem = (eachData) => {
        const item = eachData.item;
  
        return (
            <View style={cmtStyles.container}>
                <TouchableOpacity
                    onPress={() => this.props.goToProfile(item.userId)}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: ownerProPicUrl + '/' + item.userId }}
                            style={cmtStyles.avatar} />
                        <Text style={{ color: 'black', marginTop: 20, fontWeight: '400' }}>{item.name}</Text>
                    </View>
                </TouchableOpacity>
                <FollowUnFollowBtn status={item.status} ownerId={item.userId} />
            </View>
        )
    }

    renderLiker() {
        const { likerLoading, liker } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <View style={cmtStyles.headerBarLike}>
                    <RkButton
                        rkType='clear'
                        style={{ width: 40 }}
                        onPress={() => this.setState({ likerModalVisible: false })}>
                        <Icon name='arrow-left' color='black' size={17} />
                    </RkButton>
                    <RkText style={{ paddingTop: scale(8), marginLeft: scale(15) }}>Likes</RkText>
                </View>

                {
                    likerLoading ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size={'large'} color={'#ECC951'} style={{ alignSelf: 'center' }} />
                        </View>
                        :
                        liker && liker.length === 0 ?
                            <View style={cmtStyles.centerContent}>
                                <SIcon name="like" size={50} />
                                <RkText >Be the first one to like this post !</RkText>
                            </View>
                            :
                            <View style={{ flex: 1 }} >
                                <FlatList
                                    style={cmtStyles.root}
                                    data={liker}
                                    renderItem={this._renderItem}
                                    keyExtractor={this._keyExtractor}
                                    ItemSeparatorComponent={this.dividerComponent}
                                />
                            </View>
                }
            </View>
        )
    }
    goToProfile(ownerId) {
        this.props.goToProfile(ownerId);
    }


    render() {
        const { message, likerModalVisible } = this.state;
        const { commentsLoading, comments, closeModal } = this.props;

        return (
            <View style={cmtStyles.commentContainer}>
                <View style={cmtStyles.headerBar}>
                    <RkButton
                        rkType='clear'
                        style={{ width: 40 }}
                        onPress={() => closeModal()}>
                        <Icon name='arrow-left' color='black' size={17} />
                    </RkButton>
                    <RkText style={{ paddingTop: scale(8), marginLeft: scale(15) }}>Comments</RkText>
                    <RkButton
                        rkType='clear'
                        style={{ width: scale(50) }}
                        onPress={this.onLikePressed}>
                        <Icon name='heart' style={{ color: '#ECC951', fontSize: 22, marginRight: scale(10) }} />
                    </RkButton>
                </View>

                {
                    commentsLoading ?
                        this.renderLoading()

                        :
                        comments && comments.length === 0 ?
                            this.renderNoCommentsView()

                            :
                            <FlatList
                                style={cmtStyles.root}
                                data={comments}
                                keyExtractor={this._CmtKeyExtractor}
                                keyboardShouldPersistTaps="always"
                                renderItem={(comment) => (
                                    <EachComment comment={comment.item}
                                    //goToProfile={() => this.goToProfile(comment.item.commentorId)}
                                    />
                                )}
                            />
                }

                <View style={cmtStyles.commentFooter}>
                    <RkButton style={cmtStyles.plus} rkType='clear'>
                        <Icon name='plus' size={16} />
                    </RkButton>

                    <RkTextInput
                        onChangeText={(message) => this.setState({ message })}
                        value={message}
                        rkType='row sticker'
                        placeholder="Add a comment..." />

                    <RkButton
                        onPress={() => this.sendComment()}
                        style={cmtStyles.send}
                        rkType='circle highlight'>
                        <Image source={require('../../assets/icons/sendIcon.png')} />
                    </RkButton>
                </View>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={likerModalVisible}
                    onRequestClose={() => this.setState({ likerModalVisible: false })}
                >
                    {this.renderLiker()}
                </Modal>
            </View>
        )
    }
}

let cmtStyles = RkStyleSheet.create(theme => ({
    commentContainer: {
        flex: 1
    },
    root: {
        backgroundColor: theme.colors.screen.base,
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.screen.base
    },
    commentFooter: {
        flexDirection: 'row',
        minHeight: 60,
        padding: 10,
        backgroundColor: theme.colors.screen.alter
    },
    headerBar: {
        flexDirection: 'row',
        minHeight: 55,
        padding: 5,
        justifyContent: 'space-between',
        backgroundColor: theme.colors.screen.alter
    },
    plus: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginRight: 7
    },
    send: {
        width: 40,
        height: 40,
        marginLeft: 10,
    },
    container: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    content: {
        marginLeft: 16,
        flex: 1,
        marginBottom: 5
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
        paddingHorizontal: 5
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#ECC951',
        overflow: 'hidden',
        marginRight: 5
    },
    inviteBtn: {
        width: 80,
        height: 30,
        borderWidth: 1.5,
        borderColor: '#ECC951',
        borderRadius: 5,
        backgroundColor: 'black',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    headerBarLike: {
        flexDirection: 'row',
        minHeight: 55,
        padding: 5,
        backgroundColor: theme.colors.screen.alter
    },
}));