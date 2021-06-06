import React, { Component } from 'react'
import { View, ImageBackground } from 'react-native';
import { PhotoGallery } from './photoGallery';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { VideoGallery } from './videoGallery';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { RkButton } from 'react-native-ui-kitten';
export class Gallery extends Component {

    static navigationOptions = ({ navigation }) => ({

        title: 'Photo Gallery',
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerTintColor: '#ECC951',
        headerStyle: {
            backgroundColor: '#191e1f'
        },
        headerLeft: (
            <RkButton
                rkType='clear'
                contentStyle={{ color: '#ECC951' }}
                style={{ width: 40, marginLeft: 8 }}
                onPress={() => navigation.goBack(null)}>
                <FIcon name="arrow-left" size={17} color='#ECC951' />
            </RkButton>
        )
    })

    constructor(props) {
        super(props)

        this.state = {
            medias: props.navigation.state.params.medias,
            photos: [],
            videos: []
        }
    }

    render() {
        let { medias, photos, videos } = this.state;
        if (medias) {
            medias.map((path) => {
                if (path.contentType.startsWith("image/")) {
                    photos.push(path)
                } else {
                    videos.push(path);
                }
            })
        }

        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                <ScrollableTabView
                    tabBarBackgroundColor='rgba(25, 30, 31,0.6)'
                    tabBarActiveTextColor='#ECC951'
                    tabBarInactiveTextColor='#ffffff'
                    tabBarUnderlineStyle={{ backgroundColor: '#ECC951' }}
                    page={1}
                >
                    <PhotoGallery
                        photos={photos}
                        tabLabel='Photos'
                    />
                    <VideoGallery
                        videos={videos}
                        tabLabel='Videos'
                    />
                </ScrollableTabView>
            </ImageBackground>
        )
    }
}