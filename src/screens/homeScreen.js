import React, { useEffect, useState, useCallback } from 'react';
import { View,FlatList, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, ActivityIndicator, RefreshControl} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchProductsByCategory } from '../redux/slices/productSlice';
import { formatPrice } from '../utils/formatPrice';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CategoryModal from '../components/CategoryModal';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 20;

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { allProducts, categories, error: productsError } = useSelector((state) => state.product);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

    const toggleModal = useCallback(() => {
        setModalVisible(prev => !prev);
    }, []);


    useEffect(() => {
        dispatch(fetchProductsByCategory({ categoryId: null, callback: () => { }, successCallback: (response) => { } }));
    }, [dispatch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        setIsLoading(true);
        const params = {
            categorySlug: selectedCategoryName?.toLowerCase(),
            title: debouncedSearchQuery
        };

        dispatch(fetchProducts({
            params,
            callback: () => { },
            successCallback: () => setIsLoading(false)
        }));
        dispatch(fetchProductsByCategory({ categoryId: null }));
    }, [dispatch, selectedCategoryName, debouncedSearchQuery]);

    const onRefresh = async () => {
        setRefreshing(true);
        setSelectedCategoryName('')
        setSearchQuery('');
        dispatch(fetchProducts({ categorySlug: '', callback: () => { }, successCallback: () => { setRefreshing(false); } }));
    };
    useEffect(() => {
        if (searchQuery === '') {
            setFilteredProducts(allProducts);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = allProducts.filter(product =>
                product.title.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, allProducts]);

    useEffect(() => {
        navigation.setOptions({
            header: () => (
                <View style={styles.headerContainer}>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>LUXELANE</Text>
                    </View>
                   
                </View>
            ),
            headerShown: true,
        });
    }, [navigation]);

    const handleProductPress = (product) => {
        navigation.navigate('Detail', { product :product});
    };

    const handleAddToCart = (product) => {
        // console.log('Add to cart:', product.title);
    };

    const handleSelectCategory = useCallback((categoryName) => {
        setSearchQuery('');
        setSelectedCategoryName(categoryName === 'All Categories' ? '' : categoryName);
        toggleModal();
    }, [toggleModal]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleProductPress(item)}
        >
            <Image
                source={{ uri: item.images[0] }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.price}>{formatPrice(item.price)}</Text>
                <Text style={styles.categoryNameText}>{item.category?.name || 'N/A'}</Text>
            </View>
            <TouchableOpacity
                style={styles.cartButton}
                onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                }}
            >
                <Text style={styles.cartIconText}>🛒</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderEmptyListComponent = () => (
        <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
                {searchQuery
                    ? 'No products found matching your search.'
                    : selectedCategoryName !== ''
                        ? 'No products found in this category.'
                        : 'Loading....'
                }
            </Text>
        </View>
    );

    const showLoading = isLoading;
    return (
        <View style={styles.container}>
            <View style={{flexDirection:'row',justifyContent:'space-between',width:'95%',alignSelf:'center'}}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#888"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton} 
                    >
                        <AntDesign name="closecircle" size={16} color="#888" />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity
                style={{height:40,width:40,backgroundColor:'#E6E6E6',borderRadius:20,justifyContent:'center',alignItems:'center',marginTop:10}}
                onPress={(e) => {
                    e.stopPropagation();
                    handleAddToCart(item);
                }}
            >
                <Text style={styles.cartIconText}>🛒</Text>
            </TouchableOpacity>
            </View>
            {showLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#ea4c89" />
                </View>
            ) : productsError ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error loading products: {productsError}</Text>
                </View>
            ) : (

                <FlatList
                    data={filteredProducts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContentContainer}
                    columnWrapperStyle={
                        filteredProducts.length === 1
                            ? { justifyContent: 'flex-end' }
                            : { justifyContent: 'space-between', marginBottom: 15, marginHorizontal: 5 }
                    }
                    ListEmptyComponent={renderEmptyListComponent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />

            )}

            {isModalVisible &&
                <CategoryModal
                    isVisible={isModalVisible}
                    onClose={toggleModal}
                    categories={categories}
                    onSelectCategory={handleSelectCategory}
                    selectedCategoryName={selectedCategoryName}
                />
            }

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
        // marginHorizontal: 10, 
        marginTop: 10,
        marginBottom: 5, 
        position: 'relative', 
    },
    headerContainer: {
        flexDirection: 'row',
        width: width,
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
        paddingHorizontal: 5,
        paddingVertical: 15,
        paddingBottom: 100,
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
