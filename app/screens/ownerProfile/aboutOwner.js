import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { RkCard, RkText } from 'react-native-ui-kitten';
import { aboutOwnerUrl } from '../../utils/globle';
import { scale } from '../../utils/scale';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class AboutOwner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            resource: null,
            loading: true,
            ownerId: props.ownerId
        }
    }

    async getAboutOwner(ownerId) {
        this.setState({ loading: true });
        let path = aboutOwnerUrl + "/" + ownerId;
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET'
        }

        try {
            let res = await fetch(path, config);
            let resJson = await res.json();
            this.setState({ resource: resJson.aboutOwner, loading: false });
        } catch (error) {
            alert("Something Wrong!");
        }
    }

    async componentDidMount() {
        let { ownerId } = this.state
        this.getAboutOwner(ownerId);
    }

    render() {
        let { resource, loading } = this.state

        if (loading) {
            return (
                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                    <ActivityIndicator size={40} color='#FFEB3B' />
                </View>

            )
        }
        let location = resource.city + ", " + resource.country
        return (
            <ScrollView keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
                <RkCard rkCardContent style={{ marginVertical: scale(15), marginHorizontal: scale(20), backgroundColor: 'rgba(25, 30, 31,0.5)', borderWidth: 1, borderColor: '#ECC951' }}>
                    <View>
                        <View style={{ marginVertical: scale(10) }}>
                            <RkText style={styles.txtStyle}>LOCATION</RkText>
                            <RkText style={styles.infoStyle}>{location}</RkText>
                        </View>
                        <View>
                            <RkText style={styles.txtStyle}>DOB</RkText>
                            <RkText style={styles.infoStyle}>{resource.dob}</RkText>
                        </View>
                        <View style={{ marginVertical: scale(10) }}>
                            <RkText style={styles.txtStyle}>PH NO:</RkText>
                            <RkText style={styles.infoStyle}>{resource.phNo}</RkText>
                        </View>
                        <View style={{ marginVertical: scale(10) }}>
                            <RkText style={styles.txtStyle}>DESCRIPTION</RkText>
                            <RkText style={styles.infoStyle}>{resource.Description}</RkText>
                        </View>
                    </View>
                </RkCard>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    txtStyle: {
        color: '#ECC951',
        fontSize: scale(17),
    },
    infoStyle: {
        marginTop: scale(6),
        fontSize: scale(14),
        color: '#fff',
    }

})
