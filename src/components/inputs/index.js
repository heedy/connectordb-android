// datatypes references the types of data that can be input/viewed by the frontend.
// An example of an input is the star ratings. When a stream with the star rating datatype
// is queried, the getInput function returns a component where stars can be clicked to input ratings
// In the case of views, given a stream, it returns an array of components: the visualizations/plots/tables
// that will show cool stuff.

// combine takes the given array, and combines it with dots
function combine(arr) {
    let res = "";
    for (let i = 0; i < arr.length; i++) {
        if (i != 0) {
            res += ".";
        }
        res += arr[i];
    }
    return res;
}

// getFromDict is a helper function, used later in the file to correctly separate
// datatypes by dots.
function getFromDict(dict, datatype, schema) {
    let datapath = datatype.split(".");
    let currpath = "";
    for (let i = datapath.length; i >= 0; i--) {
        currpath = combine(datapath.slice(0, i));
        if (dict[currpath] !== undefined) {
            // console.log("Using " + plugintype + " plugin '" + currpath + "' for datatype '" + datatype + "'");
            return dict[currpath];
        }

    }
    // If we got here, the datatype was not found. Hopefully, we can still salvage it
    // by checking the schema
    if (schema.type !== undefined && dict["type:" + schema.type] !== undefined) {
        return dict["type:" + schema.type];
    }

    return null;
}

// add and get input - there can only be a single input component per stream. The inputs are set up by datatype.
// The search for valid inputs goes by dots - if we have a registered input for rating.stars, and the stream
// has datatype rating.stars.supercool, and supercool is not given, then rating.stars is returned. If no datatype
// can be found, it attempts to return an input component for the given json schema. If all else fails, return null.
var inputdict = {};

export function addInput(datatype, input) {
    inputdict[datatype] = input;
}

export default function getInput(datatype, schema) {
    return getFromDict(inputdict, datatype, schema);
}

