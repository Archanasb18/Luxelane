import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { globalStyles } from "../styles/globalStyles";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { width } from "react-native";
export const PageHeader = ({ title, onBackPress }) => {
    return (
        <View style={globalStyles.pageHeaderContainer}>
            <TouchableOpacity onPress={onBackPress}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text style={globalStyles.pageHeaderText}>{title}</Text>
        </View>
    );
};

export const LoadingScreen = ({ }) => {
    return (
        <View style={globalStyles.loaderContainer}>
            <ActivityIndicator size="large" color="#ea4c89" />
        </View>
    );
};
export const ErrorScreen = ({ productsError}) => {
    return (
        <View style={globalStyles.errorContainer}>
            <Text style={globalStyles.errorText}>Error loading products: {productsError}</Text>
        </View>
    );
};