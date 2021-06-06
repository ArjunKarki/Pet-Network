import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Dimensions,
    Image,
} from 'react-native';
import { eventUrl } from '../../utils/globle';
import PhotoView from "@merryjs/photo-viewer";
import { scaleVertical } from '../../utils/scale';
import ImageScalable from 'react-native-scalable-image';

export class Media extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imgHeight: 300,
            imgVisible: false
        }
    }

    render() {
        const { imgVisible } = this.state;
        const { data } = this.props;
        let path = eventUrl + '/media/' + data[0].mediaId;

        return (
            <View>
                <TouchableWithoutFeedback
                    onPress={() => this.setState({ imgVisible: true })}
                    >
                    <ImageScalable
                        width={Dimensions.get('window').width} // height will be calculated automatically
                        source={{ uri: path }}
                    />
                    {/* <Image
                        onLoad={event => this.setState({ imgHeight: event.nativeEvent.source.height })}
                        source={{ uri: path }}
                        style={{ height: this.state.imgHeight }} /> */}
                </TouchableWithoutFeedback>

                {/* photo view modal */}
                <PhotoView
                    visible={imgVisible}
                    data={[{ source: { uri: path } }]}
                    hideStatusBar={false}
                    hideCloseButton={true}
                    hideShareButton={true}
                    initial={0}
                    onDismiss={e => {
                        this.setState({ imgVisible: false });
                    }} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#191e1f',
        paddingBottom: scaleVertical(25)
    },
})

