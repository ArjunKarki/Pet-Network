import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    StatusBar,
    ImageBackground,
    AsyncStorage
} from 'react-native';

import { RkTheme } from 'react-native-ui-kitten'
import { ProgressBar } from '../../components';
import { KittenTheme } from '../../config/theme';
import { scale } from '../../utils/scale';

import { OneSignal_APP_Id } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

import OneSignal from 'react-native-onesignal';

let timeFrame = 500;

export class SplashScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
        }

        OneSignal.init(OneSignal_APP_Id);
        //OneSignal.inFocusDisplaying(0);
    }

    componentDidMount() {
        StatusBar.setHidden(true, 'none');
        RkTheme.setTheme(KittenTheme);

        this.timer = setInterval(() => {
            if (this.state.progress == 1) {
                clearInterval(this.timer);
                setTimeout(() => {
                    StatusBar.setHidden(false, 'slide');
                    const keys = ['accessToken', 'ownerId', 'ownerName', 'playerId'];
                    AsyncStorage.multiGet(keys).then(data => {
                       
                        if (data) {
                            const accessToken = data[0][1];
                            const ownerId = data[1][1];
                            const ownerName = data[2][1];
                            const playerId = data[3][1]
                            if (accessToken && ownerId && ownerName && playerId) {
                                LoggedUserCredentials.setLoggedUserData(accessToken, ownerName, ownerId, playerId);
                                this.props.navigation.navigate('App');
                            } else {
                                this.props.navigation.navigate('Auth');
                            }
                        } else {
                     
                            this.props.navigation.navigate('Auth');
                        }
                    });
                }, timeFrame);

            } else {
                let random = Math.random() * 0.5;
                let progress = this.state.progress + random;
                if (progress > 1) {
                    progress = 1;
                }
                this.setState({ progress });
            }
        }, timeFrame);
    }

    render() {
        let width = Dimensions.get('window').width;
        return (
            <View style={styles.container}>
                <ImageBackground style={styles.image} source={require('../../assets/images/splashBack.jpg')} />
                <ProgressBar
                    color={RkTheme.current.colors.accent}
                    style={styles.progress}
                    progress={this.state.progress} width={scale(width)} />
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        width: null,
        height: null
    },
    progress: {
        backgroundColor: '#e5e5e5'
    }
});