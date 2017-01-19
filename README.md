# ConnectorDB Mobile App

<a href='https://play.google.com/store/apps/details?id=com.connectordb_android&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img width="250" alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png'/></a>

This is the ConnectorDB android app. While our usage of React Native enables IOS to use a similar UI, the data-gathering extensively uses native android APIs, so it would need to be rewritten specifically for IOS.

## Data Gathering

The app gathers the following in the background:

- [x] Steps
- [x] Activities
- [x] Plug in events
- [x] Location (GPS)
- [x] Screen on/off
- [ ] Active App

<img src="https://raw.githubusercontent.com/connectordb/connectordb-android/master/screenshot.png" width="300"/>

## Structure

The app is divided into two components. The entire UI is written using React Native components,
which will allow code sharing with a future IOS app.

On the other hand, all background data-gathering functionality is platform-specific code
(Unfortunately, the two mobile OS have fundamentally different APIs for data gathering).

## Building

To set up a React Native environment, you will need to [follow the tutorial](https://facebook.github.io/react-native/docs/tutorial.html).

To set up the app:

```bash
git clone https://github.com/connectordb/connectordb-android
cd connectordb-android
git submodule update --init
npm install
```

At this point, you can open the ./android directory in android studio, which will create a project for you. After running build in android studio, you need to start the react-native server in the root repo directory:

```bash
react-native start
```

Once the server boots up, you can run the app in debug mode from android studio


Finally, since the menu isn't available in the android virtual device, you'll need to run the following and enable live reload, as well as possibly debug in chrome:

```
adb shell input keyevent 82
```

If running on an external device, you'll need to use adb to forward the debug port:
```bash
adb reverse tcp:8081 tcp:8081
```

### Logging Error

Once you start running the app, you might come across a logging error right after it turns on. This is because the app expects to be able to connect to google's fitness apis (from which it gathers several metrics). You will need to create an OAuth API key for your app as seen here: https://developers.google.com/fit/android/get-api-key

You'll need to use `com.connectordb_android` for the package name, and set up your own debug/release keys to gain api access.

# Extending

## Adding New Loggers

The app was made with extensibility in mind. `android/app/src/main/java/com/connectordb_android/logger/` contains all of the data-gathering code. To create a new logger:
- Extend `BaseLogger` or `GoogleFitLogger` if using google fit data. Use the existing loggers as examples on how this is done
- Add your logger in `LoggerService.java`, so it is started automatically
- Add any new permissions you might need in `AndroidManifest.xml`, and add any google APIs you need in `GoogleApiSingleton.java`
- Submit a pull request! We'd love to include a variety of loggers (with only some on by default)

## Improving the UI

You can directly follow the instructions given in the react native docs. You don't even need to run android studio, as the entire UI is in javascript. If the code seems alien, please look at http://redux.js.org/docs/basics/UsageWithReact.html for a tutorial in React Redux.

I am not a designer, so any help would be greatly appreciated.


## Attribution

Google Play and the Google Play logo are trademarks of Google Inc.