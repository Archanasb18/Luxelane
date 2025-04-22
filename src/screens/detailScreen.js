import React, { useEffect, useState, useRef, useCallback } from 'react'; // Added useRef, useCallback
import { View, Text, StyleSheet, Image, FlatList, ScrollView, } from 'react-native';
import { formatPrice } from '../utils/formatPrice';
import { getAllProducts } from '../services/api';
import { PageHeader } from '../components/commonComponents';
import { colors, screenHeight, screenWidth } from '../styles/globalStyles';
import RelatedCard from '../components/RelatedCard';

const DetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [related, setRelated] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRelated = async () => {
      const allProducts = await getAllProducts();
      const filtered = allProducts.filter(
        (p) => p.id !== product.id && p.category.id === product.category.id
      );
      setRelated(filtered);
    };

    fetchRelated();
  }, [product]);

  useEffect(() => {
    navigation.setOptions({
      header: () => (
        <PageHeader title={product?.category?.name ?? ''} onBackPress={() => { navigation.goBack() }} />
      ),
      headerShown: true,
    });
  }, [navigation]);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0); // Update index based on viewable item
    }
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <FlatList
          data={product.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderImage}
          keyExtractor={(_, index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />

        {product.images.length > 1 && (
          <View style={styles.paginationContainer}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex ? styles.paginationDotActive : null,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        {related.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedHeading}>Related Products</Text>
            <FlatList
              horizontal
              data={related}
              renderItem={({ item }) => (
                <RelatedCard
                  item={item}
                  onPress={() => navigation.push('Detail', { product: item })}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  carouselContainer: {
    height: screenHeight * 0.35,
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.35,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightText || '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary || '#ea4c89',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    color: 'green',
    marginVertical: 8,
  },
  category: {
    fontStyle: 'italic',
    color: '#555',
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  relatedSection: {
    marginTop: 20,
  },
  relatedHeading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
});

export default DetailScreen;
