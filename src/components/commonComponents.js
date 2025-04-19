import { View ,Text, TouchableOpacity} from "react-native";
import { globalStyles } from "../styles/globalStyles";
import AntDesign from 'react-native-vector-icons/AntDesign';

export const PageHeader = ({ title ,onBackPress}) => {
    return (
        <View style={globalStyles.pageHeaderContainer}>
            <TouchableOpacity onPress={onBackPress}>
            <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text style={globalStyles.pageHeaderText}>{title}</Text>
        </View>
    );
};