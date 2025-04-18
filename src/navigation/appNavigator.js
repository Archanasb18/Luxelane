import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import HomeScreen from '../screens/homeScreen';
import DetailScreen from '../screens/detailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        // <View>
        //     <Text>heyyyy</Text>
        // </View>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Detail" component={DetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
