import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Animation from 'lottie-react-native';

import noti from '../../assets/animations/noti_show.json';

export default class NotiButton extends Component {

    componentDidMount() {
        const { hasNoti } = this.props;
        if (hasNoti) {
            this.notiAnimation.play();
            setTimeout(() => this.notiAnimation.reset(), 250);
        }
    }

    onPress = () => {
        this.notiAnimation.reset();
        this.props.onPress();
    }

    render() {
        const { style } = this.props;
        return (
            <TouchableOpacity onPress={this.onPress} style={style}>
                <Animation
                    ref={aniRef => this.notiAnimation = aniRef}
                    source={noti}
                />
            </TouchableOpacity>
        )
    }
}