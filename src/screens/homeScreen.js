import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, TextInput, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchProductsByCategory, setMinPrice, setMaxPrice, setSortOrder } from '../redux/slices/productSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import SortModal from '../components/sortModal';
import CategoryModal from '../components/CategoryModal';
import ArticleCard from '../components/ArticleCard';
import { ErrorScreen, LoadingScreen } from '../components/commonComponents';
import { screenWidth } from '../styles/globalStyles';

const cardWidth = screenWidth / 2 - 20;

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { allProducts, categories, error: productsError, minPrice, maxPrice } = useSelector((state) => state.product);
    const [selectedCategorySlug, setSelectedCategorySlug] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const sortOrder = useSelector(state => state.product.sortOrder);
    const cartItems = useSelector(state => state.product.cartItems);
    const toggleModal = useCallback(() => setModalVisible(prev => !prev), []);

    useEffect(() => {
        dispatch(fetchProductsByCategory({ categoryId: null }));
    }, [dispatch]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        setIsLoading(true);
        const params = {
            ...(selectedCategorySlug && { categorySlug: selectedCategorySlug }),
            title: debouncedSearchQuery,
            ...(minPrice && { price_min: minPrice }),
            ...(maxPrice && { price_max: maxPrice }),
            ...(sortOrder && { sort: sortOrder }), // 🟢 include sort param
        };
        dispatch(fetchProducts({
            params,
            callback: () => setIsLoading(true),
            successCallback: () => setIsLoading(false)
        }));
    }, [dispatch, selectedCategorySlug, debouncedSearchQuery, minPrice, maxPrice, sortOrder]);


    const filteredProducts = React.useMemo(() => {
        if (!searchQuery) return allProducts;
        const lower = searchQuery.toLowerCase();
        return allProducts.filter(product => product.title.toLowerCase().includes(lower));
    }, [searchQuery, allProducts]);

    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <View style={styles.headerContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>LUXELANE</Text>
                    </View>

                    <TouchableOpacity style={{ width: '20%', alignItems: 'flex-end' }} onPress={e => { e.stopPropagation(); navigation.navigate('Cart'); }}>
                        <Text style={styles.cartIconText}>🛒</Text>
                    </TouchableOpacity>
                </View>
            ),
            headerShown: true,
        });
    }, [navigation]);

    const handleProductPress = useCallback(product => {
        navigation.navigate('Detail', { product });
    }, [navigation]);

    const handleSelectCategory = useCallback((categorySlug) => {
        setSearchQuery('');
        setSelectedCategorySlug(categorySlug === 'All Categories' ? '' : categorySlug);
        toggleModal();
    }, [toggleModal]);

    const handleAddToCart = useCallback(product => {
        dispatch(addToCart(product));
    }, [dispatch]);

    const handleIncrement = useCallback(productId => {
        dispatch(incrementQuantity(productId));
    }, [dispatch]);

    const handleDecrement = useCallback(productId => {
        dispatch(decrementQuantity(productId));
    }, [dispatch]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setSelectedCategorySlug('');
        setSearchQuery('');
        dispatch(fetchProducts({ categorySlug: '', callback: () => { }, successCallback: () => setRefreshing(false) }));
    }, [dispatch]);
    const handleSort = (order) => {
        dispatch(sortProductsByPrice(order));
        setSortModalVisible(false);
    };
    const renderEmptyListComponent = useCallback(() => (
        <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
                {searchQuery
                    ? 'No products found matching your search.'
                    : selectedCategorySlug !== ''
                        ? 'No products found in this category.'
                        : 'Loading....'
                }
            </Text>
        </View>
    ), [searchQuery, selectedCategorySlug]);

    const handleApplyFilters = useCallback(({ categoryId, minPrice, maxPrice }) => {
        const params = {
            ...(categoryId && { categorySlug: categoryId }),
            ...(minPrice && { price_min: minPrice }),
            ...(maxPrice && { price_max: maxPrice }),
        };
        dispatch(fetchProducts({ params, callback: () => setIsLoading(true), successCallback: () => setIsLoading(false), }));
    }, [dispatch]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignSelf: 'center' }}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#888"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                            <AntDesign name="closecircle" size={16} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={() => { setSortModalVisible(true) }} style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                    <MIcon name="sort" size={32} color="#888" />
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <LoadingScreen />
            ) : productsError ? (
                <ErrorScreen productsError={productsError} />
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={({ item }) => (
                        <ArticleCard
                            item={item}
                            handleAddToCart={handleAddToCart}
                            handleProductPress={handleProductPress}
                            handleIncrement={handleIncrement}
                            handleDecrement={handleDecrement}
                            cartItems={cartItems}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContentContainer}
                    columnWrapperStyle={filteredProducts.length === 1
                        ? { justifyContent: 'flex-start' }
                        : { justifyContent: 'space-between', marginBottom: 15, marginHorizontal: 5 }}
                    ListEmptyComponent={renderEmptyListComponent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
            {isModalVisible && (
                <CategoryModal
                    isVisible={isModalVisible}
                    onClose={toggleModal}
                    categories={categories}
                    onSelectCategory={handleSelectCategory}
                    selectedCategorySlug={selectedCategorySlug}
                    setMinPrice={value => dispatch(setMinPrice(value))}
                    setMaxPrice={value => dispatch(setMaxPrice(value))}
                    onApplyFilters={handleApplyFilters}
                />
            )}
            {sortModalVisible && <SortModal
                isVisible={sortModalVisible}
                onClose={() => setSortModalVisible(false)}
                handleSort={handleSort}
            />}
            <TouchableOpacity onPress={toggleModal} style={styles.categoriesButton}>
                <AntDesign name="filter" size={24} color="#636363" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    searchContainer: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5,
        position: 'relative',
    },
    headerContainer: {
        flexDirection: 'row',
        width: screenWidth,
        backgroundColor: '#E6E6E6',
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitleContainer: {
        marginRight: 10,
    },
    headerTitle: {
        fontWeight: '700',
        fontSize: 18,
        color: '#ea4c89',
        flexShrink: 1,
    },
    searchBar: {
        flex: 1,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingLeft: 15,
        paddingRight: 35,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: 0,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    categoriesButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        borderWidth: 1,
        width: 60,
        height: 60,
        borderRadius: 30,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#AEAEAE',
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    listContentContainer: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    card: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        overflow: 'hidden',
        position: 'relative',
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
    categoryNameText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
    },
    emptyListText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },

});

export default HomeScreen;
