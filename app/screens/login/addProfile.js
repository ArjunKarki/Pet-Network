import React, { Component } from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { RkCard, RkButton, RkText } from 'react-native-ui-kitten';
import { Owner } from '../../utils/modal/Owner';
import { scale } from '../../utils/scale'

export class AddProfile extends Component {

    static navigationOptions = {
        header: null
    }

    constructor() {
        super()
        this.state = {
            loading: false,
            description: '',
            proPic: null,
            disDoneBtn: false
        }
    }

    async pickImage() {
        let images = null
        try {
            images = await ImagePicker.openPicker({ multiple: false, cropping: true });
            this.setState({ proPic: images });
        } catch (e) {
            console.log(e)
        }
    }

    renderImg() {
        let { proPic } = this.state
        if (proPic === null) {
            return (
                <RkCard>
                    <Image style={styles.imageStyle} source={require('../../assets/images/avator.png')} />
                </RkCard>
            )
        }
        return <Image style={{ width: scale(170), height: scale(170) }} source={{ uri: proPic.path }} />
    }

    render() {
        const { loading, description, disDoneBtn } = this.state
        return (
            <ScrollView style={styles.mainContainer} keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                <View style={styles.textContainer} >
                    <RkText style={styles.textStyle}>Upload An Profile Image And Say </RkText>
                    <RkText style={styles.textStyle}> Something About You!</RkText>
                </View>
                <TouchableOpacity onPress={() => this.pickImage()}>
                    <View style={styles.imageContainer} >
                        {this.renderImg()}
                    </View>
                </TouchableOpacity>
                <View style={styles.textInputConainer}>
                    <RkCard rkCardContent style={{ backgroundColor: '#242124', borderWidth: scale(2), borderColor: '#FFEB3B' }}>
                        <TextInput placeholder="Something about you!"
                            onChangeText={(input) => this.setState({ description: input })}
                            value={description}
                            multiline={true}
                            numberOfLines={4}
                            placeholderTextColor='#848482'
                            underlineColorAndroid='transparent'
                            style={{ textAlignVertical: 'top', color: '#ffffff', fontSize: scale(18), opacity: 0.8 }}
                        />
                    </RkCard>
                </View>

                <View style={styles.btnContainer}>
                    <RkButton
                        disabled={disDoneBtn}
                        rkType='stretch'
                        style={styles.signupBtn}
                        onPress={() => this.sendSecondPageData()}
                    >
                        {
                            loading ? <ActivityIndicator color='#FFEB3B' /> :
                                <RkText style={styles.SignupTxt}>Done</RkText>
                        }
                    </RkButton>
                </View>
            </ScrollView>
        )
    }

    async sendSecondPageData() {

        //this.props.navigation.navigate("ComfirmOTP");
        let { description, proPic } = this.state;

        if (proPic) {
            this.setState({ loading: true, disDoneBtn: true })
            //this.setState({ loading: true,disDoneBtn:true })
            let result = await Owner.setSecondPageData(description, proPic);

            if (result === "ERROR") {
                this.setState({ loading: false, disDoneBtn: false });
                alert("Cannot send code to your email!");
                this.props.navigation.navigate("SignUp")
            } else {
                this.setState({ loading: false, disDoneBtn: false })
                let code = result
                this.props.navigation.navigate("ComfirmOTP", { code: code });
            }
        } else {
            alert('Please select profile picture.');
        }

    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#242124'
    },
    imageContainer: {
        marginTop: scale(30),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: scale(10)
    },
    textContainer: {
        marginTop: scale(20),
        marginHorizontal: scale(10),
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle: {
        color: '#ffffff',
        fontSize: scale(17),
        opacity: 0.8
    },
    imageStyle: {
        width: scale(200),
        height: scale(220)
    },
    textInputConainer: {
        marginHorizontal: scale(15),
        backgroundColor: '#242124',
        borderColor: '#FFEB3B',
        marginVertical: scale(20),

    },
    signupBtn: {
        marginHorizontal: scale(10),
        borderWidth: scale(2),
        height: scale(55),
        marginVertical: scale(20),
        backgroundColor: '#242124',
        borderColor: '#FFEB3B'
    },
    SignupTxt: {
        color: '#FFEB3B',
        fontSize: scale(22)
    }
})
