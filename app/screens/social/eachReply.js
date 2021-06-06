import React, { PureComponent } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import {
    RkText,
    RkButton
} from 'react-native-ui-kitten';

import Icon from 'react-native-vector-icons/FontAwesome';
import ImageLoad from 'react-native-image-placeholder';

import { TimeAgo } from '../../components';
import { cmtUrl, baseUrl,ownerProPicUrl } from '../../utils/globle';
import { scale } from '../../utils/scale';
import { Color } from '../../utils/color';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class EachReply extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            //likes count of each reply
            likesCount: props.reply.likes.length,
            //have logged user already liked ?
            isLiked: props.reply.likes.includes(LoggedUserCredentials.getOwnerId()),
        }
    }

    toggleLikeReply = () => {
        const { isLiked } = this.state;
        const { reply } = this.props;
        if (isLiked) {
            this.doUnlikeComment(reply._id);
        } else {
            this.doLikeComment(reply._id);
        }
    }

    doLikeComment(cmtId) {
        const { likesCount } = this.state;
        this.setState({ likesCount: likesCount + 1, isLiked: true }, () => this.doLike(cmtId));
    }

    doLike(cmtId) {

        const like_data = { userId: LoggedUserCredentials.getOwnerId() };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
            body: JSON.stringify(like_data)
        }

        const likeUrl = cmtUrl + '/' + cmtId + '/like';

        fetch(likeUrl, config)
            .then(res => res.json())
            .catch(err => alert('Something went wrong.Please try later.'));
    }

    doUnlikeComment(cmtId) {
        const { likesCount } = this.state;
        this.setState({ likesCount: likesCount - 1, isLiked: false }, () => this.doUnlike(cmtId))
    }

    doUnlike(cmtId) {

        const unlike_data = { userId: LoggedUserCredentials.getOwnerId() };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
            body: JSON.stringify(unlike_data)
        }

        const unLikeUrl = cmtUrl + '/' + cmtId + '/unlike';

        fetch(unLikeUrl, config)
            .then(res => res.json())
            .catch(err => alert('Something went wrong.Please try later.'));
    }

    render() {
        const { reply } = this.props;
        const { likesCount, isLiked } = this.state;

        return (
            <View style={cmtStyles.container}>
                <TouchableOpacity>
                    <ImageLoad
                        style={cmtStyles.avatar}
                        source={{ uri:ownerProPicUrl+"/"+ reply.commentor._id }}
                        placeholderSource={require('../../assets/images/avator.png')}
                        isShowActivity={false}
                    />
                </TouchableOpacity>
                <View style={cmtStyles.content}>
                    <View style={cmtStyles.contentHeader}>
                        <RkText rkType='header5'>{reply.commentor.firstName+" "+reply.commentor.lastName}</RkText>
                        <TimeAgo time={reply.createdAt} />
                    </View>
                    <RkText rkType='primary2 mediumLine' style={{ marginBottom: 5 }}>{reply.message}</RkText>
                    <View style={{ flexDirection: 'row', marginVertical: 3, width: scale(70), justifyContent: 'space-between' }}>
                        <RkButton rkType='clear' onPress={this.toggleLikeReply}>
                            <Icon
                                name={isLiked ? 'heart' : 'heart-o'}
                                style={cmtStyles.iconStyle}
                            />
                            <RkText
                                rkType='primary4'
                                style={{ color: Color.backgroundColor }}>
                                {likesCount === 0 ? null : likesCount}
                            </RkText>
                        </RkButton>
                    </View>
                </View>
            </View>
        )
    }
}

let cmtStyles = StyleSheet.create(
    {
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
        iconStyle: {
            color: Color.backgroundColor,
            fontSize: 16,
            marginRight: 5
        },
        avatar: {
            marginRight: 16,
            width: 50,
            height: 50,
            borderRadius: 25,
            overflow: 'hidden'
        },
    }
);