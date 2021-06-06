import React, { Component } from 'react'
import { View, ImageBackground, Text, StyleSheet, TouchableWithoutFeedback, FlatList, Modal, Dimensions } from 'react-native';
import ImageScalable from 'react-native-scalable-image';
import FIcons from 'react-native-vector-icons/Feather';
import { scale, scaleVertical } from '../../utils/scale';
import Video from 'react-native-af-video-player';
import { feedUrl } from '../../utils/globle';
export class VideoGallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            videos: props.videos,
            videoModalVisible: false,
            videoPath: []
        }
    }

    renderItem({ item }) {
        const placeholderPath = feedUrl + 'media/' + item.mediaId + '/thumbnail';
        const videoPath = feedUrl + 'media/' + item.mediaId;
        return (
            <TouchableWithoutFeedback
                onPress={() => this.setState({ videoModalVisible: true, videoPath: videoPath })}>
                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                    <ImageScalable
                        width={Dimensions.get('window').width}
                        // style={{ width: size, height: size }}
                        source={{ uri: placeholderPath }}
                    />
                    <FIcons name="play-circle"
                        style={{ color: '#fff', fontSize: 50, zIndex: 2, position: 'absolute' }} />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    render() {
        let { videos, videoModalVisible, videoPath } = this.state
        console.log("length", videos.length)
        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                {
                    videos.length === 0 ?
                        <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                            <Text style={{ color: "#ffffff",fontSize:scale(15) }}>No video to show.</Text>
                        </View>
                        :
                        <FlatList
                            contentContainerStyle={styles.videos}
                            data={videos}
                            renderItem={this.renderItem.bind(this)}
                            numColumns={1}
                        />

                }

                {/* video modal */}
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={videoModalVisible}
                    onRequestClose={() => this.setState({ videoModalVisible: false })}>
                    <View style={styles.videoContainer} >
                        <Video
                            url={videoPath}
                            autoPlay
                            fullScreenOnly
                            lockPortraitOnFsExit
                        />
                    </View>
                </Modal>
            </ImageBackground>
        )
    }
}
let styles = StyleSheet.create({
    videos: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#191e1f',

    },
});