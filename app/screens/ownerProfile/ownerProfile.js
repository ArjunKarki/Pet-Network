import React, { Component } from 'react';

import Image from 'react-native-image-progress';

import {
    View,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    TouchableOpacity,
    Text,
} from 'react-native';

import {
    RkText,
    RkButton
} from 'react-native-ui-kitten';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';

import { Feed, Pet, AboutOwner, } from ".";
import PhotoView from "@merryjs/photo-viewer";
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { ownerProfileUrl, ownerProPicUrl, unfolloOwnerUrl, followOwnerUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { scale } from '../../utils/scale';

export class OwnerProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            petsCount: 0,
            profileData: '',
            ownerId: "",
            loggedOwnerId: '',
            loading: true,
            follower: [],
            following: [],
            test: '',
            photoModalVisible: false,
            tabIndex: 0,
            errorView: false
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: 'Profile',
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
                onPress={() => navigation.goBack(null)}>
                <FIcon name="arrow-left" size={17} color='#ECC951' />
            </RkButton>
        )
    });

    async pressEditBtn() {
        this.props.navigation.navigate("EditProfile",
            {
                "ownerInfo": this.state.profileData,
                'refreshOwnerProfile': (ownerId) => this.getProfileData(ownerId),
                // 'refreshAboutOwner': (ownerId) => this.aboutRef.getAboutOwner(ownerId)
            });
    }

    // showPetDetail(petInfo) {
    //     const { profileData, ownerId } = this.state;
    //     const ownerName = profileData.firstName + " " + profileData.lastName;
    //     this.props.navigation.navigate("PetDetail", {
    //         "petInfo": { ...petInfo, ownerName, ownerId },
    //         "refreshOwnerProfile": (ownerId) => { this.getProfileData(ownerId) },
    //         "refreshPetList": (ownerId) => this.petRef.getAllPets(ownerId)

    //     })
    // }

    goToPetProfile(petId) {
        this.props.navigation.navigate("PetProfile", { "petId": petId })
    }

    addPet(petInfo) {
        this.props.navigation.navigate("AddPet", {
            "ownerId": this.state.ownerId,
            "petInfo": petInfo,
            'refreshPetList': () => this.petRef.getAllPets(this.state.ownerId),
            'refreshOwnerProfile': (ownerId) => this.getProfileData(ownerId)
        });
    }

    navigate(route) {
        this.props.navigation.navigate(route);
    }

    componentDidMount() {
        let tempOwnerId = this.props.navigation.state.params.ownerId;
        this.getProfileData(tempOwnerId);
    }

    tapToRetryBtnPress() {
        this.setState({ errorView: false, loading: true })
        let tempOwnerId = this.props.navigation.state.params.ownerId;
        setTimeout(() => this.getProfileData(tempOwnerId), 1000)
    }

    async getProfileData(ownerId) {
        this.setState({ loggedOwnerId: LoggedUserCredentials.getOwnerId(), ownerId: ownerId });

        let path = ownerProfileUrl + "/" + ownerId;
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }
        try {
            let res = await fetch(path, config);
            if (res.status == 200) {
               
                let resJson = await res.json();
                this.setState({
                    petsCount: resJson.ownerInfo.pets.length,
                    profileData: resJson.ownerInfo,
                    loading: false,
                    follower: resJson.ownerInfo.followerLists,
                    following: resJson.ownerInfo.followingLists
                })
            } else if (res.status == 401) {
                this.setState({
                    loading: false,
                    errorView: true
                })
            } else {
                this.setState({
                    loading: false,
                    errorView: true
                })
            }

        } catch (error) {
            this.setState({
                loading: false,
                errorView: true
            })

        }

    }

    render_edit_follow_btn(followText, hasFollowed) {
        let { ownerId, loggedOwnerId } = this.state;

        if (ownerId === loggedOwnerId) {
            return (
                <RkButton
                    rkType='rounded'
                    style={{ backgroundColor: 'rgba(25, 30, 31,0.5)', borderWidth: 2, borderColor: '#ECC951' }}
                    onPress={() => this.pressEditBtn()}>
                    <Icon name='pencil' style={{ fontSize: 18, marginRight: 5, color: '#ffffff' }} />
                    <RkText style={{ color: '#ffffff', fontSize: 15 }}>Edit Profile</RkText>
                </RkButton>
            )
        } else {
            return (
                <RkButton
                    rkType='rounded'
                    style={{ backgroundColor: 'rgba(25, 30, 31,0.5)', borderWidth: 2, borderColor: '#ECC951' }}
                    onPress={() => this.followBtn(hasFollowed)}>
                    <RkText style={{ color: '#ffffff', fontSize: 15 }}>{followText}</RkText>
                </RkButton>
            )
        }
    }

    async followBtn(hasFollowed) {

        let { loggedOwnerId, ownerId, follower } = this.state

        if (hasFollowed) {
            follower.pop(loggedOwnerId);
            this.setState(this.state);
            //this.setState({ follower: follower })
        } else {
            follower.push(loggedOwnerId);
            this.setState(this.state);
            //this.setState({ follower: follower })
        }

        let url = hasFollowed ? unfolloOwnerUrl : followOwnerUrl 
        let path=url+"/" + loggedOwnerId + "/" + ownerId
        const config = {

            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',

        }

        let res = await fetch(path, config);
        let resJson = await res.json();
  
    }

    gotoFollowerFollowingList(route) {

        let {
            loggedOwnerId,
            ownerId
        } = this.state

        this.props.navigation.navigate(route, {
            followerId: loggedOwnerId,
            followedId: ownerId,
            //ownerId is followedId.
            refreshOwnerProfile: (ownerId) => this.getProfileData(ownerId),
            refreshPetList: (ownerId) => this.petRef.getAllPets(ownerId)
        });
    }


    render() {
        let {
            petsCount,
            profileData,
            ownerId,
            loading,
            loggedOwnerId,
            follower,
            following,
            errorView
        } = this.state;

        let proPicPath = ownerProPicUrl + "/" + ownerId

        let photo = [{
            source: {
                uri:
                    proPicPath
            }
        }]

        if (loading) {
            return (
                <ImageBackground
                    style={{ flex: 1, width: null, height: null, justifyContent: "center", alignItems: "center" }}
                    source={require('../../assets/images/background.jpg')}
                >
                    <ActivityIndicator size="large" color='#FFEB3B' />
                </ImageBackground>
            )

        } else {

            let ownerName = profileData.firstName + " " + profileData.lastName;
            let hasFollowed = follower.includes(loggedOwnerId);
            let followText = hasFollowed ? "Unfollow" : "Follow";

            return (
                <ImageBackground
                    style={{ flex: 1, width: null, height: null }}
                    source={require('../../assets/images/background.jpg')}
                >
                    {
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
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'column', paddingVertical: 20, }}>
                                    <View style={[styles.ImageContainer]}>
                                        <TouchableOpacity onPress={() => { this.setState({ photoModalVisible: true }) }}>
                                            <Image
                                                source={{ uri: proPicPath }}
                                                style={styles.avator}
                                                indicatorProps={{
                                                    color: '#ECC951',
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <View style={{ flexDirection: 'row', marginRight: 20 }}>
                                            <TouchableOpacity onPress={() => this.gotoFollowerFollowingList("FollowerList")}>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <RkText style={styles.txtStyle}>{follower.length} </RkText>
                                                    <RkText style={styles.txtStyle}>Follower</RkText>
                                                </View>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => { this.gotoFollowerFollowingList("FollowingList") }}>
                                                <View style={{ justifyContent: 'center', marginLeft: 20 }}>
                                                    <RkText style={styles.txtStyle}>{following.length} </RkText>
                                                    <RkText style={styles.txtStyle}>Following</RkText>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', marginLeft: 20 }}>
                                        <View>
                                            <RkText style={styles.txtStyle}>{ownerName}</RkText>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Icon name='paw' style={{ fontSize: 20, color: '#ECC951', marginRight: 8 }} />
                                                <RkText style={styles.txtStyle}>{petsCount}</RkText>
                                            </View>
                                        </View>
                                        <View style={{ marginRight: 20 }}>
                                            {this.render_edit_follow_btn(followText, hasFollowed)}
                                        </View>
                                    </View>
                                    <PhotoView
                                        visible={this.state.photoModalVisible}
                                        data={photo}
                                        initial={0}
                                        hideStatusBar={true}
                                        hideCloseButton={true}
                                        hideShareButton={true}
                                        onDismiss={e => {
                                            this.setState({ photoModalVisible: false });
                                        }}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <ScrollableTabView
                                        tabBarBackgroundColor='rgba(25, 30, 31,0.6)'
                                        tabBarActiveTextColor='#ECC951'
                                        tabBarInactiveTextColor='#ffffff'
                                        tabBarUnderlineStyle={{ backgroundColor: '#ECC951' }}
                                        //initialPage={0}
                                        page={0}
                                        onChangeTab={({ i }) => {
                                            if (i === 0) {
                                                
                                            } else if (i === 1) {
                                                this.feedRef.getFeedData(ownerId)
                                              
                                            } else {
                                                this.aboutRef.getAboutOwner(ownerId);
                                            }
                                        }}
                                    >
                                        <Pet
                                            ref={petRef => this.petRef = petRef}
                                            tabLabel='Pets'
                                            ownerId={ownerId}
                                            loggedOwnerId={loggedOwnerId}
                                            addPet={(petInfo) => this.addPet(petInfo)}
                                            //goToPetDetail={(pet) => this.showPetDetail(pet)}
                                            goToPetProfile={(petId) => { this.goToPetProfile(petId) }}
                                        />
                                        <Feed
                                            refreshOwnerProfile={(ownerId) => this.getProfileData(ownerId)}
                                            refreshPetList={(ownerId) => this.petRef.getAllPets(ownerId)}
                                            ref={feedRef => this.feedRef = feedRef}
                                            ownerId={ownerId}
                                            tabLabel='Feeds'
                                            navigation={this.props.navigation}
                                        />
                                        <AboutOwner
                                            ref={aboutRef => this.aboutRef = aboutRef}
                                            ownerId={ownerId}
                                            tabLabel='About' />
                                    </ScrollableTabView>
                                </View>
                            </View>
                    }

                </ImageBackground>
            )
        }
    }
}

const styles = StyleSheet.create({
    avator: {
        width: scale(100),
        height: scale(100),
        borderRadius: scale(90),
        marginLeft: scale(20),
        borderWidth: scale(1.5),
        borderColor: '#ECC951',
        overflow: 'hidden'
    },
    centerLoading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    ImageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    txtStyle: {
        color: '#ECC951',
        fontSize: 17
    },
    tabView: {
        backgroundColor: '#ffffff',
        margin: 10,
        borderRadius: 35,
    },
})
