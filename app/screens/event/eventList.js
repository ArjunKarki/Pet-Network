
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import { RkButton, RkText } from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import Icon from 'react-native-vector-icons/Entypo';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { CommunityEvent } from './communityEvent';
import { MyEvent } from './myEvent';
import { NearByEvent } from './nearByEvent';

export class EventList extends PureComponent {
    static navigationOptions = ({ navigation }) => ({
        title: 'Events List',
        headerStyle: {
            backgroundColor: '#191e1f',
            elevation: 0
        },
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerLeft: (
            <RkButton
                rkType='clear'
                contentStyle={{ color: '#ECC951' }}
                style={{ width: 40, marginLeft: 8 }}
                onPress={() => { navigation.openDrawer() }}>
                <RkText rkType='awesome'>{FontAwesome.bars}</RkText>
            </RkButton>
        )
    });

    goToPostList(eventId) {
        this.props.navigation.navigate("EventPosts", { eventId });
    }

    goToProfile(ownerId) {
        this.props.navigation.navigate("MainOwnerProfile", { ownerId: ownerId })
    }

    refreshEvent() {
        this.props.navigation.navigate('CreateEvent', {
            "refreshEventList": () => this.ref.getData()
        });
    }

    render() {
        return (
            <ImageBackground
                style={styles.imgBack}
                source={require('../../assets/images/background.jpg')}>

                {/* tab view */}
                <ScrollableTabView
                    tabBarBackgroundColor='#191e1f'
                    tabBarActiveTextColor='#ECC951'
                    tabBarInactiveTextColor='#ffffff'
                    tabBarUnderlineStyle={{ backgroundColor: '#ECC951' }}
                >
                    <CommunityEvent tabLabel='Event'
                        ref={commEvent => this.ref = commEvent}
                        goToPostList={(eventId) => this.goToPostList(eventId)}
                        goToProfile={(ownerId) => this.goToProfile(ownerId)}
                    />
                    <MyEvent tabLabel='My Event'
                        ref={commEvent => this.ref = commEvent}
                        goToPostList={(eventId) => this.goToPostList(eventId)}
                        goToProfile={(ownerId) => this.goToProfile(ownerId)}
                    />
                    <NearByEvent tabLabel='NearBy Event'
                        ref={commEvent => this.ref = commEvent}
                        goToPostList={(eventId) => this.goToPostList(eventId)}
                        goToProfile={(ownerId) => this.goToProfile(ownerId)}
                    />
                </ScrollableTabView>

                {/* fab button */}
                <TouchableOpacity
                    onPress={() => this.refreshEvent()}
                    style={styles.fabButton}>
                    <Icon name="plus" style={{ color: '#ECC951', fontSize: 30, margin: 5 }} />
                </TouchableOpacity>

            </ImageBackground >
        )
    }
}

const styles = StyleSheet.create({
    imgBack: {
        flex: 1,
        width: null,
        height: null
    },
    fabButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 60,
        height: 60,
        backgroundColor: '#191e1f',
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2
    }
})