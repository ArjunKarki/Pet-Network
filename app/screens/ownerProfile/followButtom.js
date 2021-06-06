import React, { Component } from 'react';
import { scale } from '../../utils/scale';
import { View, Text } from 'react-native'
import { RkButton, RkText } from 'react-native-ui-kitten';
import { unfolloOwnerUrl, followOwnerUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class FollowBottom extends Component {

    constructor(props) {
        super(props)
        this.state = {
            followerId: this.props.followerId,
            followedId: this.props.followedId,
            status: this.props.status
        }
    }

    async followToggle() {
    
        let { followerId, followedId } = this.state;
        const { status } = this.state;
        let path = '';
        if (status === "follow") {
            this.setState({ status: "following" })
            path = followOwnerUrl + "/" + followerId + "/" + followedId
        } else {
            this.setState({ status: "follow" });
            path = unfolloOwnerUrl + "/" + followerId + "/" + followedId
        }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
        }

        try {
            let res = await fetch(path, config);

        } catch (error) {
            console.log('ERROr',error)
        }

    }

    render() {
        let { status } = this.state;
        let btnstyle = status === 'following' ? { backgroundColor: '#566573' } : { backgroundColor: '#ECC951' }
        return (
            <View style={{ alignSelf: 'center' }}>
                <RkButton onPress={() => this.followToggle()} style={[{ height: 25, width: 100, borderRadius: 10, marginRight: 10 }, btnstyle]} >
                    <RkText style={{ fontSize: 15 }}>{status}</RkText>
                </RkButton>
            </View>
        )
    }
}