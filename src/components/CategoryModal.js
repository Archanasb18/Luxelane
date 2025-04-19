import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Button,
    StyleSheet,
    Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

const CategoryModal = ({
    isVisible,
    onClose,
    categories,
    onSelectCategory,
    selectedCategoryName

}) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            style={styles.modal}
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Category</Text>
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
                            onPress={() => onSelectCategory(item.name)}
                        >
                            <Text style={[styles.categoryItemText, { fontWeight: item?.name === selectedCategoryName ? '700' : '300' }]}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
                <View style={{ marginTop: 16 }}>
                    <Button title="Close" onPress={onClose} />
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
        maxHeight: Dimensions.get('window').height * 0.6, // Limit modal height
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
        fontWeight: '300'
    },
});

export default CategoryModal;