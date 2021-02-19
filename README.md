# Hello UI5 Cordova 

This Cordova project demonstrates an issue with using OpenUI5 and Cordova iOS when running the app on iOS 12.

I'm not sure if the bugs are a Cordova issue or an OpenUI5 issue since the app runs fine on iOS 11, 13 and 14.

# Setup

Dependencies:

* Cordova CLI
* Android SDK Tools (if you want to run the app on Android)

Generate the files to run the app on an iOS device:

    cordova platform add ios

If you also want to be able to run the app on Android:

    cordova platform add android

# Running the application

Use these commands to build the app and open the XCode project:

    cordova build android
    open platforms/ios/HelloWorldUI5.xcodeproj

Then run the application from XCode.

Use this command to start the application on Android:

    cordova run android

# Replicating the bugs

Launch the app on an iOS device (emulator or actual device) running iOS 12.4. I believe the issues would happen with any 12.x version of iOS; 12.4 is highest so I've been testing with that on an emulator.

Press the Show Today's Date button. Instead of showing a toast with today's date, the page appears to refresh. This is the JavaScript line that's not executing as expected:
```
DateFormat.getDateTimeInstance({ pattern: "yyyy-MM-dd HH:mm:ss.S" });
```

Press the Go To Detail Page button. The app crashes rather than showing the page with a Calendar.

Press the Filter icon button at the top right of the home page.
Instead of showing the Dialog with a `sap.m.DatePicker`, the page appears to refresh.

If you run the app on Android or a different iOS version, the app behaves as expected (with a couple exceptions noted below for iOS 11).
Additionally, if you checkout the `working` branch, you can run the app on iOS 12.4 and navigate to the Detail Page without the app crashing because the page does not have the `sap.ui.unified.Calendar` control on it.

## iOS 11

If you run the app on iOS 11.3 there a couple of different bugs you'll encounter.

Pressing the Open Action Sheet button does not open the action sheet and pressing the Filter icon button does not open the filter dialog. This is because file could not be loaded errors are being thrown.

![Screen Shot 2021-02-19 at 10 39 25 AM](https://user-images.githubusercontent.com/8753239/108534818-31287180-72a0-11eb-9b31-2a9637d60627.png)

In my other app I was able to resolve these errors by generating a UI5 component preload file.
However, I have been unable to successfully do that in this sample app.

# Attempts to fix the issues

I have tried upgrading to [UI5 1.85.2](https://openui5.org/releases/) but that did not resolve the issues.