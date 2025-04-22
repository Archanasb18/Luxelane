import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { formatPrice } from '../utils/formatPrice';
import {
    addToCart,
    incrementQuantity,
    decrementQuantity,
} from '../redux/slices/productSlice';

const ArticleCard = ({ item, handleProductPress }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.product.cartItems);
    const quantity = cartItems[item.id]?.quantity || 0;

    return (
        <TouchableOpacity style={cardStyles.card} onPress={() => handleProductPress(item)}>
            <Image source={{ uri: item.images[0] }} style={cardStyles.image} resizeMode="cover" />
            <View style={cardStyles.info}>
                <Text style={cardStyles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={cardStyles.price}>{formatPrice(item.price)}</Text>
                <Text style={cardStyles.categoryNameText}>{item.category?.name || 'N/A'}</Text>
            </View>

            {quantity > 0 ? (
                <View style={cardStyles.stepperContainer}>
                    <TouchableOpacity
                        onPress={() => dispatch(decrementQuantity(item.id))}
                        style={cardStyles.stepperButton}
                    >
                        <Text style={cardStyles.stepperText}>−</Text>
                    </TouchableOpacity>
                    <Text style={cardStyles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                        onPress={() => dispatch(incrementQuantity(item.id))}
                        style={cardStyles.stepperButton}
                    >
                        <Text style={cardStyles.stepperText}>+</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={cardStyles.cartButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        dispatch(addToCart(item));
                    }}
                >
                    <Text style={cardStyles.cartIconText}>🛒</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

export default ArticleCard;

const cardStyles = StyleSheet.create({
    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: 130,
    },
    info: {
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    title: {
        fontWeight: '600',
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    categoryNameText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    cartButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    cartIconText: {
        fontSize: 16,
    },
    stepperContainer: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 8,
        height: 30,
    },
    stepperButton: {
        paddingHorizontal: 6,
    },
    stepperText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    quantityText: {
        marginHorizontal: 6,
        fontSize: 14,
        fontWeight: '500',
    },
});
