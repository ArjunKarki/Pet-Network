import React, { Component } from 'react';
import Image from 'react-native-image-progress';
import { View, Text, TextInput, FlatList, ImageBackground, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { scale } from '../../utils/scale';
import Mcons from 'react-native-vector-icons/MaterialIcons'
import { RkButton, RkText } from 'react-native-ui-kitten';
import { ownerProPicUrl, showFollowingListUrl } from '../../utils/globle';
import { FollowBottom } from './followButtom';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class FollowingList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            followingList: [],
            orgFollowingList: [],
            loading: true,
            errorView: false,
            followerId: this.props.navigation.state.params.followerId,
            followedId: this.props.navigation.state.params.followedId,
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Following',
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
                onPress={() => {
                    navigation.state.params.goBackToProfile()
                }}>
                <RkText rkType='awesome' ><Mcons name='arrow-back' style={{ fontSize: 25 }} /></RkText>
            </RkButton>
        )
    });

    goBackToProfile() {
        this.props.navigation.state.params.refreshOwnerProfile(this.state.followedId);
        this.props.navigation.goBack();
    }

    componentDidMount() {

        this.props.navigation.setParams({ goBackToProfile: () => { this.goBackToProfile() } })
        this.getFollowingList()

    }

    async getFollowingList() {

        let { followerId, followedId } = this.state;

        let path = showFollowingListUrl + "/" + followerId + "/" + followedId;
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }

        try {
            let res = await fetch(path, config);
            let resJson = await res.json();
            console.log(resJson.rnfollowing_list)
            if (res.status == 200) {

                this.setState({
                    followingList: resJson.rnfollowing_list,
                    orgFollowingList: resJson.rnfollowing_list,
                    loading: false
                });
            } else {
                this.setState({
                    followingList: [],
                    orgFollowingList: [],
                    loading: false,
                    errorView: true
                });
            }

        } catch (error) {
            console.log(error)
            this.setState({
                followingList: [],
                orgFollowingList: [],
                loading: false,
                errorView: true
            })
        }
    }

    goToProfilePage(ownerId) {
        this.props.navigation.state.params.refreshOwnerProfile(ownerId);
        this.props.navigation.state.params.refreshPetList(ownerId)
        this.props.navigation.navigate("MainOwnerProfile", { ownerId: ownerId })
    }

    tapToRetryBtnPress() {
        this.setState({ errorView: false, loading: true })
        setTimeout(() => this.getFollowingList(), 1000)
    }

    searchFollowingList(input) {

        let { orgFollowingList } = this.state

        let searchResult = orgFollowingList.filter(
            (following) => {

                return (following.name).toLowerCase().indexOf(input.toLowerCase()) > -1
            }
        )

        if (searchResult.length === 0) {

        } else {
            this.setState({ followingList: searchResult })
        }
    }

    render() {
        let {
            followingList,
            loading,
            followerId,
            errorView
        } = this.state

        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                {
                    loading ?
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: scale(20), flex: 1 }}>
                            <ActivityIndicator size={40} color='#FFEB3B' />
                        </View>
                        :
                        errorView ?
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
                            :
                            followingList.length === 0 ?

                                //when there is no following list.
                                <View style={{ alignItems: 'center', marginTop: scale(30) }}>
                                    <Text style={{ fontSize: 25, color: '#ECC951' }}>
                                        No Following Yet!
                                </Text>
                                </View>
                                :
                                //when there is following list.
                                <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={true}>
                                    <View>
                                        <View style={{ flex: 0, flexDirection: 'row', marginHorizontal: scale(15), marginVertical: scale(10) }}>
                                            <FIcon name="search" style={{ fontSize: 20, flex: 0.2, alignSelf: 'center', color: '#ffffff' }} />
                                            <TextInput
                                                placeholder="search followings....."
                                                underlineColorAndroid='transparent'
                                                placeholderTextColor='#ffffff'
                                                onChangeText={(input) => this.searchFollowingList(input)}
                                                style={{ marginLeft: 10, flex: 3.8, fontSize: 17, color: '#ffffff' }}
                                            />
                                        </View>

                                        <View style={{ marginHorizontal: scale(20), marginTop: scale(10) }}>
                                            <View>
                                                <Text style={{ fontSize: 18, color: '#ffffff' }}>Followings</Text>
                                            </View>

                                            <FlatList

                                                data={followingList}
                                                renderItem={({ item }) => {
                                                    let name = item.firstName + " " + item.lastName
                                                    return (
                                                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: "space-between" }}>
                                                            <TouchableOpacity
                                                                onPress={() => { this.goToProfilePage(item._id) }}
                                                            >
                                                                <View style={{ flexDirection: 'row' }}>
                                                                    <Image
                                                                        style={{
                                                                            borderRadius: 100,
                                                                            width: 60,
                                                                            height: 60,
                                                                            borderWidth: 1.5,
                                                                            borderColor: '#ECC951',
                                                                            overflow: 'hidden'
                                                                        }}
                                                                        source={{ uri: ownerProPicUrl + "/" + item._id }}
                                                                        indicatorProps={{
                                                                            color: '#ECC951',
                                                                        }}
                                                                    />
                                                                    <Text style={{ alignSelf: 'center', color: '#ffffff', marginLeft: scale(10) }} > {name}</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                            {
                                                                LoggedUserCredentials.getOwnerId() === item._id ?
                                                                    null
                                                                    :
                                                                    <FollowBottom status={item.status} followerId={followerId} followedId={item._id} />
                                                            }
                                                        </View>

                                                    )
                                                }}
                                            />
                                        </View>

                                    </View>
                                </ScrollView>

                }

            </ImageBackground>
        )
    }
}

let styles = StyleSheet.create({
    centerLoading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})