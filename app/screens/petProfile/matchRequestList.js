import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons'
import { petProPicUrl } from '../../utils/globle';
import { scale } from '../../utils/scale';
import { RkButton } from 'react-native-ui-kitten';

export class MatchRequestList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            comfirmDeleteStatus: ""
        }
    }

    render() {
        let { matchInfo } = this.props
        let comfirmStatus = "You accepted the match."
        let deleteStatus = "Request removed"
        let background = this.state.comfirmDeleteStatus === "" ? '#2d2d2d' : '#484848'
        return (
            <TouchableOpacity
                onPress={() => this.props.goToPetProfile(matchInfo.matchRequestFrom._id)}
                style={{ flex: 1, flexDirection: 'row', marginBottom: scale(5) }}
            >
                <Image
                    source={{ uri: petProPicUrl + "/" + matchInfo.matchRequestFrom.petProPic }}
                    style={{ width: scale(100), height: scale(100) }}
                />
                <View style={{ flex: 1, backgroundColor: background, paddingLeft: scale(10) }}>
                    <Text style={{ color: "#ffffff", fontSize: scale(15), marginLeft: scale(3), marginTop: scale(5) }}>{matchInfo.matchRequestFrom.petName}</Text>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: scale(5) }}>
                        <MIcon name="place" color='#ffffff' size={20} />
                        <Text style={{ color: '#ffffff', marginLeft: scale(5) }}>Mandalay</Text>
                    </View>
                    {
                        this.state.comfirmDeleteStatus === "" ?
                            <View style={{ flexDirection: "row", marginBottom: scale(7) }}>
                                <RkButton
                                    style={{ height: 30, width: 120, backgroundColor: '#ECC951' }}
                                    onPress={() => {
                                        this.props.comfirmRequest(matchInfo._id),
                                            this.setState({ comfirmDeleteStatus: comfirmStatus })
                                    }} >
                                    <Text style={{ color: '#191e1f' }}>COMFIRM</Text>
                                </RkButton>
                                <RkButton style={{ height: 30, width: 120, marginLeft: scale(5), borderWidth: 1, borderColor: '#ECC951' }}
                                    onPress={() => {
                                        this.props.deleteRequest(matchInfo._id),
                                            this.setState({ comfirmDeleteStatus: deleteStatus })
                                    }} rkType="clear" >
                                    <Text style={{ color: '#ECC951' }}>DELETE</Text>
                                </RkButton>
                            </View>
                            :
                            <Text style={{ color: "#ffffff", marginBottom: scale(15), fontSize: scale(15) }}>
                                {this.state.comfirmDeleteStatus}
                            </Text>
                    }
                </View>
            </TouchableOpacity>
        )
    }
}