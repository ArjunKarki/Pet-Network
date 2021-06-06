import { saveOwnerInfo, sendLoginEmailUrl } from "../globle";
import { AsyncStorage } from 'react-native';
import LoggedUserCredentials from "./LoggedUserCredentials";
import md5 from "react-native-md5";

class Owner {

    email = "";
    password = "";
    firstName = "";
    lastName = ""
    country = "";
    city = "";
    job = "";
    dob = "";
    phNo = "";
    gender = "";
    image = null;
    proPic = null;
    description = "";

    static setEmailPassword(email, password) {
        this.email = email;
        this.password = md5.hex_md5(password);
    }

    static setFirstPageData(firstName, lastName, country, city, job, dob, phNo, gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.country = country;
        this.city = city;
        this.job = job;
        this.dob = dob;
        this.phNo = phNo;
        this.gender = gender;
    }

    static async setSecondPageData(description, proPic) {
        this.description = description;
        this.proPic = proPic;
        let ownerName = this.firstName + " " + this.lastName
        console.log(this.email),
            console.log(ownerName);
        let Data = {
            "email": this.email,
            "ownerName": ownerName
        }
        let path = sendLoginEmailUrl

        console.log(Data);

        let config = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Data)
        }
        try {
            let res = await fetch(path, config);
            let resJson = await res.json()
            console.log(resJson)
            console.log("Send Email", res)
            return resJson.message;

        } catch (error) {
            return "ERROR"
        }
    }


    static showData() {
        console.log(this.firstName + " " + this.lastName + " " + this.country + " " + this.city + " " + this.job + " " + this.dob + " " + this.phNo + " " + this.gender + " " + this.description + " " + this.image)
    }

    static async storeOwnerInfo() {

        let Data = {
            firstName: this.firstName,
            lastName: this.lastName,
            country: this.country,
            city: this.city,
            job: this.job,
            dob: this.dob,
            phNo: this.phNo,
            gender: this.gender,
            description: this.description,
            playerId: LoggedUserCredentials.getPlayerId()
        }

        let creData = {
            email: this.email,
            password: this.password
        }

        let ownerInfo = new FormData();
        ownerInfo.append('ownerInfo', JSON.stringify(Data));

        ownerInfo.append('creInfo', JSON.stringify(creData));

        if (this.proPic) {
            ownerInfo.append('ownerProPic', {
                uri: this.proPic.path,
                type: this.proPic.mime,
                name: 'propic' + '.' + this.proPic.mime.split('/')[1]
            });
        }

        let config = {

            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: ownerInfo
        }

        try {

            let res = await fetch(saveOwnerInfo, config);
            console.log(res)
            let resJson = await res.json();
            console.log("Owner", resJson)
            if (res.status === 201) {
                const accessTokenArray = ["accessToken", resJson.token];
                const ownerIdArray = ['ownerId', resJson.ownerId];
                const ownerNameArray = ['ownerName', this.firstName + " " + this.lastName];
                const playerIdArray = ['playerId', LoggedUserCredentials.getPlayerId()];
                LoggedUserCredentials.setLoggedUserData(resJson.token, this.firstName + " " + this.lastName, resJson.ownerId, LoggedUserCredentials.getPlayerId())
                await AsyncStorage.multiSet([accessTokenArray, ownerIdArray, ownerNameArray, playerIdArray]);
                return "SAVED"
            } else if (resJson.message === "ERROR") {
                return "ERROR"
            } else {
                return "MAIL_EXISTS"
            }

        } catch (error) {
            console.log("Save OwnerInfo Error:", error);
            return "ERROR"
        }

    }
}

export {
    Owner
}