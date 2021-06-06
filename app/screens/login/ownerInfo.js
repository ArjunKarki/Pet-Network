import React, { Component } from 'react';

import {
    RadioGroup,
    RadioButton
} from 'react-native-flexi-radio-button';

import {
    View,
    ScrollView,
    TextInput,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
    Text
} from 'react-native';

import {
    RkCard,
    RkText,
    RkButton,
} from 'react-native-ui-kitten';

let today = new Date();
import CountryPicker from 'react-native-country-picker-modal';
import DatePicker from 'react-native-datepicker';
import { Owner } from '../../utils/modal/Owner';
import { scale } from '../../utils/scale';

export class OwnerInfo extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            socialData: props.navigation.state.params ? props.navigation.state.params.socialData : "",
            loading: false,
            cca2: 'MM',
            callingCode: '95',
            country: 'Myanmar',
            date: "01-01-1980",
            firstName: '',
            lastName: '',
            city: '',
            job: '',
            phNo: '',
            gender: 'Male'
        }
    }
    componentDidMount() {
        let { socialData } = this.state;
        if (socialData !== "") {
            if (socialData.fbData) {
                this.setState({
                    firstName: socialData.fbData.first_name,
                    lastName: socialData.fbData.last_name
                })
            } else if (socialData.googleData) {
                this.setState({
                    firstName: socialData.googleData.user.givenName,
                    lastName: socialData.googleData.user.familyName,
                })
            }
        }
    }

    render() {

        let {
            firstName,
            lastName,
            city,
            job,
            loading
        } = this.state

        return (
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.imgBackground}
            >
                <ScrollView
                    style={styles.mainContain}
                    keyboardShouldPersistTaps='always'
                    showsVerticalScrollIndicator={false}>
                    <View
                        style={{ marginHorizontal: scale(10), marginTop: scale(20), marginBottom: scale(10), justifyContent: 'center', alignItems: 'center' }}>
                        <RkText style={{ color: '#ffffff', fontSize: scale(15) }}>Create a profile so people can know</RkText>
                        <RkText style={{ color: '#ffffff', fontSize: scale(15) }}>that its you!</RkText>
                    </View>
                    <View style={[styles.infoView]}>
                        <RkCard rkCardContent style={{ backgroundColor: 'rgba(25, 30, 31,0.5)' }}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <View style={[styles.nameContainer, { marginVertical: scale(10) }]}>
                                    <RkText style={styles.commonTxt}>First Name</RkText>
                                    <TextInput onChangeText={(input) => { this.setState({ firstName: input }) }}
                                        placeholderTextColor='#848482'
                                        style={styles.commonInput}
                                        placeholder='First Name'
                                        value={firstName}
                                        underlineColorAndroid='transparent' />
                                </View>
                                <View style={styles.border}></View>
                                <View style={styles.nameContainer}>
                                    <RkText style={styles.commonTxt}>Last Name</RkText>
                                    <TextInput placeholderTextColor='#848482'
                                        style={styles.commonInput}
                                        placeholder='Last Name'
                                        value={lastName}
                                        onChangeText={(input) => this.setState({ lastName: input })}
                                        underlineColorAndroid='transparent' />
                                </View>
                            </View>
                        </RkCard>
                    </View>
                    <View style={styles.infoView}>
                        <RkCard rkCardContent style={{ backgroundColor: 'rgba(25, 30, 31,0.5)' }}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <View style={[styles.nameContainer, { marginVertical: scale(10) }]}>
                                    <RkText style={styles.commonTxt}>Country</RkText>
                                    <View style={{ flexDirection: 'row', flex: 2, marginLeft: scale(13), alignSelf: 'center' }}>
                                        <CountryPicker
                                            ref={(btnRef) => this._btn = btnRef}
                                            onChange={value => {
                                                this.setState({ cca2: value.cca2, callingCode: value.callingCode, country: value.name });
                                            }}
                                            cca2={this.state.cca2}
                                            filterable
                                        />
                                        <TouchableOpacity
                                            onPress={() => this._btn.openModal()}
                                        >
                                            <RkText style={{ marginLeft: scale(20), alignSelf: 'center', color: '#E8E8E6', fontSize: scale(15) }}>{this.state.country}</RkText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.border}></View>
                                <View style={styles.nameContainer}>
                                    <RkText style={styles.commonTxt}>City</RkText>
                                    <TextInput placeholderTextColor='#848482'
                                        style={styles.commonInput}
                                        placeholder='City'
                                        value={city}
                                        onChangeText={(input) => { this.setState({ city: input }) }}
                                        underlineColorAndroid='transparent' />
                                </View>
                                <View style={styles.border}></View>
                                <View style={styles.nameContainer}>
                                    <RkText style={styles.commonTxt}>Job</RkText>
                                    <TextInput placeholderTextColor='#848482'
                                        style={styles.commonInput}
                                        placeholder='Job'
                                        value={job}
                                        onChangeText={(input) => { this.setState({ job: input }) }}
                                        underlineColorAndroid='transparent' />
                                </View>
                            </View>
                        </RkCard>
                    </View>
                    <View style={styles.infoView}>
                        <RkCard rkCardContent style={{ backgroundColor: 'rgba(25, 30, 31,0.5)' }} >
                            <View style={{ flexDirection: 'column', flex: 1, }}>
                                <View style={[styles.nameContainer, { marginVertical: scale(10) }]}>
                                    <RkText style={styles.commonTxt}>Date Of Birth</RkText>
                                    <DatePicker
                                        style={{ width: scale(200), flex: 2, alignSelf: 'center', marginLeft: scale(10), }}
                                        date={this.state.date}
                                        mode="date"
                                        placeholder="select date"
                                        format="DD-MM-YYYY"
                                        androidMode='spinner'
                                        minDate="01-01-1940"
                                        maxDate={today}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                top: scale(4),
                                                marginLeft: 0,
                                                left: 0
                                            },
                                            dateInput: {
                                                marginLeft: scale(36),
                                            },

                                            dateText: {
                                                color: '#ffffff'
                                            }
                                        }}
                                        onDateChange={(date) => { this.setState({ date: date }) }}
                                    />
                                </View>
                                <View style={[styles.border]}></View>
                                <View style={[styles.nameContainer, { marginVertical: scale(5) }]}>
                                    <RkText style={styles.commonTxt}>Ph no:</RkText>
                                    <View style={{ flexDirection: 'row', flex: 2, marginLeft: scale(15) }}>
                                        <RkText style={{ color: '#ffffff', flex: 0.6, fontSize: scale(18), alignSelf: "center" }}>+ {this.state.callingCode}</RkText>
                                        <TextInput placeholderTextColor='#848482'
                                            style={{ color: '#ffffff', flex: 1.4, fontSize: scale(15), marginTop: scale(1) }}
                                            keyboardType="phone-pad"
                                            placeholder="09123456789"
                                            underlineColorAndroid='transparent'
                                            onChangeText={(input) => this.setState({ phNo: input })}
                                        />
                                    </View>
                                    {/* <TextInput placeholderTextColor='#848482'
                                            style={styles.commonInput}
                                            keyboardType="phone-pad"
                                            placeholder={"+" + this.state.callingCode + "123456789"}
                                            underlineColorAndroid='transparent'
                                            onChangeText={(input) => this.setState({ phNo: input })}
                                        /> */}

                                </View>
                                <View style={[styles.border]}></View>
                                <View style={[styles.nameContainer, { marginVertical: scale(10), marginRight: scale(15) }]}>
                                    <RkText style={styles.commonTxt}>Gender</RkText>
                                    <RadioGroup
                                        size={scale(22)}
                                        color='#ECC951'
                                        selectedIndex={0}
                                        style={[styles.commonInput, { flexDirection: "row" }]}
                                        onSelect={(index, value) => this.setState({ gender: value })}
                                    >
                                        <RadioButton value={'Male'} color='#ECC951' >
                                            <Text style={{ color: '#ffffff', fontSize: scale(15) }}>Male</Text>
                                        </RadioButton>
                                        <RadioButton value={'Female'} color='#ECC951'>
                                            <Text style={{ color: '#ffffff', fontSize: scale(15) }}>Female</Text>
                                        </RadioButton>
                                    </RadioGroup>
                                </View>
                            </View>
                        </RkCard>
                    </View>
                    <View style={styles.nextBtnView}>
                        <RkButton rkType='stretch'
                            style={styles.nextBtn}
                            onPress={() => this.sendData()}>
                            {
                                loading ? <ActivityIndicator size="small" color='#FFEB3B'></ActivityIndicator>
                                    :
                                    <RkText style={{ color: '#FFEB3B', fontSize: scale(20) }}>Next</RkText>
                            }

                        </RkButton>
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }

    sendData() {
        let { firstName, lastName, country, city, job, date, phNo, gender } = this.state
        if (firstName === '') {
            alert("Please enter your first name");
        } else if (city === '') {
            alert("Please enter your city name");
        } else if (phNo === '') {
            alert('Please enter your phone number');
        } else {
            Owner.setFirstPageData(firstName, lastName, country, city, job, date, phNo, gender);
            this.props.navigation.navigate("AddProfile");
        }
    }
}
const styles = StyleSheet.create({
    nameContainer: {
        flexDirection: 'row',
        flex: 1
    },
    mainContain: {
        flex: 1,
    },
    infoView: {
        marginVertical: scale(10),
        marginHorizontal: scale(10),
        borderWidth: scale(1),
        borderColor: '#FFEB3B'
    },
    commonTxt: {
        alignSelf: 'center',
        color: '#ffffff',
        fontSize: scale(15),
        flex: 1,
    },
    commonInput: {
        alignSelf: 'center',
        flex: 2,
        marginLeft: scale(10),
        color: '#ffffff',
        fontSize: scale(13)
    },
    nextBtnView: {
        marginHorizontal: scale(10),
        marginBottom: scale(15),
        marginTop: scale(10)
    },
    nextBtn: {
        backgroundColor: 'rgba(25, 30, 31,0.5)',
        height: scale(55),
        borderWidth: scale(1),
        borderColor: '#FFEB3B'
    },
    border: {
        backgroundColor: '#ffffff',
        borderWidth: scale(0.5),
        borderColor: '#FFEB3B'
    },
    imgBackground: {
        flex: 1,
        width: null,
        height: null
    }
})