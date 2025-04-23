import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux';
import { sortProductsByPrice } from '../redux/slices/productSlice';

const SortModal = ({ isVisible, onClose }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isVisible) {
      setSelectedSort(''); 
    }
  }, [isVisible]);

  const applySort = (order) => {
    dispatch(sortProductsByPrice(order));
    onClose();
  };
  
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Sort By Price</Text>
        <TouchableOpacity onPress={() => applySort('asc')}>
          <Text style={[styles.option]}>
            Low to High
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => applySort('desc')}>
          <Text style={[styles.option]}>
            High to Low
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.optionCancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  modalContent: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  option: { fontSize: 16, paddingVertical: 10, color: '#333' },
  selected: { fontWeight: 'bold', color: '#007bff' },
  optionCancel: { fontSize: 16, paddingVertical: 10, color: 'red' },
});

export default SortModal;
