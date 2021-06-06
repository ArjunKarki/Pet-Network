import React, { Component } from 'react'
import { View, ImageBackground, FlatList, StyleSheet, Dimensions, TouchableOpacity, Image,Text } from 'react-native';
import PhotoView from "@merryjs/photo-viewer";
import { scale } from '../../utils/scale';
import { feedUrl } from '../../utils/globle';

export class PhotoGallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            photos: props.photos,
            photoModalVisible: false,
            selectedMediaIndex: null,
        }
    }

    renderItem({ item, index }) {
        let size = (Dimensions.get('window').width - 12) / 3;
        return (
            <TouchableOpacity style={styles.images} onPress={() => {
                this.setState({ photoModalVisible: true, selectedMediaIndex: index })
            }}>
                <Image
                    source={{ uri: feedUrl + 'media/' + item.mediaId }}
                    style={{ width: size, height: size }}
                    indicatorProps={{
                        color: '#ECC951',
                        size: 20,
                    }}
                />
            </TouchableOpacity>
        )
    }

    render() {
        let { photos, photoModalVisible, selectedMediaIndex } = this.state;
        let path = [];
        if (photos) {
            photos.map((Id) => {
                path.push({ source: { uri: feedUrl + "media/" + Id.mediaId } })
            })
        }
        
        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
            
                {
                    photos.length === 0 ?
                        <View style={{ justifyContent: "center", alignItems: "center",flex:1}}>
                            <Text style={{ color: "#ffffff", fontSize: scale(15) }}>No photo to show.</Text>
                        </View>
                        :
                        <FlatList
                            contentContainerStyle={styles.images}
                            data={photos}
                            renderItem={this.renderItem.bind(this)}
                            numColumns={3}
                        />
                }

                <PhotoView
                    visible={photoModalVisible}
                    data={path}
                    hideStatusBar={false}
                    hideCloseButton={true}
                    hideShareButton={true}
                    initial={selectedMediaIndex || 0}
                    onDismiss={e => {
                        // don't forgot set state back.
                        this.setState({ photoModalVisible: false });
                    }}
                />
            </ImageBackground>
        )
    }
}

let styles = StyleSheet.create({
    images: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: scale(1.5)
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});