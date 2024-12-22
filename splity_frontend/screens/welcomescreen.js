import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const WelcomeScreen = ({ navigation }) => {

    const navigateToAnotherScreen = () => {
      navigation.navigate('SignInScreen');
    };

    return(
        <View style={styles.container}>
        <Image source={require('../assets/welcome.png')} style={styles.backgroundImage} />
        <TouchableOpacity style={styles.arrowContainer} onPress={navigateToAnotherScreen}>
        <Image source={require('../assets/arrow.png')} style={styles.arrowImage} />
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
      },
      backgroundImage: {
        flex: 1,
        // resizeMode: 'contain',
        width:"100%"
      },
      arrowContainer: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      arrowImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        bottom: 10,
        right: 20
      },
});

export default WelcomeScreen;
