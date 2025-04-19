import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeScreen';
import DetailScreen from '../screens/detailScreen';
import SplashScreen from '../screens/splashScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash"screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Home" component={HomeScreen}options={{ headerShown: true }}/>
                <Stack.Screen name="Detail" component={DetailScreen}options={{ headerShown: true }}/>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
