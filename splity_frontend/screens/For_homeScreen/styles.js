import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    requestItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f8f8f8',
        borderColor: '#ddd',
        borderRadius: 15,
    },
    overlay: {
        position: 'absolute',
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderWidth: 5,
        borderColor: 'red'
    },
    flatListPendingRequests: {
        position: 'absolute',
        left: "5%",
        right: 0,
        bottom: 15,
        zIndex: 0,
        width: "90%",
    },
    flatListContent: {
        flexGrow: 1,
    },
    searchContainer: {
        position: 'absolute',
        width: '90%',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        padding: 8,
        borderRadius: 15,
        left: 20,
        bottom: 30,
        paddingVertical: 20,
        paddingHorizontal: 15
    },
    passengerCommunication: {
        position: 'absolute',
        width: '90%',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 4,
        padding: 8,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        left: 20,
        bottom: 27,
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    greetingText: {
        fontWeight: 'bold',
        paddingVertical: 5,
        fontSize: 16
    },
    input: {
        backgroundColor: '#EAECF0',
        borderRadius: 10,
        marginVertical: 5
    },
    button: {
        backgroundColor: '#EAECF0',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignItems: 'center',
        width: 50,
        height: 44,
        borderWidth: 0.2,

    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: 5,
        position: 'absolute',
        right: 0,
        height: '100%',
        width: '70%',
        backgroundColor: 'white',
        borderRadius: 20,
        bottom: 5
    },
    container1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 100,
        width: '140%',
        position: 'absolute',
        right: 0
    },
    header: {
        top: 0,
        right: 40,
        marginBottom: 700
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
    },
    optionsparent: {
        width: '100%',
        paddingVertical: 10
    },
    exit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    searchGlass: {
        position: 'absolute',
        width: 50,
        height: 50,
        resizeMode: 'contain',
        bottom: 10,
        right: 0,

    },
    riderButtonOn: {
        borderWidth: 2,
        width: 180,
        height: 120,
        marginHorizontal: 10,
        borderRadius: 15,
        borderColor: '#6F52EA',
        justifyContent: 'center', alignItems: 'center'
    },
    riderButtonOff: {
        width: 120,
        height: 110,
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#E1E1E1'
    },
    nextButton: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C08AFF',
        paddingVertical: 15,
        borderRadius: 10,
        top: 10
    },
    nextButton2: {
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C08AFF',
        paddingVertical: 10,
        borderRadius: 10,
        top: 5
    },
    carSelection: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#EFEFEF',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 5,
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    otherSelection: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 5

    },
    message: { paddingVertical: 10, paddingHorizontal: 30, backgroundColor: '#C08AFF', flexDirection: 'row', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    call: { paddingVertical: 20, paddingHorizontal: 30, backgroundColor: '#0EB667', flexDirection: 'row', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    imageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        backgroundColor: '#ccc',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    menuButton: {
        position: 'absolute',
        top: 70,
        right: 30,
        zIndex: 1,
    },
    menuIcon: {
        width: 30,
        height: 30,
        backgroundColor: '#6F52EA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 20,
        borderRadius: 10
    },
    menuBar: {
        width: 15,
        height: 2,
        backgroundColor: 'white',
    },
});

export default styles;