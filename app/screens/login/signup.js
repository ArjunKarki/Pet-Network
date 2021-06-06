import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import md5 from 'react-native-md5';

import {
    scale,
} from '../../utils/scale';

import {
    Image,
    ScrollView,
    View,
    Text,
    StyleSheet,
    ImageBackground
} from 'react-native';

import {
    RkTextInput,
    RkButton,
    RkText,
} from 'react-native-ui-kitten';

import OneSignal from 'react-native-onesignal';

import { signupUrl } from '../../utils/globle';
import { Owner } from '../../utils/modal/Owner';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class SignUp extends Component {
    static navigationOptions = () => ({
        header: null
    })

    constructor(props) {
        super(props)
        this.state = {
            // fbData: props.navigation.state.params ? props.navigation.state.params.fbData : "",
            socialData: props.navigation.state.params ? props.navigation.state.params : "",
            signupEmail: '',
            signupPassword: '',
            signupConfirmPassword: '',
            loading: false,
            disNextBtn: false,
            errorText: '',
            signupEmailErr: false,
            signupPasswordErr: false,
            signupConfirmPasswordErr: false,
            signupErr: false,
            disSignInBtn: false
        }
        console.log("Signup", this.state.socialData);
        this.onIds = this.onIds.bind(this);
    }

    componentDidMount() {
        let { socialData } = this.state
        if (socialData !== "") {
            if (socialData.fbData) {
                this.setState({ signupEmail: socialData.fbData.email })
            } else if (socialData.googleData) {
                this.setState({ signupEmail: socialData.googleData.user.email })
            }
        }
        OneSignal.configure();
        OneSignal.addEventListener('ids', this.onIds);

    }

    onIds(id) {
        LoggedUserCredentials.setPlayerId(id.userId);
    }

    render() {
        let {
            loading,
            signupEmail,
            signupPassword,
            signupConfirmPassword,
            signupEmailErr,
            signupPasswordErr,
            signupConfirmPasswordErr,
            signupErr,
            errorText,
            disNextBtn,
            disSignInBtn,
            socialData
        } = this.state;
        console.log("Scocialkjfkjfk", socialData)

        return (

            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.imgBackground}
            >
                <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false} >
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../../assets/images/avator.png')}
                            style={{ width: scale(130), height: scale(130), marginTop: scale(10), borderRadius: scale(250) }} />
                        <Text style={styles.txtStyle}>Registration</Text>
                    </View>

                    <View style={{ marginHorizontal: scale(25) }}>
                        {signupEmailErr ? <RkText style={{ color: "#FF0000", fontSize: scale(15), }}>{errorText}</RkText> : null}
                        <RkTextInput inputStyle={{
                            color: '#ffffff',
                            fontSize: scale(15)
                        }} rkType='bordered custom'
                            placeholder='Email'
                            keyboardType="email-address"
                            placeholderTextColor='#848482'
                            editable={socialData === "" ? true : false}
                            // editable={this.state.socialData === "" ? true : false}
                            style={styles.txtInput}
                            onChangeText={(email) => { this.setState({ signupEmail: email, signupEmailErr: false, errorText: '' }) }}
                            value={signupEmail} />

                        {signupPasswordErr ? <RkText style={{ color: "#FF0000", fontSize: scale(15), }}>{errorText}</RkText> : null}
                        <RkTextInput inputStyle={{
                            color: '#ffffff',
                            fontSize: scale(15)
                        }} secureTextEntry={true}
                            rkType='bordered custom'
                            placeholder='Password'
                            placeholderTextColor='#848482'
                            style={styles.txtInput}
                            onChangeText={(password) => { this.setState({ signupPassword: password, signupPasswordErr: false, errorText: '', signupErr: false }) }}
                            value={signupPassword} />

                        {signupConfirmPasswordErr ? <RkText style={{ color: "#FF0000", fontSize: scale(15), }}>{errorText}</RkText> : null}
                        <RkTextInput inputStyle={{
                            color: '#ffffff',
                            fontSize: scale(15)
                        }} secureTextEntry={true}
                            rkType='bordered custom' placeholder='Confirm Password'
                            style={styles.txtInput} onChangeText={(confpassword) => { this.setState({ signupConfirmPassword: confpassword, errorText: '', signupConfirmPasswordErr: false, signupErr: false }) }}
                            value={signupConfirmPassword} />

                        <RkButton disabled={disNextBtn} rkType='stretch' style={styles.btnNext} onPress={this.onSignUpPress.bind(this)}>
                            {loading ? <ActivityIndicator size="small" color='#FFEB3B'></ActivityIndicator> : <RkText style={styles.txtNext}>NEXT</RkText>}
                        </RkButton>

                        {
                            signupErr ? <View style={{ alignItems: 'flex-end', marginTop: scale(8) }}>
                                <RkText style={{ color: "#FF0000", fontSize: scale(15), justifyContent: 'flex-end' }}>{errorText}</RkText>
                            </View> :
                                null
                        }

                        <View style={styles.footer}>
                            <View style={styles.textRow}>
                                <RkText rkType='primary3'>Already have an account?</RkText>
                                <RkButton disabled={disSignInBtn} rkType='clear' onPress={() => { this.props.navigation.navigate("SignIn") }}>
                                    <RkText disabled={disSignInBtn} rkType='header6'> Sign in now </RkText>
                                </RkButton>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </ImageBackground>
        )
    }

    async  onSignUpPress() {
        let { signupEmail, signupPassword, signupConfirmPassword, socialData } = this.state
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let errorText = ""
        if (signupEmail === '') {
            errorText = "Please enter email!";
            this.setState({ signupEmailErr: true, signupPasswordErr: false, signupConfirmPasswordErr: false, errorText: errorText });
        } else if (reg.test(signupEmail) === false) {
            errorText = "Please enter valid email!";
            this.setState({ signupEmailErr: true, signupPasswordErr: false, signupConfirmPasswordErr: false, errorText: errorText });
        } else if (signupPassword === '') {
            errorText = "Please enter password!"
            this.setState({ signupPasswordErr: true, signupEmailErr: false, signupConfirmPasswordErr: false, errorText: errorText });
        } else if (signupPassword.length < 6) {
            errorText = "Please Enter at least 6 character";
            this.setState({ signupPasswordErr: true, signupEmailErr: false, signupConfirmPasswordErr: false, errorText: errorText });
        } else if (signupConfirmPassword === '') {
            errorText = "Please enter confirm password"
            this.setState({ signupConfirmPasswordErr: true, signupEmailErr: false, signupPasswordErr: false, errorText: errorText })
        } else if (signupPassword !== signupConfirmPassword) {
            errorText = "Password do not match!"
            this.setState({ signupErr: true, signupEmailErr: false, signupPasswordErr: false, signupConfirmPasswordErr: false, errorText: errorText });
        } else {

            this.setState({ loading: true, disNextBtn: true, disSignInBtn: true });
            let signupData = {
                email: signupEmail
            }

            let config = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(signupData)
            };
            try {
                let res = await fetch(signupUrl, config);
                console.log(res);
                let resJson = await res.json();
                if (resJson.message === "EXIST") {

                    this.setState({
                        loading: false,
                        signupErr: true,
                        disNextBtn: false,
                        disSignInBtn: false,
                        errorText: 'This email already exists.Try another!'
                    })
                } else if (resJson.message === "NOT_EXIST") {
                    Owner.setEmailPassword(signupEmail, signupPassword);
                    if (socialData === "") {
                        this.props.navigation.navigate("OwnerInfo");
                    } else {
                        this.props.navigation.navigate("OwnerInfo", { socialData: socialData });
                    }
                    this.setState({ loading: false, disNextBtn: false, disSignInBtn: false });
                } else {
                    this.setState({ loading: false, disNextBtn: false, disSignInBtn: false });
                    alert("Something wrong!");
                }
            } catch (error) {
                alert("Something wrong!");
                this.setState({
                    loading: false,
                    signupErr: true,
                    disNextBtn: false,
                    disSignInBtn: false,
                    errorText: 'Something Went Wrong!'
                })
            }
        }
    }
}

let styles = StyleSheet.create({
    txtStyle: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: scale(26),
        marginTop: scale(8),
        marginBottom: scale(6),
        color: '#ffffff'
    },
    txtInput: {
        borderWidth: scale(1),
        borderBottomWidth: scale(1),
        borderColor: "#FFEB3B",
        borderBottomColor: "#FFEB3B",
        backgroundColor: 'rgba(25, 30, 31,0.5)'
    },

    btnNext: {
        height: scale(55),
        backgroundColor: 'rgba(25, 30, 31,0.5)',
        borderWidth: scale(1),
        borderColor: '#FFEB3B',
        marginTop: scale(10)
    },
    txtNext: {
        color: "#FFEB3B",
        fontWeight: 'bold',
        fontSize: scale(19),
    },
    footer: {
        justifyContent: 'flex-end',
        flex: 1,
        marginTop: scale(10)
    },
    textRow: {
        justifyContent: 'center',
        flexDirection: 'row',
    },
    imgBackground: {
        flex: 1,
        width: null,
        height: null
    }
})

