import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native';
import { ownerProPicUrl } from '../../utils/globle';
import LoggedUserCredentials from '../../utils/modal/LoggedUserCredentials';
import Icons from 'react-native-vector-icons/Entypo';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import { EventSocialBar } from './comment';
import { EventDetail } from './eventDetail';
import { Media } from './media';

export class EventItem extends PureComponent {

    goToPostList(eventId) {
        this.props.goToPostList(eventId);
    }

    goToProfile(ownerId) {
        this.props.goToProfile(ownerId);
    }

    render() {
        const { event } = this.props;
        let owner = LoggedUserCredentials.getOwnerId();

        return (
            <View>
                {
                    event !== null ?
                        <View style={styles.wrapperStyle}>

                            {/* event header */}
                            < View style={{ flexDirection: 'row', margin: 5 }}>
                                <TouchableOpacity
                                    onPress={() => this.goToProfile(event.ownerId)}>
                                    <Image
                                        style={styles.profileStyle}
                                        source={{ uri: ownerProPicUrl + '/' + event.ownerId }} />
                                </TouchableOpacity>
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '400', marginTop: 13, marginLeft: 5 }}>{event.ownerName} created an event</Text>
                            </View >

                            {/* event title and event type */}
                            <Text style={{ margin: 5, fontSize: 14, fontWeight: '400', letterSpacing: 2, color: '#fff' }}>
                                {event.eventTitle} ({event.eventType})
                            </Text>

                            {/* event cover image */}
                            <Media data={event.media} type="eventitem" />

                            {/* event detail */}
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <MIcons name="date-range"
                                        style={{ color: '#ECC951', fontSize: 20, margin: 5 }} />
                                    <Text style={styles.textStyle}>{event.eventDate}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <MIcons name="access-time"
                                        style={{ color: '#ECC951', fontSize: 20, margin: 5 }} />
                                    <Text style={styles.textStyle}>{event.eventStartTime} to {event.eventEndTime}</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Icons name="address"
                                        style={{ color: '#ECC951', fontSize: 20, margin: 5 }} />
                                    <Text style={styles.textStyle}>{event.eventLocationName}</Text>
                                </View>
                                <Text style={[styles.textStyle, { marginLeft: 10 }]}>{event.eventLocationAddress}</Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <Icons name="info"
                                        style={{ color: '#ECC951', fontSize: 20, margin: 5 }} />
                                    <Text style={styles.textStyle}>{event.eventDescription}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <MIcons name="people"
                                        style={{ color: '#ECC951', fontSize: 20, margin: 5 }} />
                                    <Text style={styles.textStyle}>
                                        {event.going.length == 0 ? null : event.going.length} Going. {event.maybe.length == 0 ? null : event.maybe.length} Interest
                                    </Text>
                                </View>

                                {/* event post */}
                                <View style={{ borderColor: '#42413e', borderTopWidth: 0.5, margin: 5 }} />
                                <TouchableOpacity
                                    onPress={() => this.goToPostList(event.eventId)}
                                    style={styles.createEvent}>
                                    <Image
                                        style={{ width: 40, height: 40, borderRadius: 20 }}
                                        source={{ uri: ownerProPicUrl + '/' + owner }} />
                                    <Text style={styles.textStyle}>Event Post..</Text>
                                    <Icons name="chevron-right" style={{ color: '#ECC951', fontSize: 18, alignSelf: 'flex-end', marginBottom: 8 }} />
                                </TouchableOpacity>

                                {/* event maps and going */}
                                <EventDetail data={event} />

                                {/* event likes ,comment and share view */}
                                <View style={{ borderColor: '#42413e', borderTopWidth: 0.5, margin: 5 }} />
                                <EventSocialBar
                                    eventLikes={event.likes ? event.likes : []}
                                    eventCommentCount={event.comments ? event.comments.length : 0}
                                    eventId={event.eventId}
                                />
                            </View>
                        </View >
                        :
                        null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapperStyle: {
        margin: 5,
        marginBottom: 10,
        padding: 5,
        backgroundColor: '#191e1f',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#42413e',
        elevation: 2,
    },
    profileStyle: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    createEvent: {
        borderColor: '#ECC951',
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        margin: 10
    },
    textStyle: {
        color: '#fff',
        margin: 5
    }
})