import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native'; 
export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').width;

export const colors = {
    primary: '#ea4c89',
    secondary: '#E6E6E6',
    text: '#333',
    lightText: '#666',
    background: '#f8f9fa',
    white: '#fff',
    border: '#ddd',
    error: '#d9534f',
};

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background, 
    },
    pageHeaderContainer: {
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection:'row',
        paddingVertical:8,
        height:50,
        paddingVertical:15
    },
    pageHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft:8
    },
    carousalLeftArrow: {
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: [{ translateY: -12 }],
        zIndex: 1,
      },
      carousalRightArrow: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -12 }],
        zIndex: 1,
      },
      carousalImage: {
        width: 300,
        height: 200,
        borderRadius: 10,
      },
      errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#ff4d4d',
        textAlign: 'center',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
});

export const typography = StyleSheet.create({
    h1: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    body: {
        fontSize: 16,
        color: colors.text,
    },
    // Add more text styles
});