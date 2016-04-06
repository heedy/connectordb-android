# ConnectorDB Mobile App

This is the ConnectorDB android app. While our usage of React Native enables IOS to use a similar UI, the data-gathering extensively uses native android APIs, so it would need to be rewritten specifically for IOS.

## Data Gathering

The app gathers the following in the background:

- [x] Steps
- [x] Activities
- [x] Plug in events
- [x] Location (GPS)
- [x] Screen on/off
- [ ] Active App

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
