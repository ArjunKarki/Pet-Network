import React from 'react';

import {
    View,
    Modal,
    StyleSheet,
    Dimensions
} from 'react-native';

import {
    RkText,
    RkButton,
} from 'react-native-ui-kitten';

import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/FontAwesome';
import Animation from 'lottie-react-native';
import io from 'socket.io-client/dist/socket.io';
import heart from '../../assets/animations/like.json';
import { scale } from '../../utils/scale';
import { postUrl, baseUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { CommentList } from '../../screens/social/commentList';
import { checkResponse } from '../../utils/commonService';

const bgColor = '#191e1f';
const yellowColor = '#ECC951';

let leftScale = Dimensions.get('window').width > 360 ? 15 : 18;
let topScale = Dimensions.get('window').width > 360 ? 14 : 17;

export class SocialBar extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            likesCount: props.feedLikes.length,
            commentCount: props.feedCommentCount,
            feedId: props.feedId,
            isLiked: props.feedLikes.includes(LoggedUserCredentials.getOwnerId()),
            comments: [],
            commentsLoading: false,
            commentModalVisible: false,
        }
        this.socket = io(baseUrl + '/all_likes');
    }

    isSavedVisible() {
        const { isLiked } = this.state;
        return (isLiked) ? { display: 'flex' } : { display: 'none' };
    }

    isRemovedVisible() {
        const { isLiked } = this.state;
        return (!isLiked) ? { display: 'flex', width: scale(55), height: scale(55) } : { display: 'none' };
    }

    onLikeCountReceive = (data) => {
        console.log("like count", data)
        if (data && (data.id === this.props.feedId)) {
            this.setState({ likesCount: data.likesCount });
        }
    }

    onCmtCountReceive = (data) => {
        console.log("comment count", data)
        if (data && (data.id === this.props.feedId)) {
            this.setState({ commentCount: data.cmtCount });
        }
    }

    componentDidMount() {
        this.socket.on('post::reacted', this.onLikeCountReceive);
        this.socket.on('post::commented', this.onCmtCountReceive);
    }

    componentWillUnmount() {
        this.socket.off('post::reacted', this.onLikeCountReceive);
        this.socket.off('post::commented', this.onCmtCountReceive);
    }

    onLikePress() {
        const { likesCount, isLiked } = this.state;
        //check whether logged user did like or not
        if (isLiked) {
            this.setState({ likesCount: likesCount - 1, isLiked: false }, () => this.onUnLike());
        } else {
            this.setState({ likesCount: likesCount + 1, isLiked: true }, () => { this.isSavedAnimation.play(); this.onLike(); });
        }
    }

    onLike() {
        const { feedId } = this.state;

        let data = { 'ownerId': LoggedUserCredentials.getOwnerId() }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }

        const likeUrl = postUrl + "/" + feedId + "/like"

        fetch(likeUrl, config)
            .then(res => console.log("like", res))
            .catch(err => alert('Something went wrong.Please try later.'));
    }

    onUnLike() {
        const { feedId } = this.state;

        let data = { 'ownerId': LoggedUserCredentials.getOwnerId() }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }

        let unlikeUrl = postUrl + "/" + feedId + "/unlike";

        fetch(unlikeUrl, config)
            .then(res => console.log("unlike", res))
            .catch(err => alert('Something went wrong.Please try later.'));
    }

    getComments() {
        const { feedId } = this.state;
        const url = postUrl + '/' + feedId + '/comments';
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        };

        fetch(url, config)
            .then(res => checkResponse(res, url, config).json())
            .then(resJson => this.setState({ comments: resJson.docs, commentsLoading: false }))
            .catch(err => this.setState({ commentsLoading: false }));

    }

    _CmtKeyExtractor = (cmt) => {
        return cmt.commentId;
    }

    showCommentModal() {
        this.setState({ commentModalVisible: true, commentsLoading: true }, () => this.getComments());
        isCommentPressed = true;
    }

    updateComment(cmt) {
        const { comments } = this.state;
        this.setState({ comments: [...this.state.comments, ...cmt], commentCount: comments.length });
    }

    onShare() {
        const { feedId } = this.state;

        let shareOptions = {
            title: "PetNetwork",
            //url: "https://pet-network.io/webfeed/" + feedId,
            url: "http://192.168.2.96:3000/webfeed/" + feedId,
            subject: "Share Link" //  for email
        };

        Share.open(shareOptions);
    }

    goToProfile(ownerId) {
        this.setState({ commentModalVisible: false })
        this.props.goToProfile(ownerId)
    }

    render() {
        const {
            likesCount,
            commentModalVisible,
            feedId,
            commentsLoading,
            comments,
            commentCount
        } = this.state;

        return (
            <View style={styles.container}>
                <View style={[styles.section, this.isRemovedVisible()]}>
                    <RkButton rkType='clear' onPress={() => this.onLikePress()}>
                        <Icon
                            name={'heart-o'}
                            size={scale(20)}
                            color={'#f2f2f2'}
                        />
                    </RkButton>
                    <RkText
                        rkType='primary4'
                        style={{ color: '#fff', left: scale(leftScale), top: scale(topScale) }}>
                        {likesCount === 0 ? null : likesCount}
                    </RkText>
                </View>

                <View style={[styles.section, this.isSavedVisible()]}>
                    <RkButton rkType='clear' onPress={() => this.onLikePress()} >
                        <Animation
                            style={{ width: scale(55), height: scale(55) }}
                            ref={aniRef => this.isSavedAnimation = aniRef}
                            loop={false}
                            source={heart}
                        />
                        <RkText
                            rkType='primary4'
                            style={[{ color: '#ECC951' }]}>
                            {likesCount}
                        </RkText>
                    </RkButton>
                </View>

                <View style={styles.section}>
                    <RkButton rkType='clear' onPress={() => this.showCommentModal()}>
                        <Icon name='comment-o' size={scale(20)} color='#f2f2f9' />
                        <RkText
                            rkType='primary4 hintColor'
                            style={[styles.label, { color: 'white', paddingLeft: scale(7) }]}
                        >
                            {commentCount > 0 ? commentCount : null}
                        </RkText>
                    </RkButton>
                </View>

                <View style={styles.section}>
                    <RkButton rkType='clear' onPress={() => this.onShare()}>
                        <Icon name='share' size={scale(20)} color='#f2f2f9' />
                    </RkButton>
                </View>
                {/* comment modal */}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={commentModalVisible}
                    onRequestClose={() => { this.setState({ commentModalVisible: false, commentCount: comments.length }) }}>
                    <CommentList
                        goToProfile={(Id) => { this.goToProfile(Id) }}
                        feedId={feedId}
                        commentsLoading={commentsLoading}
                        comments={comments}
                        updateComment={(cmt) => this.updateComment(cmt)}
                        closeModal={() => { this.setState({ commentModalVisible: false, commentCount: comments.length }) }}
                    />
                </Modal>

            </View>
        )
    }
}

let styles = StyleSheet.create(
    {
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            flex: 1,
            maxHeight: scale(55)
        },
        section: {
            justifyContent: 'center',
            flexDirection: 'row',
            flex: 1,
            maxHeight: scale(55)
        },
        icon: {
            fontSize: scale(20)
        },
        label: {
            marginLeft: scale(8),
            alignSelf: 'flex-end'
        }
    }
)
