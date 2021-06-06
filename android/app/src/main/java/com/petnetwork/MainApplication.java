package com.petnetwork;

import android.app.Application;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.util.Base64;
import android.util.Log;

import com.facebook.FacebookSdk;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.react.ReactApplication;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

import co.apptailor.googlesignin.RNGoogleSigninPackage;

import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.arttitude360.reactnative.rngoogleplaces.RNGooglePlacesPackage;

import io.realm.react.RealmReactPackage;

import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;

import cl.json.RNSharePackage;
import cl.json.ShareApplication;

import com.airbnb.android.react.maps.MapsPackage;

import com.merryjs.PhotoViewer.MerryPhotoViewPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;


import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;


import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication, ShareApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new FastImageViewPackage(),
                    new RNGoogleSigninPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new RNGooglePlacesPackage(),
                    new RealmReactPackage(),
                    new ReactNativeOneSignalPackage(),
                    new RNSharePackage(),
                    new MerryPhotoViewPackage(),
                    new PickerPackage(),
                    new LottiePackage(),
                    new LinearGradientPackage(),
                    new OrientationPackage(),
                    new VectorIconsPackage(),
                    new KCKeepAwakePackage(),
                    new ReactVideoPackage(),
                    new MapsPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        Fresco.initialize(this);

        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(this);

        // Add code to print out the key hash
        try {
            PackageInfo info = getPackageManager().getPackageInfo(
                    "com.petnetwork",
                    PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
            }
        } catch (PackageManager.NameNotFoundException e) {

        } catch (NoSuchAlgorithmException e) {

        }
    }

    @Override
    public String getFileProviderAuthority() {
        return "com.petnetwork.provider";
    }
}
