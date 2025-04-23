import React,{useEffect} from 'react';
import {View,Text,FlatList,TouchableOpacity,Image,StyleSheet,SafeAreaView,} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {incrementQuantity,decrementQuantity,removeFromCart,} from '../redux/slices/productSlice';
import { formatPrice } from '../utils/formatPrice';
import { PageHeader } from '../components/commonComponents';

const CartScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.product.cartItems);

    const cartArray = React.useMemo(() => Object.values(cartItems), [cartItems]);
    const total = React.useMemo(
        () => cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cartArray]
    );

    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <PageHeader title="Cart" onBackPress={navigation.goBack} />
            ),
            headerShown: true,
        });
    }, [navigation]);

    const handleDecrement = React.useCallback(
        id => dispatch(decrementQuantity(id)),
        [dispatch]
    );
    const handleIncrement = React.useCallback(
        id => dispatch(incrementQuantity(id)),
        [dispatch]
    );
    const handleRemove = React.useCallback(
        id => dispatch(removeFromCart(id)),
        [dispatch]
    );

    const renderItem = React.useCallback(
        ({ item }) => (
            <View style={styles.card}>
                <Image source={{ uri: item.images[0] }} style={styles.image} />
                <View style={styles.details}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    <View style={styles.stepperRow}>
                        <TouchableOpacity
                            onPress={() => handleDecrement(item.id)}
                            style={styles.stepperButton}
                        >
                            <Text style={styles.stepperText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <TouchableOpacity
                            onPress={() => handleIncrement(item.id)}
                            style={styles.stepperButton}
                        >
                            <Text style={styles.stepperText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => handleRemove(item.id)}
                    style={styles.removeBtn}
                >
                    <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
            </View>
        ),
        [handleDecrement, handleIncrement, handleRemove]
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={cartArray}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>Your cart is empty.</Text>
                    </View>
                }
            />
            {cartArray.length > 0 && (
                <View style={styles.footer}>
                    <Text style={styles.totalText}>Subtotal: {formatPrice(total)}</Text>
                    <TouchableOpacity style={styles.checkoutButton}>
                        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

export default CartScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 12,
        padding: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 10,
    },
    details: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
        marginVertical: 5,
    },
    stepperRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    stepperButton: {
        backgroundColor: '#eee',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    stepperText: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
    quantity: {
        marginHorizontal: 10,
        fontSize: 14,
    },
    removeBtn: {
        padding: 6,
    },
    removeText: {
        fontSize: 18,
        color: '#ea4c89',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    checkoutButton: {
        backgroundColor: '#ea4c89',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    empty: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});
