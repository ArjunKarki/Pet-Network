import React, { Component } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import { RkButton } from 'react-native-ui-kitten'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import PhotoView from "@merryjs/photo-viewer";
import { scale } from '../../../utils/scale';
import { petProPicUrl } from '../../../utils/globle';

let PRO_PIC_WIDTH = Dimensions.get('window').width / 3
let PRO_PIC_HEIGHT = PRO_PIC_WIDTH

export default class ProfileHeader extends Component {

    constructor(props) {
        super(props)
        this.state = {
            photoModalVisible: false
        }
    }

    render() {

        proPic = petProPicUrl + "/" + this.props.petProPic
        
        let photo = [{
            source: {
                uri: proPic
            }
        }]

        return (
            <View style={
                styles.propicContainer
            }>
                <TouchableOpacity
                    onPress={() => { this.setState({ photoModalVisible: true }) }}
                    style={styles.proPicStyle}>
                    <Image source={{ uri: proPic }}
                        style={{
                            flex: 1,
                            width: null,
                            height: null
                        }} />
                </TouchableOpacity>
                <View style={{ marginLeft: scale(25), alignSelf: "center" }}>
                    <Text style={{ color: "#ffffff", fontSize: scale(20), color: '#ECC951', marginLeft: scale(5) }}>{this.props.petName}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <MIcon name="place" color='#ECC951' size={20} />
                        <Text style={{ color: '#ECC951', marginLeft: scale(5) }}>{this.props.petAddress}</Text>
                    </View>
                </View>
                <PhotoView
                    visible={this.state.photoModalVisible}
                    data={photo}
                    initial={0}
                    hideStatusBar={true}
                    hideCloseButton={true}
                    hideShareButton={true}
                    onDismiss={e => {
                        this.setState({ photoModalVisible: false });
                    }}
                />
            </View>
        )
    }
}

let styles = StyleSheet.create({

    propicContainer: {
        flexDirection: "row",
        marginLeft: scale(20),
        marginTop: scale(20)
    },
    proPicStyle: {
        width: PRO_PIC_WIDTH,
        height: PRO_PIC_HEIGHT,
        borderColor: '#ECC951',
        overflow: 'hidden',
        borderRadius: scale(15),
        borderWidth: 2
    }
})

