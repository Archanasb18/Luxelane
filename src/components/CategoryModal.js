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
                            onPress={() => onSelectCategory(item.id)}
                        >
                            <Text style={styles.categoryItemText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
                <Button title="Close" onPress={onClose} />
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
    },
    categoryItemText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default CategoryModal;