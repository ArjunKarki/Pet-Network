import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    ImageBackground,
    ActivityIndicator,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import PhotoView from "@merryjs/photo-viewer";
import Icons from 'react-native-vector-icons/Entypo';
import FIcons from 'react-native-vector-icons/Feather';
import * as Progress from 'react-native-progress';
import { postUrl, petListUrl } from '../../utils/globle';
import futch from '../../utils/futch';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import { RkButton } from 'react-native-ui-kitten';
import { scale } from '../../utils/scale';
import { Tags } from '../../components';

const { height } = Dimensions.get('window');

export class PostUpload extends Component {
    
    static navigationOptions = ({ navigation }) => ({
        title: 'Post Upload',
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
            pickerData: '',
            pickerModalVisible: false,
            petPickerModalVisible: false,
            selectedText: "Select Activity",
            visibleTextInput: false,
            renderImage: false,
            avatarImgBorder: false,
            modalVisible: false,
            modalImagePath: [],
            borderColorShow: false,
            images: [],
            selectedPet: 'Select Pet',
            description: "",
            showActivityIndicator: false,
            progress: 0,
            isOK: false,
            petsLoading: false,
            petsList: [],
            tag: [],
            mediaPickerVisible: false,
            isVideo: false
        }
    }

    renderMediaPicker() {
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

    //pick image only
    async pickImage() {
        this.setState({ isVideo: false });
        let images = [];
        images = await ImageCropPicker.openPicker({ multiple: true, mediaType: "photo" });
        let newImgs = this.state.images.concat(images);
        this.setState({ images: newImgs, renderImage: true, mediaPickerVisible: false });
    }

    //pick video only
    async pickVideo() {
        this.setState({ isVideo: true });
        let images = [];
        images = await ImageCropPicker.openPicker({ multiple: false, mediaType: "video" });
        let newImgs = this.state.images.concat(images);
        this.setState({ images: newImgs, renderImage: true, mediaPickerVisible: false });
    }

    //toggle between image and video
    toggleImageOrVedio() {
        const { isVideo } = this.state;
        if (isVideo) {
            this.pickVideo();
        } else {
            this.pickImage();
        }
    }

    renderImages() {
        const { images } = this.state;
        let imgs = [];
        if (images) {
            for (let img of images) {
                imgs.push(
                    <View key={img.path} style={styles.scrollImg}>
                        <TouchableOpacity onPress={() => this.setState({ modalVisible: true, modalImagePath: img })}>
                            <Image key={img.path} source={{ uri: img.path }} style={{ width: 250, height: 250, resizeMode: 'cover', borderWidth: 1, borderColor: '#ECC951', borderRadius: 5 }} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.removePhoto(img)} style={styles.removeLogo}>
                            <FIcons name='delete' style={{ color: 'red', fontSize: 30 }} />
                        </TouchableOpacity>
                    </View>
                );
            }
            if (images[0].mime.startsWith("image/")) {
                imgs.push(
                    <TouchableOpacity onPress={() => this.toggleImageOrVedio()} style={styles.addMoreStyle} key={98}>
                        <Icons name="plus" style={{ color: '#ECC951', fontSize: 48 }} />
                    </TouchableOpacity>
                )
            }
            return imgs;
        }
        return null;
    }

    toggle() {
        this.setState({ borderColorShow: !this.state.borderColorShow });
    };

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

    renderImageModal() {
        const { modalVisible, modalImagePath } = this.state;
        if (modalVisible) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: modalImagePath.path }} style={{ width: scale(300), height: scale(400), resizeMode: 'contain' }} />
                </View>
            )
        } else {
            return null
        }
    }

    renderPicker() {
        const { petsList } = this.state;
        if (petsList.length != 0) {
            return (
                <View style={styles.modalStyle}>
                    <Text style={{ color: '#fff', fontSize: scale(20), fontWeight: 'bold', marginVertical: scale(20) }}>Select Activity</Text>
                    <TouchableOpacity style={styles.wrapperText} onPress={() => this.setState({ selectedText: "Training", pickerModalVisible: false })}>
                        <Text style={styles.textStyle}>Training</Text>
                    </TouchableOpacity>
                    <View style={styles.spacer} />
                    <TouchableOpacity style={styles.wrapperText} onPress={() => this.setState({ selectedText: "Playing", pickerModalVisible: false })}>
                        <Text style={styles.textStyle}>Playing</Text>
                    </TouchableOpacity>
                    <View style={styles.spacer} />
                    <TouchableOpacity style={styles.wrapperText} onPress={() => this.setState({ selectedText: "Sleeping", pickerModalVisible: false })}>
                        <Text style={styles.textStyle}>Sleeping</Text>
                    </TouchableOpacity>
                    <View style={styles.spacer} />
                    <TouchableOpacity style={styles.wrapperText} onPress={() => this.setState({ selectedText: "Walking", pickerModalVisible: false })}>
                        <Text style={styles.textStyle}>Walking</Text>
                    </TouchableOpacity>
                    <View style={styles.spacer} />
                    <TouchableOpacity style={styles.wrapperText} onPress={() => this.setState({ selectedText: "Eating", pickerModalVisible: false })}>
                        <Text style={styles.textStyle}>Eating</Text>
                    </TouchableOpacity>
                    <View style={styles.spacer} />
                    <TouchableOpacity style={styles.wrapperText} onPress={() => this.setState({ selectedText: "Angry", pickerModalVisible: false })}>
                        <Text style={styles.textStyle}>Angry</Text>
                    </TouchableOpacity>
                    <View style={styles.spacer} />
                    <TouchableOpacity style={styles.wrapperText} onPress={() => this.setState({ selectedText: "Pet Meeting", pickerModalVisible: false })}>
                        <Text style={styles.textStyle}>Pet Meeting</Text>
                    </TouchableOpacity>
                    <View style={styles.spacer} />
                    <TouchableOpacity style={styles.wrapperText} onPress={() => this.setState({ pickerModalVisible: false, visibleTextInput: true })}>
                        <Text style={styles.textStyle}>Custom</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={[styles.modalStyle, { height: height - 150, justifyContent: 'center' }]}>
                    <Text style={{ color: '#ECC951', fontSize: 18 }}>There is no activity to select !</Text>
                </View>
            )
        }
    }

    renderPetPicker() {
        const { petsList, petsLoading } = this.state;
        let tempPetsList = [];
        tempPetsList = petsList.map(pet => {
            return (
                <View>
                    <TouchableOpacity
                        key={pet.petId}
                        onPress={() => this.setState({ selectedPet: pet.petName, petPickerModalVisible: false })}
                        style={[styles.wrapperText, { alignItems: 'center' }]} >
                        <Text style={styles.textStyle}>{pet.petName}</Text>
                    </TouchableOpacity >
                    <View style={styles.spacer} />
                </View>
            )
        })

        if (petsLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={scale(30)} />
                </View>
            )
        }

        if (petsList.length != 0) {
            return (
                <View style={[styles.modalStyle, { height: scale(height - 150) }]}>
                    <Text style={{ color: '#fff', fontSize: scale(20), fontWeight: 'bold', marginVertical: scale(20) }}>Select Pet</Text>
                    <ScrollView>
                        {tempPetsList}
                    </ScrollView>
                </View>
            )
        } else
            return (
                <View style={[styles.modalStyle, { height: scale(height - 150), justifyContent: 'center' }]}>
                    <Text style={{ color: '#ECC951', fontSize: scale(18) }}>There is no pet to select !</Text>
                    <Text style={{ color: '#ECC951', fontSize: scale(18) }}>Please add pet in your profile.</Text>
                    <RkButton
                        onPress={() => this.props.navigation.navigate('MainOwnerProfile', { ownerId: LoggedUserCredentials.getOwnerId() })}
                        rkType='stretch outline'
                        contentStyle={{ color: '#ECC951' }}
                        style={{ marginHorizontal: scale(20), borderColor: '#ECC951', marginTop: scale(100) }}
                    >
                        Go To Your Profile
                    </RkButton>
                </View>
            )
    }

    async fetchPets() {
        this.setState({ petsLoading: true, petPickerModalVisible: true });
        const url = petListUrl + '/' + LoggedUserCredentials.getOwnerId();
        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
            },
            method: 'GET',
        }
        try {
            let res = await fetch(url, config);
            let resJson = await res.json();
            if (res.status == 200) {
                this.setState({
                    petsList: resJson.pets,
                    petsLoading: false
                })
            } else {
                alert("Something Wrong")
            }

        } catch (error) {
            alert("Please connect your internet!")

        }
        // fetch(url, config)
        //     .then(res => res.json())
        //     .then(resJson => this.setState({ petsList: resJson, petsLoading: true }),console.log("PetList",resJson))
        //     .catch(err => this.setState({ petsLoading: false }));
    }

    _onProgress(event) {
        const progress = event.loaded / event.total;
        this.setState({ progress: progress })
    }

    async uploadData() {
        const {
            images,
            selectedText,
            tag,
            description,
            selectedPet
        } = this.state;

        const activity = selectedText === 'Select Activity' ? '' : selectedText;
        const petName = selectedPet === 'Select Pet' ? '' : selectedPet;
        const hash = tag.toString();

        let data = new FormData();
        let Info = {
            "ownerId": LoggedUserCredentials.getOwnerId(),
            "activity": activity,
            "hashtag": hash || "",
            "description": description.trim() || "",
            "petName": petName
        }
        data.append("uploadInfo", JSON.stringify(Info));

        if (images.length == 0) {
            alert("No Selected Image");
        } else {
            if (images) {
                for (let i = 0; i < images.length; i++) {
                    data.append('postImage', {
                        uri: images[i].path,
                        type: images[i].mime,
                        name: 'media' + i + '.' + images[i].mime.split('/')[1]
                    });
                }
            } else {
                data.append('postImage', null);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken()
                },
                method: 'POST',
                body: data
            }

            this.setState({ showActivityIndicator: true });

            try {
                let res = await futch(postUrl, config, (event) => this._onProgress(event));
                console.log("AKS", res);
                this.setState({ showActivityIndicator: false });
                // ImageCropPicker.clean();
                if (res.status === 201) {
                    console.log("AA", res.responseText)
                    let json_data = JSON.parse(res.responseText)
                    this.props.navigation.state.params.updatePost(json_data);
                    this.props.navigation.goBack();
                }

            } catch (error) {
                console.log("POst upload", error)
                this.setState({ showActivityIndicator: false });
                alert("Sorry, can not upload the post");
            }
        }
    }

    renderProgressView() {
        const { progress } = this.state;
        if (progress < 1) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View>
                        <Progress.Circle
                            progress={progress}
                            size={scale(70)}
                            showsText={true}
                        />
                        <Text>Uploading...</Text>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        style={{ width: scale(160), height: scale(120) }}
                        source={require('../../assets/animations/piggy.gif')}
                    />
                    <Text>Processing...</Text>
                </View>
            )
        }
    }

    handelTag(tags) {
        this.setState({ tag: tags });
    }

    render() {
        const {
            selectedPet,
            selectedText
        } = this.state;
        return (
            <ImageBackground
                style={styles.imgBack}
                source={require('../../assets/images/background.jpg')}
            >
                {/* */}
                <ScrollView showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: 'rgba(25, 30, 31,0.5)' }} >
                    <ScrollView
                        style={styles.imgStyle}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        {
                            this.state.renderImage ?
                                this.renderImages()
                                :
                                <TouchableOpacity onPress={() => this.setState({ mediaPickerVisible: true })} style={styles.imgLogo}>
                                    <Icons name='folder-images' style={{ color: '#ECC951', fontSize: scale(70) }} />
                                    <Text style={{ color: '#ECC951', fontSize: scale(18), fontWeight: 'bold' }}>Pick Photo</Text>
                                </TouchableOpacity>
                        }
                    </ScrollView>

                    <View style={styles.bottomStyle}>

                        <TouchableOpacity onPress={() => this.fetchPets()}>
                            <Text style={selectedPet === "Select Pet" ? styles.noTextStyle : styles.textStyle}>{selectedPet}</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />

                        <View>
                            {
                                this.state.visibleTextInput ?
                                    <TextInput placeholder="Enter a Activity Name"
                                        placeholderTextColor="grey"
                                        underlineColorAndroid="transparent"
                                        autoFocus={true}
                                        onChangeText={(text) => this.setState({ selectedText: text })}
                                        style={{ fontSize: scale(16), marginTop: scale(5), paddingHorizontal: scale(10), color: '#fff' }} />
                                    :
                                    <TouchableOpacity onPress={() => this.setState({ pickerModalVisible: true })}>
                                        <Text style={selectedText === "Select Activity" ? styles.noTextStyle : styles.textStyle}>{selectedText}</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.divider} />

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={{ color: 'grey', margin: scale(10) }}>#Hash Tag for a post</Text>
                            <Tags
                                initialTags={this.state.tag}
                                inputStyle={{ backgroundColor: '#A8A8A8', borderRadius: scale(10) }}
                                tagContainerStyle={{ backgroundColor: '#A9A9A9' }}
                                onChangeTags={tags => this.handelTag(tags)} />
                        </View>
                    </View>

                    <View style={styles.desStyle}>
                        <TextInput placeholder="Description for a post"
                            placeholderTextColor="grey"
                            underlineColorAndroid="transparent"
                            multiline={true}
                            value={this.state.description}
                            onChangeText={(text) => this.setState({ description: text })}
                            style={{ fontSize: scale(16), margin: scale(5), color: '#fff' }} />
                    </View>

                    <TouchableOpacity onPress={() => this.uploadData()} style={styles.btnStyle}>
                        <Text style={{ color: '#fff', padding: scale(7) }}>UPLOAD</Text>
                    </TouchableOpacity>

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
                        }}
                    />

                    <Modal animationType="none"
                        visible={this.state.showActivityIndicator}
                        onRequestClose={() => this.setState({ showActivityIndicator: false })}>
                        {this.renderProgressView()}
                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.pickerModalVisible}
                        onRequestClose={() => this.setState({ pickerModalVisible: false })}>
                        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                            {this.renderPicker()}
                        </View>

                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.petPickerModalVisible}
                        onRequestClose={() => this.setState({ petPickerModalVisible: false })}>
                        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                            {this.renderPetPicker()}
                        </View>

                    </Modal>

                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={this.state.mediaPickerVisible}
                        onRequestClose={() => this.setState({ mediaPickerVisible: false })}
                    >
                        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                            {this.renderMediaPicker()}
                        </View>
                    </Modal>
                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    imgBack: {
        flex: 1,
        width: null,
        height: null
    },
    imgStyle: {
        minHeight: scale(200),
        marginTop: scale(5),
        marginHorizontal: scale(10),
        borderColor: '#ECC951',
    },
    addMoreStyle: {
        width: scale(60),
        height: scale(60),
        borderWidth: scale(2),
        borderColor: '#ECC951',
        borderRadius: scale(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: scale(30),
        marginVertical: scale(100)
    },
    removeLogo: {
        position: 'absolute',
        right: 1,
        top: 1,
        zIndex: 2,
    },
    divider: {
        borderTopWidth: 1,
        borderTopColor: '#ECC951',
        marginHorizontal: 5,
        marginBottom: 5
    },
    imgLogo: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderColor: '#ECC951',
        borderWidth: 1,
        borderRadius: 7,
        width: scale(250),
        height: scale(220)
    },
    bottomStyle: {
        borderColor: '#ECC951',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10,
        marginHorizontal: 5,
        marginBottom: 10
    },
    desStyle: {
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 7,
        marginHorizontal: 5,
        minHeight: 90
    },
    scrollImg: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 20,
        marginRight: 5
    },
    btnStyle: {
        borderWidth: 1,
        borderColor: '#ECC951',
        marginVertical: 20,
        marginHorizontal: 5,
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalStyle: {
        backgroundColor: '#242124',
        minWidth: 300,
        borderWidth: 2,
        borderRadius: 3,
        borderColor: '#FFEB3B',
        marginHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        color: '#fff',
        fontSize: 16,
        margin: 10
    },
    noTextStyle: {
        color: 'grey',
        fontSize: 16,
        margin: 10
    },
    wrapperText: {
        padding: 5,
        marginVertical: 5
    },
    spacer: {
        height: 1,
        backgroundColor: '#FFEB3B',
        width: 200
    },
    card: {
        borderWidth: 1,
        borderColor: '#ECC951',
        borderRadius: 10,
        margin: 10,
        padding: 10
    }
})