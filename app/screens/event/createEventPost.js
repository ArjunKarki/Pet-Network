import React, { Component } from 'react';
import {
    ImageBackground,
    View,
    ScrollView,
    Modal,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import Icons from 'react-native-vector-icons/Entypo';
import FIcons from 'react-native-vector-icons/Feather';
import ImageCropPicker from 'react-native-image-crop-picker';
import PhotoView from "@merryjs/photo-viewer";
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import futch from '../../utils/futch';
import { eventUrl } from '../../utils/globle';

export class CreateEventPost extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: 'Create Event Post',
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerTintColor: '#ECC951',
        headerStyle: {
            backgroundColor: '#191e1f'
        }
    });
    constructor(props) {
        super(props);
        this.state = {
            //eventId: props.navigation.state.params.eventInfo.eventId,
            //eventId: props.navigation.state.params.eventId,
            images: [],
            renderImage: false,
            pickImgModal: false,
            modalImagePath: [],
            modalVisible: false,
            isVideo: false,
            description: '',
            showActivityIndicator: false
        }
    }

    componentWillMount() {
        ImageCropPicker.clean();
    }

    // pick image
    async pickImage() {
        this.setState({ isVideo: false })
        let images = [];
        images = await ImageCropPicker.openPicker({ multiple: true, mediaType: "photo" });
        let newImgs = this.state.images.concat(images);
        this.setState({ images: newImgs, renderImage: true, pickImgModal: false });
    }
    //pick video
    async pickVideo() {
        this.setState({ isVideo: true })
        let images = [];
        images = await ImageCropPicker.openPicker({ multiple: false, mediaType: "video" });
        let newImgs = this.state.images.concat(images);
        this.setState({ images: newImgs, renderImage: true, pickImgModal: false });
    }

    //toggle image and video
    pickImageOrVedio() {
        const { isVideo } = this.state;
        if (isVideo) {
            this.pickVideo();
        } else {
            this.pickImage();
        }
    }

    //display image in render method
    renderImages() {
        const { images } = this.state;
        let imgs = [];
        if (images) {
            for (let img of images) {
                imgs.push(
                    <View key={img.path} style={styles.scrollImg}>
                        <TouchableOpacity onPress={() => this.setState({ modalVisible: true, modalImagePath: img })}>
                            <Image key={img.path} source={{ uri: img.path }}
                                style={{ width: 280, height: 250, resizeMode: 'cover' }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.removePhoto(img)} style={styles.removeLogo}>
                            <FIcons name='delete' style={{ color: 'red', fontSize: 30 }} />
                        </TouchableOpacity>
                    </View>
                );
            }
            if (images[0].mime.startsWith("image/")) {
                imgs.push(
                    <TouchableOpacity onPress={() => this.pickImageOrVedio()} style={styles.addMoreStyle} key={98}>
                        <Icons name="plus" style={{ color: '#ECC951', fontSize: 48 }} />
                    </TouchableOpacity>
                )
            }
            return imgs;
        }
        return null;
    }

    //render Image or Video Picker Modal
    renderPickImgModal() {
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => this.pickImage()}
                    style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <Icons name='folder-images' style={{ color: 'yellow', fontSize: 22, margin: 10 }} />
                    <Text style={{ fontSize: 18, color: '#ffffff', margin: 10 }}>Image</Text>
                </TouchableOpacity>
                <View style={{ borderColor: 'yellow', borderTopWidth: 1, margin: 10 }} />
                <TouchableOpacity onPress={() => this.pickVideo()}
                    style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                    <Icons name='video-camera' style={{ color: 'yellow', margin: 10, fontSize: 22 }} />
                    <Text style={{ fontSize: 18, color: '#ffffff', margin: 10 }}>Video</Text>
                </TouchableOpacity>
            </View>
        )
    }

    //remove picked photo
    removePhoto(image) {
        const { images } = this.state;
        const index = images.indexOf(image);
        if (index > -1) {
            images.splice(index, 1);
        }
        if (images.length == 0 || null) {
            this.setState({ renderImage: false })
        }
        this.setState({ images: images });
    }

    //upload data to back end
    async uploadData() {
        const { images, description } = this.state;
        const { eventId } = this.props.navigation.state.params;

        let data = new FormData();
        data.append("ownerId", LoggedUserCredentials.getOwnerId());
        data.append("ownerName", LoggedUserCredentials.getOwnerName());
        data.append("eventId", eventId);
        data.append("description", description || null);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                data.append('media', {
                    uri: images[i].path,
                    type: images[i].mime,
                    name: 'media' + i + '.' + images[i].mime.split('/')[1]
                });
            }
        } else {
            data.append('media', null);
        }

        const config = {
            headers: {
                'Content-Type': 'multipart/mixed',
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'POST',
            body: data
        }
        let path = eventUrl + "/eventposts"
        try {
            this.setState({ showActivityIndicator: true });
            let res = await futch(path, config);
            if (res) {
                this.setState({ showActivityIndicator: false })
                this.props.navigation.state.params.refresh();
                this.props.navigation.navigate("EventPosts");
                ImageCropPicker.clean();
            } else {
                this.setState({ showActivityIndicator: false })
                alert("Sorry, can not upload the post");
            }
        } catch (error) {
            alert("Sorry, can not upload the post");
            this.setState({ showActivityIndicator: false })
        }
    }

    render() {
        return (
            <ImageBackground
                style={styles.imgBack}
                source={require('../../assets/images/background.jpg')}>
                {
                    this.state.showActivityIndicator ?
                        <ActivityIndicator size='large' color="yellow" style={{ alignSelf: 'center' }} />
                        :
                        <ScrollView keyboardShouldPersistTaps="always">
                            <View style={[styles.card, { borderRadius: 5, marginTop: 30 }]}>
                                {
                                    this.state.renderImage ?
                                        <ScrollView
                                            style={styles.imgStyle}
                                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}>
                                            {this.renderImages()}
                                        </ScrollView>
                                        :
                                        <TouchableOpacity onPress={() => this.setState({ pickImgModal: true })} style={[styles.imgLogo, { minHeight: 250 }]}>
                                            <Icons name='folder-images' style={{ color: '#ECC951', fontSize: 60 }} />
                                        </TouchableOpacity>
                                }

                                <TextInput
                                    placeholder="Describe the Event..."
                                    placeholderTextColor="#fff"
                                    underlineColorAndroid="#ECC951"
                                    multiline={true}
                                    value={this.state.description}
                                    onChangeText={(text) => this.setState({ description: text })}
                                    style={{ fontSize: 16, color: '#fff', margin: 10 }} />

                                <TouchableOpacity onPress={() => this.uploadData()}
                                    style={[styles.card, { borderRadius: 3, alignItems: 'center', justifyContent: 'center' }]}>
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Upload</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                }
                {/* picked photo review modal */}
                <PhotoView
                    visible={this.state.modalVisible}
                    data={[{ source: { uri: this.state.modalImagePath.path } }]}
                    hideStatusBar={false}
                    hideCloseButton={true}
                    hideShareButton={true}
                    initial={0}
                    onDismiss={e => {
                        // don't forgot set state back.
                        this.setState({ modalVisible: false });
                    }} />

                {/* Pick Image or Vedio Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.pickImgModal}
                    onRequestClose={() => this.setState({ pickImgModal: false })}>
                    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                        {this.renderPickImgModal()}
                    </View>
                </Modal>

            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    imgBack: {
        flex: 1,
        width: null,
        height: null,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgStyle: {
        // backgroundColor: 'rgba(25, 30, 31,0.5)',
        height: 250,
        marginVertical: 5,
        marginHorizontal: 10,
        borderColor: '#ECC951',
    },
    imgLogo: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 130
    },
    scrollImg: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5
    },
    removeLogo: {
        position: 'absolute',
        right: 1,
        top: 1,
        zIndex: 2,
    },
    addMoreStyle: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        marginVertical: 100
    },
    card: {
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 10,
        margin: 10,
        padding: 10
    }
});
