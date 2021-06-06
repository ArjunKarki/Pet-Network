import { loginUrl } from './globle';
import LoggedUserCredentials from './modal/LoggedUserCredentials';

function checkResponse(res, path, configuration) {
    console.log(res);
    if (res.status === 401) {
        const url = loginUrl + '/refresh';

        // console.log('refreshToken from commenService', LoggedUserCredentials.getRefreshToken());

        const config = {
            headers: {
                'Authorization': 'Bearer ' + LoggedUserCredentials.getRefreshToken()
            },
            method: 'GET'
        }

        //fetch the refresh token
        fetch(url, config)
            .then(res => LoggedUserCredentials.setAccessToken(res.headers.map.accesstoken))
            .catch(err => console.log(err));

        //getConfig method return config object 
        const getConfig = (configuration) => {
            let updatedHeader = { 'Authorization': 'Bearer ' + LoggedUserCredentials.getAccessToken() };
            configuration['headers'] = updatedHeader;
            return configuration;
        }

        return fetch(path, getConfig(configuration))
            .then(res => { return res })
            .catch(err => console.log(err));

    } else {
        return res;
    }
}

function formatDate(date) {
    let current = new Date()
    let toFormat = new Date(date)
    let day, monthIndex, year
    if (toFormat.getMonth() >= current.getMonth() && toFormat.getDate() >= current.getDate() && toFormat.getFullYear() >= current.getFullYear()) {
        day = toFormat.getDate();
        monthIndex = toFormat.getMonth() + 1;
        year = toFormat.getFullYear();

    } else {
        day = current.getDate();
        monthIndex = current.getMonth() + 1;
        year = current.getFullYear();
    }
    return day + '/' + monthIndex + '/' + year;

}

export {
    checkResponse,
    formatDate
}