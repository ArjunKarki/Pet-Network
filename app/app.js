import React from 'react';

import {
    createDrawerNavigator,
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation';

import * as Screens from './screens';
import { bootstrap } from './config/bootstrap';
import { scale } from './utils/scale';
import { EditHairCutActivity } from './screens';

bootstrap();

console.disableYellowBox = true;

const SideMenu = Screens.SideMenu;

const PostStack = createStackNavigator(
    {
        Post: { screen: Screens.PostList },
        PostUpload: { screen: Screens.PostUpload },
        ArticleUpload: { screen: Screens.ArticleUpload },
        Noti: { screen: Screens.Notification },
        PetProfile: { screen: Screens.PetProfile }
    },
);

const ArticleStack = createStackNavigator(
    {
        ArticleList: { screen: Screens.ArticleLists },
        EachArticle: { screen: Screens.Article },
        ArticleUpload: { screen: Screens.ArticleUpload },
    }
);

const ProfileStack = createStackNavigator(
    {
        MainOwnerProfile: { screen: Screens.OwnerProfile },
        EditProfile: { screen: Screens.EditProfile },
        AddPet: { screen: Screens.AddPet },
        PetDetail: { screen: Screens.PetDetail },
        PetVaccination: { screen: Screens.PetVaccination },
        AddVaccination: { screen: Screens.AddVaccination },
        FollowerList: { screen: Screens.FollowerList },
        FollowingList: { screen: Screens.FollowingList },
        EditPetInfo: { screen: Screens.EditPetInfo },
        PetProfile: { screen: Screens.PetProfile },
        Gallery: { screen: Screens.Gallery },
        PetMedication: { screen: Screens.PetMedication },
        PetHairCut: { screen: Screens.PetHairCut },
        CreateHairCutActivity: { screen: Screens.CreateHairCutActivity },
        EditHairCutActivity:{screen:Screens.EditHairCutActivity}
    }
);

const MyPetsStack = createStackNavigator(
    {
        MyPetsList: { screen: Screens.MyPets },
    }
);

const EventStack = createStackNavigator(
    {
        EventsList: { screen: Screens.EventList },
        CreateEvent: { screen: Screens.CreateEvent },
        CommunityEvents: { screen: Screens.CommunityEvent },
        MyEvents: { screen: Screens.MyEvent },
        EventPosts: { screen: Screens.EventPost },
        CreatePost: { screen: Screens.CreateEventPost }
    }
);

const NavigationDrawer = createDrawerNavigator(
    {
        Post: { screen: PostStack },
        Article: { screen: ArticleStack },
        OwnerProfile: { screen: ProfileStack },
        MyPets: { screen: MyPetsStack },
        Event: { screen: EventStack }
    },
    {
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        contentComponent: props => <SideMenu {...props} />,
        drawerWidth: scale(320)
    }
);

const AuthStack = createStackNavigator(
    {
        SignIn: { screen: Screens.Login },
        SignUp: { screen: Screens.SignUp },
        OwnerInfo: { screen: Screens.OwnerInfo },
        AddProfile: { screen: Screens.AddProfile },
        ComfirmOTP: { screen: Screens.ComfirmOTP },
        NewPassword: { screen: Screens.NewPassword }
    }
);

const MainApp = createSwitchNavigator(
    {
        AuthLoading: { screen: Screens.SplashScreen },
        App: { screen: NavigationDrawer },
        Auth: { screen: AuthStack },
    },
    {
        initialRouteName: 'AuthLoading',
    }
);

export default class App extends React.Component {

    render() {
        return <MainApp />
    }
};

