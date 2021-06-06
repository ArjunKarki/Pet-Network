package com.petnetwork;

import android.content.Intent;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "PetNetwork";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);

    }
}
