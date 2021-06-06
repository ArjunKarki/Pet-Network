import { AsyncStorage } from 'react-native';

export default class LoggedUserCredentials {
    
    accessToken = '';
    ownerName = '';
    ownerId = '';
    playerId = '';
    hasNoti = false;

    static setLoggedUserData(accessToken, ownerName, ownerId, playerId) {
        this.accessToken = accessToken;
        this.ownerName = ownerName;
        this.ownerId = ownerId;
        this.playerId = playerId
    }

    static getAccessToken() {
        return this.accessToken;
    }

    static setAccessToken(accessToken) {
        this.accessToken = accessToken;
        AsyncStorage.setItem('accessToken', accessToken)
    }

    static setOwnerName(name) {
        this.ownerName = name;
        AsyncStorage.setItem('ownerName', name)
    }

    static getOwnerName() {
        return this.ownerName;
    }

    static getOwnerId() {
        return this.ownerId;
    }

    static setPlayerId(playerId) {
        this.playerId = playerId;
    }

    static getPlayerId() {
        return this.playerId;
    }

    static setNoti(noti) {
        this.hasNoti = noti;
    }

    static getNoti() {
        return this.hasNoti;
    }
}