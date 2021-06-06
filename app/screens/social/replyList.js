import React, { PureComponent } from 'react';

import {
    View,
    Image,
    ActivityIndicator,
    ScrollView,
    FlatList,
    StyleSheet
} from 'react-native';

import {
    RkText,
    RkButton,
    RkTextInput
} from 'react-native-ui-kitten';

import Icon from 'react-native-vector-icons/FontAwesome';

import { cmtUrl } from '../../utils/globle';
import { scale } from '../../utils/scale';
import { Color } from '../../utils/color';
import { EachReply } from './eachReply';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class ReplyList extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //reply message
            replyMessage: ''
        }
    }

    sendReply = () => {
        const { replyMessage } = this.state;
        const { commentId } = this.props;

        if (replyMessage.trim().length != 0) {

            const reply_form = {
                type: 'POST',
                cmt_owner: commentId,
                commentor: LoggedUserCredentials.getOwnerId(),
                comment_type: 'TEXT',
                message: replyMessage
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
                },
                method: 'POST',
                body: JSON.stringify(reply_form)
            };

            const url = cmtUrl + '/' + commentId + '/replies';

            fetch(url, config)
                .then(res => res.json())
                .then(this._onReplySuccess)
                .catch(this._onReplyErr);

            this.setState({ replyMessage: null });
        }
    }

    _onReplySuccess = _ => {
        const { updateReply } = this.props;
        updateReply && updateReply();
    }

    _onReplyErr = _ => alert('Something went wrong.Please try later!');

    _cmtKeyExtractor = cmt => cmt._id;

    renderNoRepliesView() {
        return (
            <View style={cmtStyles.centerContent}>
                <Icon name="comments-o" size={50} />
                <RkText >No Replies Found !</RkText>
            </View>
        )
    }

    renderLoading() {
        return (
            <View style={cmtStyles.centerContent}>
                <ActivityIndicator size={30} color={Color.backgroundColor} />
            </View>
        )
    }

    _renderEachReply = (eachReply) => {
        const reply = eachReply.item;

        return (
            <EachReply reply={reply} />
        )
    }

    _closeModal = () => {
        const { closeModal } = this.props;
        closeModal && closeModal();
    }

    render() {
        const { replies, loading } = this.props;
        console.log(replies);

        return (
            <View style={cmtStyles.commentContainer}>
                <View style={cmtStyles.headerBar}>
                    <RkButton
                        rkType='clear'
                        style={{ width: 40 }}
                        onPress={this._closeModal}>
                        <Icon name='arrow-left' color='#fff' size={17} />
                    </RkButton>
                    <RkText style={{ paddingTop: scale(8), marginLeft: scale(15), color: '#fff' }}>Replies</RkText>
                </View>

                {
                    loading ?
                        this.renderLoading()
                        :
                        replies && replies.length === 0 ?
                            this.renderNoRepliesView()
                            :
                            <ScrollView keyboardShouldPersistTaps={'handled'}>
                                <FlatList
                                    style={cmtStyles.root}
                                    data={replies}
                                    keyExtractor={this._cmtKeyExtractor}
                                    renderItem={this._renderEachReply}
                                />
                            </ScrollView>
                }

                <View style={cmtStyles.commentFooter}>
                    <RkButton style={cmtStyles.plus} rkType='clear'>
                        <Icon name='plus' size={16} />
                    </RkButton>

                    <RkTextInput
                        onChangeText={(replyMessage) => this.setState({ replyMessage })}
                        value={this.state.replyMessage}
                        rkType='row sticker'
                        placeholder="Add a reply..." />

                    <RkButton
                        onPress={this.sendReply}
                        style={cmtStyles.send}
                        rkType='circle highlight'>
                        <Image source={require('../../assets/icons/sendIcon.png')} />
                    </RkButton>
                </View>
            </View>
        )
    }
}

let cmtStyles = StyleSheet.create(
    {
        commentContainer: {
            flex: 1
        },
        root: {
            backgroundColor: 'white',
            flex: 1
        },
        centerContent: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white'
        },
        commentFooter: {
            flexDirection: 'row',
            minHeight: 60,
            padding: 10,
            backgroundColor: Color.fontColor
        },
        headerBar: {
            flexDirection: 'row',
            minHeight: 55,
            padding: 5,
            backgroundColor: Color.backgroundColor
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
        }
    }
);