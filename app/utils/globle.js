const local = 'http://192.168.43.73:3000';

//const local = 'http://192.168.43.73:3000';

const server = 'https://petnetwork.martersolutions.com';

const OneSignal_APP_Id = '0353aa65-9228-402f-934d-d9a08d5fe61b';

const baseUrl = local;

const loginUrl = baseUrl + "/owners/login";

const signupUrl = baseUrl + "/owners/checkEmail";

const saveOwnerInfo = baseUrl + "/owners/signup/saveOwnerInfo";

const ownerProPicUrl = baseUrl + "/owners/profile_pic"

const ownerProfileUrl = baseUrl + "/owners/owner_profile"

const petListUrl = baseUrl + "/pets/petList"

const addPetUrl = baseUrl + "/pets/addPets"

const petProPicUrl = baseUrl + "/pets/getPetProPic"

const updateOwnerInfoWithoutProPicUrl = baseUrl + "/owners/updateOwnerInfo/withoutProPic"

const updateOwnerInfoWithProPicUrl = baseUrl + "/owners/updateOwnerInfo/withProPic"

const showFollowerListUrl = baseUrl + "/owners/showFollowerList"

const showFollowingListUrl = baseUrl + "/owners/showFollowingList"

const followOwnerUrl = baseUrl + "/owners/followOwner"

const cmtUrl = baseUrl + '/comments';

const unfolloOwnerUrl = baseUrl + "/owners/unfollowOwner"

const requestMatchUrl = baseUrl + "/pets/requestMatch"

const vaccinationlistUrl = baseUrl + "/pets/vaccinationList"

const addPetVaccinationUrl = baseUrl + "/pets/addVaccination"

const addPetHairCutUrl = baseUrl + "/pets/addHairCut"

const editPetHairCutUrl=baseUrl+"/pets/editHairCut"

const hairCutListUrl = baseUrl + "/pets/getHairCut"

const deleteHairCutUrl = baseUrl + "/pets/deletePreviousHairCut"

const setHiarCutReminderUrl = baseUrl + "/pets/addHairCutReminder"

const comfirmHairCutReminderUrl=baseUrl+"/pets/comfirmHairCutReminder"

const removeHairCutReminderUrl=baseUrl+"/pets/removeHairCutReminder"

const articleUrl = baseUrl + "/articles"

const postUrl = baseUrl + "/posts"

const eventUrl = baseUrl + "/events"

const editProfileUrl = baseUrl + "/owners/editProfile"

const aboutOwnerUrl = baseUrl + "/owners/aboutOwner"

const petVaccinePicUrl = baseUrl + "/pets/showVaccinePic"

const updatePetInfoWithoutProPicUrl = baseUrl + "/owners/updatePetInfo/withoutProPic"

const updatePetInfoWithProPicUrl = baseUrl + "/owners/updatePetInfo/withProPic"

const sendLoginEmailUrl = baseUrl + "/owners/signup/sendLoginEmail"

const sendResetPasswordEmailUrl = baseUrl + "/signup/sendResetPasswordEmail"

const saveNewPasswordUrl = baseUrl + "/owners/resetPassword"

export {
    baseUrl,
    loginUrl,
    signupUrl,
    saveOwnerInfo,
    articleUrl,
    postUrl,
    addPetUrl,
    editProfileUrl,
    ownerProfileUrl,
    cmtUrl,
    ownerProPicUrl,
    petListUrl,
    petProPicUrl,
    aboutOwnerUrl,
    followOwnerUrl,
    unfolloOwnerUrl,
    addPetVaccinationUrl,
    petVaccinePicUrl,
    vaccinationlistUrl,
    showFollowerListUrl,
    showFollowingListUrl,
    updateOwnerInfoWithoutProPicUrl,
    updateOwnerInfoWithProPicUrl,
    updatePetInfoWithProPicUrl,
    updatePetInfoWithoutProPicUrl,
    OneSignal_APP_Id,
    eventUrl,
    sendLoginEmailUrl,
    sendResetPasswordEmailUrl,
    saveNewPasswordUrl,
    requestMatchUrl,
    addPetHairCutUrl,
    hairCutListUrl,
    deleteHairCutUrl,
    setHiarCutReminderUrl,
    removeHairCutReminderUrl,
    comfirmHairCutReminderUrl,
    editPetHairCutUrl
}



