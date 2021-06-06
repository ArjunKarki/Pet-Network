import React, { Component } from 'react';
import { View, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native';
import { RkText, RkTextInput, RkButton } from 'react-native-ui-kitten';
import { scale } from '../../utils/scale';
import { Owner } from '../../utils/modal/Owner';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class ComfirmOTP extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            userEnterCode: [],
            loading: false,
            disBtn: false
        }
    }

    render() {
        let { userEnterCode, loading, disBtn } = this.state
        //Please Enter verification code that was sent to Email 
        //Enter Your code Here
        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: scale(20) }}>
                    <RkText style={{ color: '#ffffff', fontSize: scale(18) }}>Please enter verification code that</RkText>
                    <RkText style={{ color: '#ffffff', fontSize: scale(18) }}> was sent to your email </RkText>
                    <RkText style={{ color: '#ffffff', fontSize: scale(15), marginTop: scale(30) }} >Enter your code here </RkText>

                    <RkTextInput
                        autoFocus={true}
                        maxLength={6}
                        onChangeText={(input) => this.setState({ userEnterCode: input })}
                        keyboardType='number-pad'
                        style={{ width: scale(180), marginTop: scale(20), }}
                    />
                    {/* <View style={{ flexDirection: 'row' }}>
                        <RkText rkType='primary3'>Did not get code?</RkText>
                        <RkButton rkType='clear' onPress={() => { alert("Wait!") }}>
                            <RkText rkType='header6'> Resent Code. </RkText>
                        </RkButton>
                    </View> */}
                    <RkButton disabled={disBtn} onPress={() => this.VarifyAndSendData()} rkType="stretch" style={styles.btnStyle}>
                        {
                            loading ? <ActivityIndicator color='#FFEB3B' />
                                :
                                <RkText style={{ color: '#ECC951' }}>VERIFY</RkText>
                        }

                    </RkButton>
                </View>
            </ImageBackground>
        )
    }

    async VarifyAndSendData() {
        let actualCode = [];
        let { userEnterCode } = this.state;
        actualCode = this.props.navigation.state.params.code;
        console.log("code", actualCode)
        this.setState({ loading: true, disBtn: true })

        //When Code length is less than 6
        if (userEnterCode.length !== 6) {
            this.setState({ loading: false, disBtn: false })
            alert("Please type all pin")
            //When code do not matchSS
        } else if (userEnterCode !== actualCode) {
            this.setState({ loading: false, disBtn: false })
            alert("This pin is invalid");
            //when code mathch
        } else if (userEnterCode === actualCode) {
            if (this.props.navigation.state.params.from === "login") {
                this.props.navigation.navigate("NewPassword", { ownerId: this.props.navigation.state.params.ownerId });
                this.setState({ loading: false, disBtn: false, userEnterCode: [] })
            } else {
                let result = await Owner.storeOwnerInfo();
                console.log("Comfirm_OTP", result);
                if (result === "SAVED") {
                    this.props.navigation.navigate("App");
                    this.setState({ loading: false, disBtn: false });
                } else if (result === "ERROR") {
                    this.setState({ loading: false, disBtn: false })
                    alert("Can't save information!")
                } else {
                    alert("This Email already exists!")
                    this.setState({ loading: false, disBtn: false })
                    this.props.navigation.navigate("SignUp")
                }
            }
        } else {
            console.log("Please enter valid pin!");
        }
    }
}

const styles = StyleSheet.create({
    btnStyle: {
        marginHorizontal: scale(15),
        marginTop: scale(10),
        borderWidth: 2,
        backgroundColor: '#242124',
        borderColor: '#ECC951'
    }
})
