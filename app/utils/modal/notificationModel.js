import { formatDate } from "../commonService";

export class NotificationModel {

    constructor(noti) {

        this.id = noti._id;
        this.type = noti.type;
        this.description = this.getDescription(noti);
        this.setUserName(noti.createdBy)
        //this.username = noti.createdBy ? noti.createdBy.firstName + " " + noti.createdBy.lastName : null
        this.setUserId(noti.createdBy)
        //this.userId = noti.createdBy ? noti.createdBy._id : null
        this.dataId = noti.dataId;
        this.createdAt = noti.createdAt;
        this.isViewed = false;
        //this.petName = noti.pet ? noti.pet.petName : null;
        this.setPet(noti.pet)
        this.setMedia(noti.media);
    }

    setUserName(createdBy) {
        if (createdBy) {
            console.log(createdBy.firstName)
            this.username = createdBy.firstName + " " + createdBy.lastName
        }
    }

    setUserId(createdBy) {

        if (createdBy) {
            console.log("setuserId", createdBy._id)
            this.userId = createdBy._id
        }
    }

    setPet(pet) {

        if (pet) {
            this.pet = {
                petName: pet.petName,
                petId: pet._id,
                petProPic: pet.petProPic
            }
        }
    }

    setMedia(media) {

        if (media) {
            this.media = {
                mediaId: media._id,
                contentType: media.contentType
            }
        }
    }

    getDescription(noti) {
        switch (noti.type) {
            case 'CREATE-POST': {
                return 'created a new post.';
                break;
            }
            case 'COMMENT-POST': {
                return 'commented on your post.';
                break;
            }
            case 'LIKE-POST': {
                return 'liked your post.';
                break;
            }
            case 'MATCH-REQUEST': {
                return 'sent you a match request.';
                break;
            }
            case "HAIR-CUT": {
                console.log("d", noti.pet)
                let rn = noti.pet.reminder.find(x => x.type == "HAIR-CUT")
                let remDate = new Date(rn.date).getDate()
                let current = new Date().getDate()

                if (remDate == current) {
                    return ' has hair-cut schedule today'
                    break;
                } else {
                    return ' has hair-cut schedule tomorrow '
                    break;
                }
            }
        }
    }
}
