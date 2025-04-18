import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { formatPrice } from '../utils/formatPrice';
import { getAllProducts } from '../services/api';

const { width } = Dimensions.get('window');

const DetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [related, setRelated] = useState([]);

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

  const renderImage = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  const renderRelated = ({ item }) => (
    <TouchableOpacity
      style={styles.relatedCard}
      onPress={() => navigation.push('Detail', { product: item })}
    >
      <Image source={{ uri: item.images[0] }} style={styles.relatedImage} />
      <Text style={styles.relatedTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={product.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderImage}
        keyExtractor={(_, index) => index.toString()}
      />

      <View style={styles.content}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.category}>{product.category.name}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {related.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedHeading}>Related Products</Text>
            <FlatList
              horizontal
              data={related}
              renderItem={renderRelated}
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
  image: {
    width: width,
    height: 300,
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
  relatedCard: {
    marginRight: 10,
    width: 120,
    alignItems: 'center',
  },
  relatedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  relatedTitle: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DetailScreen;
