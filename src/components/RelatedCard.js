import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '../styles/globalStyles';
const RelatedCard = ({ item,onPress}) => {
    return (
        <TouchableOpacity
      style={cardStyles.relatedCard}
      onPress={onPress}
    >
      <Image source={{ uri: item.images[0] }} style={cardStyles.relatedImage} />
      <Text style={cardStyles.relatedTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
    );
};

export default RelatedCard;

const cardStyles = StyleSheet.create({
    relatedCard: {
        marginRight:25,
        width: screenWidth*0.3,
        alignItems: 'center',
      },
      relatedImage: {
        width: screenWidth*0.33,
        height: screenHeight*0.15,
        borderRadius: 10,
      },
      relatedTitle: {
        marginTop: 6,
        fontSize: 14,
        textAlign: 'center',
      },
    
});
