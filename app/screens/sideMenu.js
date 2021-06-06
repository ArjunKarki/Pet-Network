import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    Platform,
    ScrollView,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

import Image from 'react-native-image-progress';

import {
    RkButton,
    RkText
} from 'react-native-ui-kitten';

import OneSignal from 'react-native-onesignal';

import { Menu } from '../components';
import { scale } from '../utils/scale';
import LoggedUserCredentials from '../utils/modal/LoggedUserCredentials';
import { ownerProPicUrl, baseUrl } from '../utils/globle';
import { NotificationService } from '../utils/service';

export class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.onLogOut = this.onLogOut.bind(this);
    }

    async onLogOut() {
        OneSignal.sendTag('owner_id', 'LOG_OUT');

        const keys = ['accessToken', 'ownerId', 'ownerName', 'playerId'];

        const data = {
            playerId: LoggedUserCredentials.getPlayerId(),
            ownerId: LoggedUserCredentials.getOwnerId()
        }
        console.log(data)

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
                "Content-Type": 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        }

        const url = baseUrl + "/owners/logout";

        try {
            let res = await fetch(url, config);
            console.log(res)
            if (res.status == 200) {
                await AsyncStorage.multiRemove(keys);
                await NotificationService.deleteAll();
                this.props.navigation.navigate('SignIn');
            } else {
                alert("Can't logout!")
            }

        } catch (err) {
            alert("Can't logout.Please try later.");
        }
    }

    testData() {
        alert('Setting');
    }

    render() {
        const { navigation } = this.props;
        return (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                <View style={styles.header}>
                    <RkButton
                        disabled={true}
                        rkType='clear'
                        onPress={() => alert('Notifications')}>
                    </RkButton>
                    <RkButton
                        disabled={true}
                        rkType='clear'
                        onPress={() => this.testData()}>
                        {/* <Icon name="gear" size={30} color='#ECC951' /> */}
                    </RkButton>
                </View>
                {/* LoggedUserCredentials.getOwnerId() */}
                <TouchableOpacity onPress={() => navigation.navigate('MainOwnerProfile', { ownerId: LoggedUserCredentials.getOwnerId() })}>
                    <View style={styles.imgContainer} >
                        <Image
                            source={{ uri: ownerProPicUrl + '/' + LoggedUserCredentials.getOwnerId() }}
                            style={styles.img}
                            indicatorProps={{
                                color: '#ECC951',
                            }} />
                        <RkText style={styles.txt}>{LoggedUserCredentials.getOwnerName()}</RkText>
                    </View>
                </TouchableOpacity>
                <View style={styles.itemContainer}>
                    <View style={styles.row}>
                        <Menu
                            iconName='home'
                            menuName='Feed'
                            onClick={() => navigation.navigate('Post')}
                        />
                        <Menu
                            iconName='handshake-o'
                            menuName='Meetups'
                            onClick={() => alert('We are working on it.\nComming soon.')}
                            style={{ paddingLeft: scale(20) }}
                        />
                        <Menu
                            iconName='heart-o'
                            menuName='Favourites'
                            onClick={() => alert('We are working on it.\nComming soon.')}
                        />
                    </View>
                    <View style={styles.row}>
                        <Menu
                            iconName='bookmark-o'
                            menuName='Events'
                            onClick={() => { navigation.navigate('Event') }}
                        />
                        <Menu
                            iconName='paw'
                            menuName='My Pets'
                            onClick={() => { alert("comming soon!") }}
                        />
                        <Menu
                            iconName='newspaper-o'
                            menuName='Articles'
                            onClick={() => navigation.navigate('Article')}
                            style={{ paddingRight: scale(8) }}
                        />
                    </View>
                </View>
                <View style={styles.footer} >
                    {/* <RkButton
                            rkType='stretch outline'
                            contentStyle={{ color: '#ECC951' }}
                            style={styles.btn}>
                            Invite Friends
                        </RkButton> */}
                    {/* <RkButton
                            rkType='stretch outline'
                            contentStyle={{ color: '#ECC951' }}
                            style={styles.btn}>
                            Submit Feedback
                        </RkButton> */}
                    <RkButton
                        onPress={this.onLogOut}
                        rkType='stretch outline'
                        contentStyle={{ color: '#ECC951' }}
                        style={styles.btn}>
                        Log Out
                        </RkButton>
                </View>
            </ScrollView>
        )
    }
}

let styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            paddingTop: Platform.OS === 'ios' ? scale(20) : 0,
            backgroundColor: '#191e1f'
        },
        header: {
            height: 60,
            flex: 1,
            flexDirection: 'row',
            marginHorizontal: scale(15),
            justifyContent: 'space-between',
        },
        imgContainer: {
            flex: 3,
            justifyContent: 'center',
            alignItems: 'center',
        },
        img: {
            width: scale(100),
            height: scale(100),
            borderRadius: scale(50),
            marginBottom: 15,
            borderColor: '#ECC951',
            borderWidth: 2,
            overflow: 'hidden'
        },
        txt: {
            color: '#ECC951'
        },
        itemContainer: {
            flex: 3,
            marginHorizontal: 23,
            marginTop: 30,
        },
        row: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10
        },
        footer: {
            flex: 5,
            justifyContent: 'flex-end',
            marginVertical: 20,
        },
        btn: {
            marginTop: 10,
            marginHorizontal: 23,
            borderColor: '#ECC951'
        }
    }
);
