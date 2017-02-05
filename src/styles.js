import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    tabView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
        marginTop: 10,
        marginBottom: 20
    },
    loginView: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.01)',
        paddingTop: 20,
        marginBottom: 20
    },
    tabViewRefreshContainer: {
        marginRight: -20    // WTF react ntaive - why does a pull to refresh make stuff misaligned?
    },
    card: {
        borderWidth: 1,
        backgroundColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        margin: 5,
        padding: 15,
        shadowColor: '#ccc',
        shadowOffset: { width: 2, height: 2, },
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    p: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    h1: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});

export default styles;