
export function basicTest() {
    return { type: "INCREMENT_ASYNC" };
}

export function queryUser(u) {
    return { type: "QUERY_USER", user: u };
}

export function refreshDownlinks() {
    return { type: "REFRESH_DOWNLINKS" };
}

export function refreshInputs() {
    return { type: "REFRESH_INPUTS" };
}

export function insert(username, devicename, streamname, data) {
    return {
        type: "INSERT_STREAM",
        username: username,
        devicename: devicename,
        streamname: streamname,
        value: data
    };
}