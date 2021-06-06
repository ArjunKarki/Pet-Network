import React from 'react';

import {
    View,
    Image,
    ScrollView,
    ActivityIndicator,
    ImageBackground,
    AsyncStorage,
    TouchableOpacity,
    Modal,
    Text,
    TextInput
} from 'react-native';

import Icon from "react-native-vector-icons/Ionicons";
import Ficon from 'react-native-vector-icons/Zocial';
import md5 from "react-native-md5";

import {
    AccessToken,
    LoginManager,
    GraphRequest,
    GraphRequestManager
} from 'react-native-fbsdk';

import { GoogleSignin } from 'react-native-google-signin';

import {
    RkButton,
    RkText,
    RkTextInput,
    RkStyleSheet,
} from 'react-native-ui-kitten';

import { scale, scaleVertical } from '../../utils/scale';
import { loginUrl, sendResetPasswordEmailUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import OneSignal from 'react-native-onesignal';

export class Login extends React.PureComponent {
    static navigationOptions = () => ({
        header: null
    });

    constructor() {
        super()
        this.state = {
            inputedEmail: '',
            inputedPassword: '',
            loading: false,

            disLoginBtn: false,
            disSignupBtn: false,
            disTwitterBtn: false,
            disGoogleBtn: false,
            disFbBtn: false,

            inputedEmailError: false,
            inputedPasswordError: false,
            loginError: false,
            errorText: '',
            playerId: null,
            playerIdLoading: true,
            isMounted: false,
            fgPasswordModalVisible: false,
            resetBtnLoading: false,
            disResetBtn: false,
            resetEmail: ''
        }
        this.loginWithFb = this.loginWithFb.bind(this);
        this.loginWithGoogle = this.loginWithGoogle.bind(this);
    }

    componentDidMount() {
        OneSignal.getPermissionSubscriptionState((status) => {
            console.log("Status",status)
            userID = status.userId;
            this.setState({ playerIdLoading: false, playerId: userID });
        });
    }

    //logoimage
    _renderImage(image) {
        image = (<Image style={[styles.image, { marginTop: 10 }]}
            source={require('../../assets/images/app_logo.png')} />);
        return image;
    }

    async resendBtnClick() {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let { resetEmail } = this.state;
        if (resetEmail === '') {
            alert("Please enter email!");
        } else if (reg.test(resetEmail) === false) {
            alert("Please enter valid email!")
        } else {
            this.setState({ disResetBtn: true, resetBtnLoading: true })
            let Data = new FormData();

            Data.append("resetEmail", resetEmail)
            

            let path = sendResetPasswordEmailUrl;

            let config = {
                method: "POST",
                body: Data
            }

            let res = await fetch(path, config);
            let resJson = await res.json();
            console.log("res", res);
            console.log("json", resJson);

            if (resJson === "NOT_EXIST") {
                alert("No user found with email " + resetEmail);
                this.setState({
                    disResetBtn: false,
                    resetBtnLoading: false,
                    fgPasswordModalVisible: false,
                })
            } else if (res._bodyText === "CANNOT_SENT_EMAIL") {
                alert("Something went wrong!")
                this.setState({
                    disResetBtn: false,
                    resetBtnLoading: false,
                    fgPasswordModalVisible: false,
                })
            } else if (res.status === 200) {
                let code = resJson.OTP;
                let id = resJson.ownerId;
                this.props.navigation.navigate("ComfirmOTP", { code: code, ownerId: id, from: "login" });
                this.setState({
                    disResetBtn: false,
                    resetBtnLoading: false,
                    fgPasswordModalVisible: false,
                })
            } else {
                alert("Something went wrong!");
                this.setState({
                    disResetBtn: false,
                    resetBtnLoading: false,
                    fgPasswordModalVisible: false,
                })
            }

        }
    }

    render() {
        let {
            inputedEmail,
            inputedPassword,
            loading,
            inputedEmailError,
            inputedPasswordError,
            errorText,
            loginError,
            disLoginBtn,
            disSignupBtn,
            playerIdLoading,
            disResetBtn,
            resetBtnLoading,
        } = this.state
        let image = this._renderImage();

        if (playerIdLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    <ActivityIndicator size='large' />
                </View>
            )
        }
        
        return (
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.imgBackground}
            >
                <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center' }}>
                        {image}
                    </View>
                    <View style={styles.container}>
                        <View style={styles.buttons}>
                            {/* <RkButton style={styles.button} rkType='social'>
                                <RkText rkType='awesome hero'><Icon name='logo-twitter' style={styles.circleIcon} /></RkText>
                            </RkButton> */}
                            <RkButton style={styles.button} rkType='social' onPress={this.loginWithGoogle}>
                                <RkText rkType='awesome hero'><Icon name='logo-google' style={styles.circleIcon} /></RkText>
                            </RkButton>
                            <RkButton style={styles.button} rkType='social' onPress={this.loginWithFb}>
                                <RkText rkType='awesome hero'><Ficon name='facebook' style={styles.circleIcon} /></RkText>
                            </RkButton>
                        </View>
                        {inputedEmailError ? <RkText style={{ color: "#FF0000", fontSize: scale(15), }}>{errorText}</RkText> : null}
                        <RkTextInput
                            keyboardType="email-address"
                            inputStyle={{ color: '#ffffff', fontSize: scale(15) }}
                            style={styles.txtInput}
                            label={<Icon style={styles.iconStyle} name='ios-person-outline' />}
                            onChangeText={(email) => this.setState({ inputedEmail: email, errorText: '', inputedEmailError: false })}
                            value={inputedEmail}
                            rkType='bordered ' placeholder='Email' />
                        {inputedPasswordError ? <RkText style={{ color: "#FF0000", fontSize: scale(15), }}>{errorText}</RkText> : null}
                        <RkTextInput inputStyle={{ color: '#ffffff', fontSize: scale(15) }}
                            style={styles.txtInput}
                            label={<Icon style={styles.iconStyle} name='ios-lock-outline' />}
                            rkType='bordered'
                            placeholder='Password'
                            onChangeText={(password) => this.setState({ inputedPassword: password, errorText: '', inputedPasswordError: false })}
                            value={inputedPassword}
                            secureTextEntry={true} />
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
                            <TouchableOpacity onPress={() => { this.setState({ fgPasswordModalVisible: true }) }}>
                                <RkText rkType="primary3">forgot password?</RkText>
                            </TouchableOpacity>
                        </View>
                        <RkButton
                            rkType='stretch'
                            disabled={disLoginBtn}
                            style={styles.loginBtn}
                            onPress={() => this.loginPress()}>
                            {
                                loading ? <ActivityIndicator size="small" color='#FFEB3B' ></ActivityIndicator> :
                                    <RkText style={styles.loginTxt}>LOGIN</RkText>
                            }
                        </RkButton>
                        {
                            loginError ?
                                <View style={{ alignItems: 'flex-end' }}><RkText style={{ color: "#FF0000", fontSize: scale(15), marginTop: scale(10) }}>{errorText}</RkText></View>
                                :
                                null
                        }
                        <View style={styles.footer}>
                            <View style={styles.textRow}>
                                <RkText rkType='primary3' style={{ paddingRight: scale(5) }}>Don’t have an account?</RkText>
                                <RkButton onPress={this.signUpPress.bind(this)} rkType='clear' disabled={disSignupBtn}>
                                    <RkText rkType='header6' >
                                        Sign up now
                                </RkText>
                                </RkButton>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.fgPasswordModalVisible}
                    onRequestClose={() => {
                        this.setState({ fgPasswordModalVisible: false, resetBtnLoading: false, disResetBtn: false })
                    }}
                >
                    <View style={styles.modalStyle}>
                        <View style={{ backgroundColor: '#ffffff', flexDirection: "column", marginHorizontal: scale(25), flex: 0 }}>
                            <View style={{ backgroundColor: '#191e1f', alignItems: "center", height: scale(70), justifyContent: "center" }}>
                                <Text style={{ marginVertical: scale(5), color: "#ffffff", fontSize: scale(20) }}>Reset Password</Text>
                            </View>
                            <View>
                                <View style={{ height: scale(55), alignItems: "center" }}>
                                    <Text style={{ marginTop: scale(15), color: '#191e1f', fontSize: scale(13) }}>Enter email for password resend request</Text>
                                </View>
                                <View style={{ borderWidth: 0.5, backgroundColor: '#191e1f', marginHorizontal: scale(10), marginBottom: scale(3) }} />
                                <TextInput
                                    keyboardType="email-address"
                                    autoFocus={true}
                                    onChangeText={(input) => { this.setState({ resetEmail: input }) }}
                                    placeholder="Email"
                                    style={{ marginLeft: scale(6) }}
                                />
                                <View style={{ borderWidth: 0.5, backgroundColor: '#191e1f', marginHorizontal: scale(10), marginBottom: scale(12) }} />
                                <RkButton rkType="stretch" style={styles.modalBtnStyle} disabled={disResetBtn} onPress={() => {
                                    this.resendBtnClick()
                                }}>
                                    {
                                        resetBtnLoading ?
                                            <ActivityIndicator size="small" color='#FFEB3B' ></ActivityIndicator>
                                            :
                                            <RkText style={{ color: "#FFEB3B", alignSelf: 'center' }}> Send resend request</RkText>
                                    }

                                </RkButton>
                            </View>
                        </View>

                    </View>
                </Modal>
            </ImageBackground>
        )
    }

    loginPress() {
        let {
            inputedEmail,
            inputedPassword,
            playerId
        } = this.state;

        let errorText = '';
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (inputedEmail === '') {
            errorText = "Please enter your email!"
            this.setState({ inputedEmailError: true, inputedPasswordError: false, loginError: false, errorText: errorText })
        } else if (reg.test(inputedEmail) === false) {
            errorText = "Please enter valid email!"
            this.setState({ inputedEmailError: true, inputedPasswordError: false, loginError: false, errorText: errorText })
        } else if (inputedPassword == '') {
            errorText = "Please enter password"
            this.setState({ inputedPasswordError: true, inputedEmailError: false, loginError: false, errorText: errorText });
        } else {
            OneSignal.getPermissionSubscriptionState(this.onIdGet);
        }
    }

    onIdGet = (status) => {
        const { inputedEmail, inputedPassword } = this.state;
        this.tryToLogin(inputedEmail, inputedPassword, status.userId);
    }

    async tryToLogin(email, password, playerId) {

        this.setState({
            loading: true,
            disTwitterBtn: true,
            disGoogleBtn: true,
            disFbBtn: true,
            disLoginBtn: true,
            disSignupBtn: true
        });

        let loginData = {
            email: email,
            password: md5.hex_md5(password),
            playerId: playerId
        }

        let path = loginUrl;

        let config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        }

        try {
            let res = await fetch(path, config);

            let resJson = await res.json();
            console.log(res)
            console.log(resJson)
            if (res.status == 401) {
                let errorText = "Login fail.Try again!"
                this.setState({ loading: false, loginError: true, errorText: errorText, disLoginBtn: false, disSignupBtn: false })
            } else if (res.status == 200) {
                const accessTokenArray = ['accessToken', resJson.token];
                const ownerIdArray = ['ownerId', resJson.ownerId];
                const ownerNameArray = ['ownerName', resJson.ownerName];
                const playerIdArray = ['playerId', playerId]

                LoggedUserCredentials.setLoggedUserData(resJson.token, resJson.ownerName, resJson.ownerId, playerId);

                await AsyncStorage.multiSet([accessTokenArray, ownerIdArray, ownerNameArray, playerIdArray]);
                this.props.navigation.navigate("App");
                this.setState({ loading: false, disLoginBtn: false, disSignupBtn: false });
            } else {
                let errorText = "Something Wrong.Try Again!"
                this.setState({ loading: false, loginError: true, errorText: errorText, disLoginBtn: false, disSignupBtn: false })
            }

        } catch (error) {
            let errorText = "Please connect to internet!"
            console.log(error);
            this.setState({ loading: false, errorText: errorText, loginError: true, disLoginBtn: false, disSignupBtn: false })
        }
    }

    _responseInfoCallback = (error, result) => {
        if (error) {
            console.log(error);
            alert("Oops Something Went Wrong!")
        } else {
            console.log(result);
            const { navigate } = this.props.navigation;
            navigate("SignUp", { fbData: result });

        }
    }

    async loginWithFb() {

        try {
            const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                console.log('User Canceled Request');
            } else {
                // get the access token
                const data = await AccessToken.getCurrentAccessToken();

                if (!data) {
                    console.log('Error fetching data');
                }

                const infoRequest = new GraphRequest(
                    '/me',
                    {
                        accessToken: data.accessToken,
                        parameters: {
                            fields: {
                                string: 'email,first_name,last_name,picture'
                            }
                        }
                    },
                    this._responseInfoCallback,
                );

                new GraphRequestManager().addRequest(infoRequest).start();
            }

        } catch (e) {
            console.error(e);
        }
    }

    async loginWithGoogle() {
        try {
            // Add any configuration settings here:
            // 547729119637-fcen3f52thjg9rffuckigb17s8d7ik66.apps.googleusercontent.com
            await GoogleSignin.configure({
                //iosClientId: '732876700165-qo7tuigs9v4mol3qtqbtvcvngle8nbae.apps.googleusercontent.com',
                webClientId: '423373763829-96fvfn6p3qc5jlirt5tk7r3an1nie10t.apps.googleusercontent.com',
                offlineAccess: false
            });

            const data = await GoogleSignin.signIn();
            this.props.navigation.navigate("SignUp", { googleData: data });
        } catch (e) {
            console.error(e);
        }
    }

    signUpPress() {
        this.setState({
            inputedEmail: '',
            inputedEmailError: false,
            inputedPassword: '',
            inputedPasswordError: false,
            loading: false,
            disLoginBtn: false,
            disSignupBtn: false,
            errorText: ''
        })

        const { navigate } = this.props.navigation;
        navigate("SignUp")
    }
}

let styles = RkStyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    txtInput: {
        borderWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#FFEB3B",
        borderBottomColor: "#FFEB3B",
        backgroundColor: 'rgba(25, 30, 31,0.5)',
    },
    iconStyle: {
        fontSize: scale(25),
        marginLeft: scale(25),
        color: '#ffffff'
    },
    circleIcon: {
        fontSize: scale(25),
        color: '#FFEB3B'
    },
    image: {
        resizeMode: 'cover',
        marginBottom: scaleVertical(10),
        width: scale(200),
        height: scale(200),
        borderRadius: scale(250)
    },
    container: {
        paddingHorizontal: scale(17),
        paddingBottom: scaleVertical(22),

    },
    footer: {
        justifyContent: 'flex-end',
        flex: 1,
        marginTop: scale(15)
    },
    loginBtn: {
        height: scale(55),
        backgroundColor: 'rgba(25, 30, 31,0.5)',
        borderWidth: 1,
        borderColor: '#FFEB3B',
        marginTop: scale(10),
    },
    loginTxt: {
        color: "#FFFFFF",
        fontWeight: 'bold',
        fontSize: scale(18),
        color: '#FFEB3B'
    },
    buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scaleVertical(24),
    },
    button: {
        marginHorizontal: scale(14)
    },
    textRow: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imgBackground: {
        flex: 1,
        width: null,
        height: null
    },
    modalStyle: {
        flex: 1,
        justifyContent: "center",

    },
    modalBtnStyle: {
        backgroundColor: '#191e1f',
        borderRadius: 0,
        height: scale(60)
    }
});

