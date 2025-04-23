import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Dimensions, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { setMinPrice, setMaxPrice } from '../redux/slices/productSlice';
import { screenHeight } from '../styles/globalStyles';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CategoryModal = ({ isVisible, onClose, categories, onSelectCategory, selectedCategoryId, onApplyFilters, selectedCategorySlug }) => {
    const dispatch = useDispatch();
    const { minPrice: reduxMinPrice, maxPrice: reduxMaxPrice } = useSelector((state) => state.product);

    const [minPrice, setMinPriceLocal] = useState(reduxMinPrice);
    const [maxPrice, setMaxPriceLocal] = useState(reduxMaxPrice);

    const handleMinPriceChange = (value) => {
        setMinPriceLocal(value);
        dispatch(setMinPrice(value));
    };

    const handleMaxPriceChange = (value) => {
        setMaxPriceLocal(value);
        dispatch(setMaxPrice(value));
    };

    const handleApplyFilters = () => {
        onApplyFilters({
            categoryId: selectedCategoryId,
            minPrice,
            maxPrice,
        });
        onClose();
    };

    const handleClearPrices = () => {
        setMinPriceLocal('');
        setMaxPriceLocal('');
        dispatch(setMinPrice(''));
        dispatch(setMaxPrice(''));
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.modalTitle}>Select Category</Text>
                    <TouchableOpacity onPress={onClose} style={{ width: '20%', alignItems: 'center' }}>
                        <AntDesign name="close" size={24} color="#888" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => onSelectCategory(null)}
                >
                    <Text style={styles.categoryItemText}>All Categories</Text>
                </TouchableOpacity>

                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.categoryItem}
                            onPress={() => onSelectCategory(item.slug)}
                        >
                            <Text style={[styles.categoryItemText, { fontWeight: item?.slug === selectedCategorySlug ? '700' : '300' }]}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    showsVerticalScrollIndicator={true}
                />

                <Text style={styles.priceLabel}>Price Range</Text>
                <View style={styles.priceInputContainer}>
                    <TextInput
                        style={styles.priceInput}
                        placeholder="Min Price"
                        value={minPrice}
                        onChangeText={handleMinPriceChange}
                        keyboardType="numeric"
                    />
                    <Text style={styles.toText}>to</Text>
                    <TextInput
                        style={styles.priceInput}
                        placeholder="Max Price"
                        value={maxPrice}
                        onChangeText={handleMaxPriceChange}
                        keyboardType="numeric"
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                    <View style={{ width: '48%' }}>
                        <Button title="Clear Price Range" onPress={handleClearPrices} color={'#AEAEAE'} />
                    </View>
                    <View style={{ width: '48%' }}>
                        <Button title="Apply Filters" onPress={handleApplyFilters} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        maxHeight: screenHeight * 0.6,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    categoryItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
    },
    categoryItemText: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '300',
    },
    priceLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 10,
        marginBottom: 5,
    },
    priceInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    priceInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        width: '45%',
        fontSize: 14,
    },
    toText: {
        fontSize: 16,
        alignSelf: 'center',
        marginHorizontal: 10,
    },
});

export default CategoryModal;
