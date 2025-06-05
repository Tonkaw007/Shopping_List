import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemCard from '../components/ItemCard';
import TotalSummary from '../components/TotalSummary';
import { useNavigation } from '@react-navigation/native';

const ListScreen = () => {
    const [items, setItems] = useState([]);
    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [editingItemId, setEditingItemId] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
  
    const navigation = useNavigation();
  
    useEffect(() => {
      loadItems();
    }, []);
  
    useEffect(() => {
      saveItems();
    }, [items]);
  
    const loadItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem('shoppingItems');
        if (storedItems) setItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('Failed to load items', error);
      }
    };
  
    const saveItems = async () => {
      try {
        await AsyncStorage.setItem('shoppingItems', JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save items', error);
      }
    };
  
    const addItem = () => {
      if (!itemName.trim() || isNaN(itemPrice) || Number(itemPrice) <= 0) return;
  
      const newItem = {
        id: Date.now().toString(),
        name: itemName,
        price: Number(itemPrice),
        bought: false,
        category: categoryName.trim() || 'ไม่มีหมวดหมู่',
      };
      setItems(prevItems => [...prevItems, newItem]);
  
      setItemName('');
      setItemPrice('');
      setCategoryName('');
    };
  
    const toggleBought = (id) => {
      setItems(items.map(item => item.id === id ? { ...item, bought: !item.bought } : item));
    };
  
    const removeItem = (id) => {
      setItems(items.filter(item => item.id !== id));
    };
  
    const clearAll = () => {
      setItems([]);
    };
  
    const handleEditItem = (item) => {
      setEditingItemId(item.id);
      setItemName(item.name);
      setItemPrice(item.price.toString());
      setCategoryName(item.category);
    };
  
    const updateItem = () => {
      if (!itemName.trim() || isNaN(itemPrice) || Number(itemPrice) <= 0) return;
  
      setItems(items.map(item =>
        item.id === editingItemId
          ? { ...item, name: itemName, price: Number(itemPrice), category: categoryName.trim() || 'ไม่มีหมวดหมู่' }
          : item
      ));
  
      setEditingItemId(null);
      setItemName('');
      setItemPrice('');
      setCategoryName('');
    };
  
    const totalRemaining = items.filter(item => !item.bought).reduce((sum, item) => sum + item.price, 0);
  
    const groupedItems = items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  
    const toggleDarkMode = () => {
      setDarkMode(previousState => !previousState);
    };
  
    return (
      <View style={[styles.container, darkMode && styles.darkContainer]}>
        <View style={styles.headerContainer}>

          <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeSwitch}>
            <Text style={[styles.darkModeText, darkMode && styles.darkText]}>🌙</Text>
          </TouchableOpacity>

          <Text style={[styles.header, darkMode && styles.darkText]}>My Shop</Text>
        </View>
  
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, darkMode && styles.darkInput]}
            placeholder="ชื่อสินค้า"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput
            style={[styles.input, darkMode && styles.darkInput]}
            placeholder="ราคา"
            keyboardType="numeric"
            value={itemPrice}
            onChangeText={setItemPrice}
          />
          <TextInput
            style={[styles.input, darkMode && styles.darkInput]}
            placeholder="หมวดหมู่สินค้า"
            value={categoryName}
            onChangeText={setCategoryName}
          />
          {editingItemId ? (
            <TouchableOpacity style={styles.addButton} onPress={updateItem}>
              <Text style={styles.addButtonText}>บันทึก</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={addItem}>
              <Text style={styles.addButtonText}>เพิ่ม</Text>
            </TouchableOpacity>
          )}
        </View>
  
        {items.length > 0 && <Text style={[styles.listHeader, darkMode && styles.darkText]}>รายการสินค้าทั้งหมด</Text>}

        <FlatList
          data={Object.keys(groupedItems)}
          keyExtractor={category => category}
          renderItem={({ item: category }) => (
            <View style={styles.categoryContainer}>
              <Text style={[styles.categoryHeader, darkMode && styles.darkCategoryHeader]}>
                {category}
              </Text>
              <FlatList
                data={groupedItems[category]}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <ItemCard
                    item={item}
                    onToggle={() => toggleBought(item.id)}
                    onDelete={() => removeItem(item.id)}
                    onEdit={handleEditItem}
                    textStyle={darkMode ? styles.darkText : {}}
                  />
                )}
              />
            </View>
          )}
        />
  
        <View style={styles.bottomContainer}>
          <TotalSummary total={totalRemaining} />
          <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    darkContainer: {
      backgroundColor: '#333', 
    },
    darkText: {
      fontSize: 23, 
      color: '#FFF',
    },
    darkInput: {
      backgroundColor: '#444',
      borderColor: '#666',
      color: '#FFF',
    },
    darkModeSwitch: {
      marginRight: 10,
    },
    darkModeText: {
      fontSize: 24,
      color: '#FFF',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    header: {
      flex: 1,
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    listHeader: {
      fontSize: 23,
      fontWeight: 'bold',
      textAlign: 'left',
      marginBottom: 10,
      marginTop: 20,
      color: 'black',
    },
    darkListHeader: {
      color: 'white',
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      padding: 10,
      marginRight: 5,
      borderRadius: 5,
      fontSize: 15,
      marginHorizontal: 5,
      textAlignVertical: 'center',
      width: '100%',
    },
    addButton: {
      backgroundColor: '#CC66FF',
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    categoryContainer: {
      marginBottom: 20,
    },
    categoryHeader: {
      fontSize: 20,
      color: '#9900FF',
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
    },
    darkCategoryHeader: {
      color: 'white',
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FFFFE0',
      padding: 13,
      borderRadius: 10,
      marginTop: 5,
      marginHorizontal: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },
    clearButton: {
      backgroundColor: '#FF5733',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 25,
    },
    clearButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
    },
  });
  
  export default ListScreen;
  