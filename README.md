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


## Building

To set up a React Native environment, you will need to [follow the tutorial](https://facebook.github.io/react-native/docs/tutorial.html).

The app is divided into two components. The entire UI is written using React Native components,
which will allow code sharing with a future IOS app.

On the other hand, all background data-gathering functionality is platform-specific code
(Unfortunately, the two mobile OS have fundamentally different APIs for data gathering).

## Packages

```
react-native-icons
```

### Debugging

Start `adb`, and begin emulating your preferred virtual device. The following will install the app on your device:

```
react-native run-android
```

Once this is done, on windows, you need to start the server:

```
react-native start
```

Finally, since the menu isn't available in the android virtual device, you'll need to run the following and enable live reload, as well as possibly debug in chrome:

```
adb shell input keyevent 82
```
