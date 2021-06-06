import React, { PureComponent } from 'react';
import Image from 'react-native-image-progress';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    Dimensions,
    ImageBackground,
    ActivityIndicator,
    ScrollView,
    FlatList,
    Image as Img
} from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/MaterialIcons'
import { RkButton, RkText } from 'react-native-ui-kitten';
import PhotoView from "@merryjs/photo-viewer";

const { width } = Dimensions.get('window');
import { scale } from '../../utils/scale';
import { petVaccinePicUrl, vaccinationlistUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';

export class PetVaccination extends PureComponent {

    static navigationOptions = ({ navigation }) => ({
        title: 'Vaccination',
        headerStyle: {
            backgroundColor: '#191e1f',
        },
        headerTitleStyle: {
            color: '#ECC951'
        },
        headerLeft: (
            <RkButton
                rkType='clear'
                contentStyle={{ color: '#ECC951' }}
                style={{ width: 40, marginLeft: 8 }}
                onPress={() => { navigation.goBack() }}>
                <RkText rkType='awesome' ><Icons name='arrow-back' style={{ fontSize: 25 }} /></RkText>
            </RkButton>
        )
    });

    constructor(props) {
        super(props)
        this.state = {
            showDetail: false,
            photoModalVisible: false,
            resources: [],
            loading: false,
            petId: this.props.navigation.state.params.PetId,
            mediaPaths: [],
            selectedMediaIndex: null

        }

    }

    componentDidMount() {
        let { petId } = this.state;
        this.getAllPetVaccination(petId);
    }

    async  getAllPetVaccination(petId) {
        this.setState({ loading: true });

        let path = vaccinationlistUrl + "/" + petId;

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken(),
            },
            method: 'GET',
        }

        try {

            let res = await fetch(path, config);
            if (res.status == 200) {
                let resJson = await res.json();
               
                this.setState({ resources: resJson, loading: false });
            } else {
                alert("Something Went Wrong!")
            }

        } catch (error) {
            console.log(error);
            alert("Something Wrong!")
        }

    }

    _renderItems = ({ item }) => {
        return (
            <View style={styles.container}>
                <View style={styles.imgRow}>
                    {
                        item.vaccinePic.map((picId, index) => {

                            return (
                                <TouchableOpacity key={index} onPress={() => this.setState({
                                    mediaPaths: item.vaccinePic,
                                    selectedMediaIndex: item.vaccinePic.indexOf(picId),
                                    photoModalVisible: true
                                })}>
                                    <Image source={{ uri: petVaccinePicUrl + "/" + picId }}
                                        indicatorProps={{
                                            color: '#ECC951',
                                        }}
                                        style={styles.imgStyle} />
                                </TouchableOpacity>
                            )
                        })
                    }

                </View>
                <View style={styles.eachRow}>
                    <View style={styles.iconContainer}>
                        <Img
                            style={{ width: 20, height: 20 }}
                            source={require("../../assets/icons/injection.png")} />
                    </View>
                    <Text style={styles.txtStyle}>{item.vaccineName}</Text>
                </View>
                <View style={styles.eachRow}>
                    <View style={styles.iconContainer}>
                        <FIcon name="calendar" color="#191e1f" size={15} />
                    </View>
                    <Text style={styles.txtStyle}>{item.injectionDate}</Text>
                </View>
                {
                    item.nextInjectionDate === "" ?
                        null
                        :
                        <View style={styles.eachRow}>
                            <View style={styles.iconContainer}>
                                <Icons name="skip-next" color="#191e1f" size={20} />
                            </View>
                            <Text style={styles.txtStyle}>{item.nextInjectionDate}</Text>
                        </View>

                }

                {
                    item.vaccinationNote === "" ?
                        null
                        :
                        <View style={styles.eachRow}>
                            <View style={styles.iconContainer}>
                                <Img
                                    style={{ width: 20, height: 20 }}
                                    source={require("../../assets/icons/writing.png")} />
                            </View>
                            <Text style={styles.txtStyle}>{item.vaccinationNote}</Text>
                        </View>

                }
            </View>
        )
    }

    render() {
        let { resources, loading, petId, mediaPaths, selectedMediaIndex } = this.state;
        
        if (loading) {
            return (
                <View style={{ justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(25, 30, 31,0.5)', flex: 1 }}>
                    <ActivityIndicator size="large" color='#FFEB3B' />
                </View>
            )
        }

        let paths = []

        if (mediaPaths) {
            paths = mediaPaths.map(path => {
                return { source: { uri: petVaccinePicUrl + "/" + path } };
            })
        }

        return (
            <ImageBackground
                style={{ flex: 1, width: null, height: null }}
                source={require('../../assets/images/background.jpg')}
            >
                <ScrollView showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='always'>
                    {
                        resources.length === 0 ?
                            <View style={{ alignItems: 'center', marginTop: scale(20) }}>
                                <RkText style={{ fontSize: 25, color: '#ECC951' }}>
                                    No Vaccination Yet!
                                </RkText>
                            </View>
                            :
                            <FlatList
                                data={resources}
                                renderItem={this._renderItems}
                            />
                    }

                    <View>
                        <RkButton rkType='stretch' style={styles.addVacci}
                            onPress={() => this.props.navigation.navigate("AddVaccination", { 'petId': petId, 'refresh': () => this.getAllPetVaccination(petId) })}>
                            <RkText style={{ color: '#ECC951' }}>ADD VACCINATION</RkText>
                        </RkButton>
                    </View>
                    <PhotoView
                        visible={this.state.photoModalVisible}
                        data={paths}
                        hideStatusBar={true}
                        hideCloseButton={true}
                        hideShareButton={true}
                        initial={parseInt(selectedMediaIndex) || 0}
                        onDismiss={e => {
                            this.setState({ photoModalVisible: false });
                        }}
                    />
                </ScrollView>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    addVacci: {
        borderWidth: 1,
        borderColor: '#ECC951',
        marginHorizontal: scale(10),
        marginVertical: scale(10),
        backgroundColor: 'rgba(25, 30, 31,0.5)'
    },
    container: {
        paddingBottom: 5,
        backgroundColor: 'rgba(25, 30, 35,0.6)',
        marginHorizontal: scale(10),
        marginTop: scale(10),
        borderRadius: 30
    },
    eachRow: {
        flexDirection: "row",
        marginHorizontal: scale(5),
        alignItems: "center",
        marginBottom: scale(3)
    },
    imgRow: {
        flexDirection: "row",
        marginVertical: scale(5)
    },
    imgStyle: {
        width: scale(70),
        borderWidth: 1,
        borderColor: "#ECC951",
        borderRadius: 20,
        overflow: "hidden",
        marginLeft: scale(5),
        height: scale(75),
        resizeMode: 'contain'
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: scale(25),
        width: scale(25),
        backgroundColor: "#ECC951",
        borderRadius: 30
    },
    txtStyle: {
        color: "#fff",
        marginLeft: scale(5)
    }
})

