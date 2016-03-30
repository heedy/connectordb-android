// InitailState is the application state the first time you boot it up
const InitialState = {
    // Whether the state was loaded correctly
    loaded: false,
    gather: true,
    auth: {
        apikey: "",
        server: "https://connectordb.com",
        username: "",
        device: "phone",
    },
    // app: these properties are for holding the app's current state, and are not saved.
    app: {
        username_textbox: "",
        password_textbox: "",
        device_textbox: "",
        server_textbox: ""
    },
};

export default InitialState;
