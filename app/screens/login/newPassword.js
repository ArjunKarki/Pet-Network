import React, { Component } from 'react';
import { View, Text, ImageBackground, ActivityIndicator, BackHandler } from 'react-native'
import { RkTextInput, RkButton, RkText } from 'react-native-ui-kitten'
import { scale } from '../../utils/scale';
import md5 from "react-native-md5";
import { saveNewPasswordUrl } from '../../utils/globle';
export class NewPassword extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            newPassword: "",
            confNewPassword: "",
            errorText: '',
            passwordError: false,
            loading: false,
            disBtn: false,
            confPasswordError: false,

        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.props.navigation.navigate("SignIn");
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    async btnClick() {
        this.setState({ loading: true, disBtn: true });
        let { newPassword, confNewPassword } = this.state;
        let ownerId = this.props.navigation.state.params.ownerId;
        let errText = "";
        if (newPassword === "") {
            errText = "Please enter new password!"
            this.setState({ passwordError: true, confPasswordError: false, errorText: errText, loading: false, disBtn: false });
        } else if (newPassword.length < 6) {
            errText = "Please Enter at least 6 character"
            this.setState({ passwordError: true, confPasswordError: false, errorText: errText, loading: false, disBtn: false });

        } else if (confNewPassword === "") {
            errText = "Confirm your password"
            this.setState({ confPasswordError: true, passwordError: false, errorText: errText, loading: false, disBtn: false });
        } else if (newPassword !== confNewPassword) {
            errText = "Password do not match!";
            this.setState({ confPasswordError: true, passwordError: false, errorText: errText, loading: false, disBtn: false });
        } else {
            this.setState({ loading: true, disBtn: true })
            let Data = new FormData()
            Data.append("ownerId", ownerId)
            Data.append("newPassword", md5.hex_md5(newPassword));

            let path = saveNewPasswordUrl + "/" + ownerId;

            let config = {
                method: "POST",
                body: Data
            }

            let res = await fetch(path, config);

            let resJson = await res.json();

            console.log("newPassword", res);
            console.log("Json", resJson);

            if (resJson === "OK") {
                this.props.navigation.navigate("SignIn")
                this.setState({
                    loading: false,
                    disBtn: false
                })
            } else {
                alert("Something Wrong!");
                this.setState({
                    loading: false,
                    disBtn: false
                })
            }
        }


    }

    render() {
        let { errorText, passwordError, loading, disBtn, confPasswordError } = this.state;
        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                <View style={{ flexDirection: "column", }}>

                    <View style={{ alignItems: "center", marginTop: scale(20) }}>
                        <Text style={{ color: "#ffffff", fontSize: scale(17), marginBottom: scale(15) }}>Create a new password</Text>
                        <Text style={{ color: "#ffffff", marginBottom: scale(5) }}>You'll use this password to access your account.</Text>
                        <Text style={{ color: "#ffffff" }}>Enter a combination of at least six numbers or character.</Text>
                    </View>
                    <View style={{ marginHorizontal: scale(25), marginTop: scale(20) }}>
                        {passwordError ? <RkText style={{ color: "#FF0000", fontSize: scale(13), marginLeft: scale(5) }}>{errorText}</RkText> : null}

                        <RkTextInput
                            autoFocus={true}
                            inputStyle={{ fontSize: scale(17) }}
                            placeholder='Type a new password'
                            onChangeText={(input) => this.setState({ newPassword: input, passwordError: false, confPasswordError: false })}
                            secureTextEntry={true} />

                        {confPasswordError ? <RkText style={{ color: "#FF0000", fontSize: scale(13), marginLeft: scale(5) }}>{errorText}</RkText> : null}
                        <RkTextInput
                            inputStyle={{ fontSize: scale(17) }}
                            placeholder='Confirm new password'
                            onChangeText={(input) => this.setState({ confNewPassword: input, confPasswordError: false, passwordError: false })}
                            secureTextEntry={true} />

                        <RkButton
                            disabled={disBtn}
                            rkType='stretch'
                            onPress={() => { this.btnClick() }}
                            style={{ marginTop: scale(5), height: scale(45), borderWidth: 2, borderColor: "#FFEB3B", backgroundColor: 'rgba(25, 30, 31,0.5)', borderRadious: 10 }}
                        >
                            {
                                loading ? <ActivityIndicator size="small" color='#FFEB3B' ></ActivityIndicator>
                                    :
                                    <RkText style={{ color: "#ffffff" }}>Continue</RkText>
                            }

                        </RkButton>
                    </View>
                </View>
            </ImageBackground>

        )
    }
}
