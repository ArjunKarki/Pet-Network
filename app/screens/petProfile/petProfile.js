import React, { Component } from 'react'
import { View, Text, ImageBackground, ActivityIndicator, StyleSheet, Dimensions, ScrollView, Image, Modal, FlatList, TouchableOpacity } from 'react-native'
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import { baseUrl, requestMatchUrl, petProPicUrl } from '../../utils/globle';
import { scale } from '../../utils/scale';
import PhotoView from "@merryjs/photo-viewer";
import EIcon from 'react-native-vector-icons/Entypo';
import { RkButton, RkText } from 'react-native-ui-kitten'
import FIcon from 'react-native-vector-icons/FontAwesome';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import ProfileHeader from './component/profileHeader'
import PetActivity from './component/petActivity';
let PRO_PIC_WIDTH = Dimensions.get('window').width / 4
let PRO_PIC_HEIGHT = PRO_PIC_WIDTH

const ACTIVITY_WIDTH = (Dimensions.get('window').width - scale(60)) / 3

export class PetProfile extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            petId: props.navigation.state.params.petId,
            petInfo: null,
            loading: true,
            matchRequestModalVisible: false,
            requestersLoading: true,
            requestList: [],
            matchResponseVisible: false,
            errorView: false,
            matchStatusId: '',
            matchStatus: '',
            petListModalVisible: false,
            matchFrom: '',
            //requester owner pets
            petList: [],
            petListLoading: false,
            cancleRequestVisible: false,
        }
    }

    componentDidMount() {

        let { petId } = this.state
        this.getPetInfo(petId);
    }

    async getPetInfo(petId) {

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }
        let ownerId = LoggedUserCredentials.getOwnerId();
        const url = baseUrl + "/pets/petProfileInfo" + '?petId=' + petId + '&' + 'ownerId=' + ownerId
        try {
            let res = await fetch(url, config);
            let resJson = await res.json();
            console.log("Pet profile", resJson)
            if (res.status == 200) {
                this.setState({
                    petInfo: resJson.rnInfo[0],
                    petId: resJson.rnInfo[0]._id,
                    matchStatusId: resJson.rnInfo[1].matchStatusId,
                    matchStatus: resJson.rnInfo[1].status,
                    loading: false
                })
            } else {
                alert("something went wrong!")
                this.setState({
                    loading: false,
                    errorView: true
                })
            }
        } catch (error) {
            alert("Please check your connection!")
            console.log(error);
            this.setState({
                loading: false,
                errorView: true
            })
        }
    }

    noPetsView() {
        let { petInfo } = this.state;
        return (
            <View style={{ justifyContent: "center", alignItems: "center", width: "50%", height: "30%", backgroundColor: '#ffffff', borderRadius: scale(15) }}>
                <Text style={{ color: 'black' }}>You have no {petInfo.petType}</Text>
            </View>
        )
    }

    async getRequestList() {

        this.setState({ matchRequestModalVisible: true })

        let { petId } = this.state

        let path = baseUrl + "/pets/getMatchRequestList/" + petId;

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
                this.setState({ requestersLoading: false, requestList: resJson.Data })
            }

        } catch (error) {
            alert("Something Went Wrong!")
        }
    }

    gettingPetList() {
        return (
            <View style={{ justifyContent: "center", alignItems: "center", width: "60%", height: "30%", backgroundColor: "#ffffff", flexDirection: "column", borderRadius: scale(15) }}>
                <ActivityIndicator size="small" color="black" />
                <Text>getting pets.....</Text>
            </View>
        )
    }

    async onMatch() {

        let { petInfo } = this.state;
        this.setState({ petListLoading: true, petListModalVisible: true, matchFrom: '' })
        let path = baseUrl + "/pets/sameTypePets" + "/" + LoggedUserCredentials.getOwnerId() + "?type=" + petInfo.petType;

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
                if (resJson.petList.length === 0) {
                    this.setState({ petListLoading: false, petList: [] })
                } else {
                    this.setState({ petList: resJson.petList, petListLoading: false })
                }
            }
        } catch (error) {
            alert("Something Wrong!")
            console.log(error)
        }
    }

    showPetList() {
        let { petInfo, petList } = this.state;
        return (
            <View style={{ width: "60%", minHeight: "22%", backgroundColor: "#ffffff", flexDirection: "column", justifyContent: "space-between", borderRadius: scale(15) }}>

                <View >
                    <Text style={{ alignSelf: "center", color: "black", marginVertical: scale(10), fontSize: scale(15) }}>Select a {petInfo.petType}</Text>
                    <View style={{ backgroundColor: '#ECC951', height: 1 }} />

                    <RadioGroup
                        size={scale(20)}
                        color='black'
                        style={{ flexDirection: 'column', marginLeft: scale(10), marginVertical: scale(5) }}
                        onSelect={(index, value) => { this.setState({ matchFrom: value }) }}
                    >
                        {
                            petList.map((pet) => {
                                console.log(pet)
                                return (
                                    <RadioButton value={pet._id} color='#ECC951' >
                                        <Text style={{ color: 'black', marginLeft: scale(15) }}>{pet.petName}</Text>
                                    </RadioButton>
                                )
                            })
                        }

                    </RadioGroup>
                </View>

                <View>
                    <View style={{ backgroundColor: '#ECC951', height: 1 }} />
                    <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: scale(10) }}>
                        <RkButton rkType="clear"><Text style={{ fontSize: scale(15) }} onPress={() => this.setState({ petListModalVisible: false })}>Cancle</Text></RkButton>
                        <RkButton rkType="clear" onPress={() => { this.requestMatch() }}><Text style={{ fontSize: scale(15) }}>Match</Text></RkButton>
                    </View>
                </View>

            </View>
        )
    }

    async requestMatch() {
        let { matchFrom, petInfo } = this.state
        console.log("matchFrom", matchFrom)
        let path = requestMatchUrl
        if (matchFrom === "") {
            alert("Please select pet!");
        } else {
            this.setState({ petListModalVisible: false, matchStatus: "REQUEST_SENT" })
            let Data = {
                "matchFrom": matchFrom,
                "matchTo": petInfo._id
            }

            const config = {
                headers: {
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(Data)
            }

            try {
                let res = await fetch(path, config);
                console.log(res)
            } catch (error) {
                alert("Please check your connection!")
                console.log(error);
            }
        }

    }

    showStatus() {
        let { matchStatus } = this.state;
        console.log("show status", matchStatus);
        if (matchStatus === "NO_STATUS") {
            return (
                <RkButton rkType="clear" style={{ flexDirection: "column" }} onPress={() => this.onMatch()}>
                    <FIcon name="paw" size={scale(20)} color='#ECC951' />
                    <RkText style={{ color: "#ffffff", fontSize: scale(14) }}>Match</RkText>
                </RkButton>
            )
        } else if (matchStatus === "MATCHED") {
            return (
                <RkButton rkType="clear" style={{ flexDirection: "column" }}>
                    <Image source={require("../../assets/icons/matched.png")} style={{ width: 30, height: 30 }} />
                    <RkText style={{ color: "#ffffff", fontSize: scale(10) }}>Matched</RkText>
                </RkButton>
            )
        } else if (matchStatus === "REQUEST_SENT") {
            return (
                <RkButton rkType="clear" style={{ flexDirection: "column" }}
                //onPress={() => this.setState({ cancleRequestVisible: true })}
                >
                    <Image source={require("../../assets/icons/request.png")} style={{ width: 30, height: 30 }} />
                    <RkText style={{ color: '#ffffff', fontSize: scale(10) }}>request sent</RkText>
                </RkButton>
            )

        } else if (matchStatus === "COMFIRM") {

            return (
                <RkButton rkType="clear" style={{ flexDirection: "column" }}>
                    <FIcon name="heart-o" color='#ECC951' size={scale(25)} />
                    <RkText style={{ color: "#ffffff", fontSize: scale(11) }}> Comfirm</RkText>
                </RkButton>
            )
        }
    }


    async comfirmRequest(matchStatusId) {

        this.setState({ matchStatus: "MATCHED" })

        let path = baseUrl + "/pets/comfirmMatchRequest/" + matchStatusId

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
        }

        let res = await fetch(path, config);

        console.log("comfirm", res._bodyText);
    }


    async deleteRequest(matchStatusId) {

        this.setState({ matchStatus: "NO_STATUS" })

        let path = baseUrl + "/pets/deleteMatchRequest/" + matchStatusId

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
        }

        let res = await fetch(path, config);

        console.log("AAA", res._bodyText);

    }

    matchComfirmDelete() {
        let { matchStatusId } = this.state
        return (
            <View style={{ alignItems: "center", marginTop: scale(10) }}>
                <Text style={{ color: "#ffffff" }}>Sent You a match Request</Text>
                <View style={{ flex: 1, flexDirection: "row", marginTop: scale(8) }}>
                    <RkButton onPress={() => this.comfirmRequest(matchStatusId)} style={{ height: 30, width: 120, backgroundColor: '#ECC951' }}>
                        <Text style={{ color: '#191e1f' }}>COMFIRM</Text>
                    </RkButton>
                    <RkButton onPress={() => this.deleteRequest(matchStatusId)} rkType="clear" style={{ height: 30, width: 120, marginLeft: scale(5), borderWidth: 1, borderColor: '#ECC951' }}>
                        <Text style={{ color: '#ECC951' }}>DELETE</Text>
                    </RkButton>
                </View>
            </View>
        )
    }

    showRequestList() {
        let { requestersLoading, requestList, matchResponseVisible } = this.state;
        let background = matchResponseVisible ? '#566573' : '#2d2d2d'
        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null, }}
                source={require('../../assets/images/background.jpg')}
            >
                <View style={{ backgroundColor: '#191e1f', height: scale(50), alignItems: "center", flexDirection: "row" }}>
                    <RkButton rkType="clear" style={{ marginLeft: scale(18) }} onPress={() => this.setState({ matchRequestModalVisible: false })} >
                        <FIcon name="arrow-left" color='#ECC951' size={scale(15)} />
                    </RkButton>

                    <Text style={{ color: '#ECC951', marginLeft: scale(35), fontSize: scale(18) }}>Match Requests</Text>
                </View>
                {
                    requestersLoading ?
                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                            <ActivityIndicator size="large" color='#ECC951' />
                        </View>
                        :
                        requestList.length === 0 ?
                            <View style={{ flex: 1, alignItems: 'center', marginTop: scale(20) }}>
                                <Text style={{ color: '#ECC951', fontSize: scale(20) }}>NO REQUEST YET !</Text>
                            </View>
                            :
                            <FlatList
                                keyExtractor={(item, index) => item.petId}
                                data={requestList}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.getPetInfo(item.matchRequestFrom._id),
                                                    this.setState({ matchRequestModalVisible: false, loading: true })
                                            }}
                                            style={{
                                                flexDirection: 'row', marginBottom: scale(5),
                                            }}>

                                            <Image
                                                style={{ width: scale(100), height: scale(100), overflow: 'visible' }}
                                                source={{ uri: petProPicUrl + "/" + item.matchRequestFrom.petProPic }}
                                            />
                                            {/* '#566573' */}
                                            <View style={{ paddingLeft: scale(10), flex: 1, justifyContent: "center", backgroundColor: background }}>
                                                <Text style={{ color: "#ffffff", fontSize: scale(15), marginLeft: scale(3) }}>{item.matchRequestFrom.petName}</Text>

                                                <View style={{ flexDirection: 'row', marginVertical: scale(3) }}>
                                                    <MIcon name="place" color='#ffffff' size={20} />
                                                    <Text style={{ color: '#ffffff', marginLeft: scale(5) }}>Mandalay</Text>
                                                </View>
                                                {/* <View style={{marginTop:scale(8)}}>
                                                    <Text style={{ color: '#191e1f' }}>Request Removed</Text>
                                                </View> */}

                                                <View style={{ flexDirection: "row", marginTop: scale(8), height: scale(30) }}>
                                                    <RkButton onPress={() => { this.comfirmRequest(item._id) }} style={{ height: 30, width: 120, backgroundColor: '#ECC951' }}>
                                                        <Text style={{ color: '#191e1f' }}>COMFIRM</Text>
                                                    </RkButton>
                                                    <RkButton onPress={() => { this.deleteRequest(item._id) }} rkType="clear" style={{ height: 30, width: 120, marginLeft: scale(5), borderWidth: 1, borderColor: '#ECC951' }}>
                                                        <Text style={{ color: '#ECC951' }}>DELETE</Text>
                                                    </RkButton>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                }

            </ImageBackground>
        )
    }

    goToPetGallery(mediaId) {
        this.props.navigation.navigate("Gallery", { medias: [] });
    }

    tapToRetryBtnPress() {
        this.setState({ errorView: false, loading: true })
        let { petId } = this.state
        setTimeout(() => this.getPetInfo(petId), 1000)
    }

    activityPress(activity) {

        switch (activity) {
            case 1:
                this.props.navigation.navigate("PetHairCut", { "PetId": this.state.petId })
                break;
            case 2:
                alert(activity)
                break;
            case 3:
                alert(activity)
                break;
            case 4:
                this.props.navigation.navigate("PetVaccination", { "PetId": this.state.petId })
                break;
            case 5:
                alert(activity)
                break;
            case 6:
                alert(activity)
                break;
            default: console.log("default")
        }
    }

    render() {
        let { loading, petInfo, matchRequestModalVisible, errorView, petListLoading, petList, cancleRequestVisible, petListModalVisible, matchStatus } = this.state

        if (loading) {
            return (
                <ImageBackground
                    style={[styles.profileLoading, { width: null, height: null, }]}
                    source={require('../../assets/images/background.jpg')}
                >
                    <ActivityIndicator size="large" color='#FFEB3B' />
                </ImageBackground>
            )
        }

        const proPic = petProPicUrl + "/" + this.state.petInfo.petProPic

        let photo = [{
            source: {
                uri: proPic
            }
        }]

        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null, }}
                source={require('../../assets/images/background.jpg')}
            >

                {
                    errorView ?
                        <RkButton
                            rkType='clear'
                            onPress={() => this.tapToRetryBtnPress()}
                            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
                        <View>
                            <View style={styles.headerBar}>
                                <RkButton rkType="clear" style={{ marginLeft: scale(18) }} onPress={() => this.props.navigation.goBack()} >
                                    <FIcon name="arrow-left" color='#ECC951' size={scale(15)} />
                                </RkButton>
                                <Text style={styles.headerTitle}>Pet Profile</Text>
                                {
                                    LoggedUserCredentials.getOwnerId() === petInfo.owner._id ?
                                        <RkButton
                                            rkType="clear"
                                            onPress={() => this.getRequestList()}
                                            style={{ marginRight: scale(15), flex: 1, justifyContent: "flex-end" }}
                                        >
                                            <MCIcon name="account-heart" size={scale(25)} style={{ marginRight: scale(10) }} color='#ECC951' />
                                        </RkButton>
                                        :
                                        <View />
                                }
                            </View>
                            <ScrollView>
                                <ProfileHeader
                                    petName={petInfo.petName}
                                    petAddress={petInfo.petAddress}
                                    petProPic={petInfo.petProPic}
                                />
                                {
                                    petInfo.owner._id === LoggedUserCredentials.getOwnerId() ?
                                        <View style={{ flexDirection: "column", marginHorizontal: scale(20), marginTop: scale(30) }}>
                                            <View style={{ flexDirection: "row" }}>
                                                <PetActivity
                                                    onClick={(num) => this.activityPress(num)}
                                                    style={styles.activityContainer}
                                                    activity={1}
                                                    text="Hair Cut"
                                                    Icon={<Image source={require("../../assets/icons/hair_cut.png")} style={styles.icon} />}
                                                />
                                                <PetActivity
                                                    onClick={(num) => this.activityPress(num)}
                                                    style={[styles.activityContainer, { marginHorizontal: scale(10) }]}
                                                    activity={2}
                                                    text="Nail Cut"
                                                    Icon={<Image source={require("../../assets/icons/nail.png")} style={styles.icon} />}
                                                />
                                                <PetActivity
                                                    onClick={(num) => this.activityPress(num)}
                                                    style={styles.activityContainer}
                                                    text="Deworming"
                                                    activity={3}
                                                    Icon={<Image source={require("../../assets/icons/deworm.png")} style={styles.icon} />}
                                                />
                                            </View>
                                            <View style={{ flexDirection: "row", marginTop: scale(20) }}>
                                                <PetActivity
                                                    onClick={(num) => this.activityPress(num)}
                                                    style={styles.activityContainer}
                                                    activity={4}
                                                    text="Vaccination"
                                                    Icon={<Image source={require("../../assets/icons/vaccine.png")} style={styles.icon} />}
                                                />
                                                <PetActivity
                                                    onClick={(num) => this.activityPress(num)}
                                                    style={[styles.activityContainer, { marginHorizontal: scale(10) }]}
                                                    text="Medication"
                                                    activity={5}
                                                    Icon={<Image source={require("../../assets/icons/medication.png")} style={styles.icon} />}
                                                />
                                                <PetActivity
                                                    onClick={(num) => this.activityPress(num)}
                                                    style={styles.activityContainer}
                                                    text="Posts"
                                                    activity={6}
                                                    Icon={<MCIcon name="image-multiple" size={scale(40)} style={{ marginRight: scale(10) }} color='#ECC951' />}
                                                />
                                            </View>

                                        </View>
                                        :
                                        <View>
                                            <View style={styles.statusContainer}>

                                                {this.showStatus()}

                                                <RkButton rkType="clear" style={{ flexDirection: "column" }} >
                                                    <EIcon name="message" size={scale(25)} color='#ECC951' />
                                                    <RkText style={{ color: "#ffffff", fontSize: scale(10) }}>Message</RkText>
                                                </RkButton>

                                                <RkButton onPress={() => { this.goToPetGallery([]) }} rkType="clear" style={{ flexDirection: "column" }}>
                                                    <MIcon name="photo-library" size={scale(25)} color='#ECC951' />
                                                    <RkText style={{ color: "#ffffff", fontSize: scale(10) }}>Photo Gallery</RkText>
                                                </RkButton>

                                            </View>
                                            {
                                                matchStatus === "COMFIRM" ?
                                                    <View>
                                                        {this.matchComfirmDelete()}
                                                    </View>
                                                    :
                                                    null
                                            }
                                        </View>


                                }

                            </ScrollView>
                        </View>

                }
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={petListModalVisible}
                    onRequestClose={() => this.setState({ petListModalVisible: false })}
                >
                    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>

                        {
                            petListLoading ?
                                this.gettingPetList()
                                :
                                petList.length === 0 ?
                                    this.noPetsView()
                                    :
                                    this.showPetList()
                        }
                    </View>
                </Modal>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={cancleRequestVisible}
                    onRequestClose={() => this.setState({ cancleRequestVisible: false })}
                >
                    <View style={{ justifyContent: "flex-end", flex: 1 }}>
                        <View style={{ width: "100%", height: "15%", backgroundColor: "#ffffff" }}>
                            <RkButton onPress={() => this.setState({ cancleRequestVisible: false })}
                                style={{ width: "100%", marginTop: 10, backgroundColor: '#ffffff', justifyContent: "flex-start" }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <FIcon name="remove" size={25} />
                                    <Text style={{ marginLeft: scale(10), alignSelf: "center" }}>Remove Request</Text>
                                </View>
                            </RkButton>
                        </View>

                    </View>

                </Modal>

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

                <Modal
                    animationType="none"
                    visible={matchRequestModalVisible}
                    onRequestClose={() => this.setState({ matchRequestModalVisible: false })}
                >
                    {this.showRequestList()}

                </Modal>
            </ImageBackground >
        )
    }
}

let styles = StyleSheet.create({
    profileLoading: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(25, 30, 31,0.5)',
        flex: 1
    },
    headerBar: {
        backgroundColor: '#191e1f',
        height: scale(50),
        alignItems: "center",
        flexDirection: "row"
    },
    headerTitle: {
        color: '#ECC951',
        marginLeft: scale(35),
        fontSize: scale(18)
    },
    icon: {
        width: scale(40),
        height: scale(40)
    },
    statusContainer: {
        flexDirection: "row",
        justifyContent: 'space-around',
        backgroundColor: '#2d2d2d',
        height: scale(50),
        alignItems: "center",
        marginTop: scale(10)
    },
})