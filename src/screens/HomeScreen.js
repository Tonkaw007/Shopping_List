import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const HomeScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [darkMode, setDarkMode] = useState(false);  

    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
          loadItems();
        }, [])
    );
      

    const loadItems = async () => {
        try {
            const storedItems = await AsyncStorage.getItem('shoppingItems');
            if (storedItems) setItems(JSON.parse(storedItems));
        } catch (error) {
            console.error('Failed to load items', error);
        }
    };

    const filteredItems = items
        .filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) && !item.bought
        );

    const goToListItemsScreen = () => {
        navigation.navigate('List items');
    };

    const toggleDarkMode = () => {
        setDarkMode(previousState => !previousState);
    };

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>
            <View style={[styles.Background, darkMode && styles.darkBackground]}>
                <View style={styles.headerContainer}>

                    <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeSwitch}>
                        <Text style={[styles.darkModeText, darkMode && styles.darkText]}>🌙</Text>
                    </TouchableOpacity>

                    <Text style={[styles.header, darkMode && styles.darkText]}>All List</Text>

                    <TouchableOpacity onPress={goToListItemsScreen} style={styles.addListButton}>
                        <Text style={styles.addListButtonText}>➕︎ Add List</Text>
                    </TouchableOpacity>
                </View>

                <TextInput
                    style={[styles.searchInput, darkMode && styles.darkInput]}
                    placeholder="🔍 ค้นหาสินค้า..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                />
            </View>

            {filteredItems.length > 0 && <Text style={[styles.listHeader, darkMode && styles.darkText]}>รายการสินค้าทั้งหมด</Text>}

            <FlatList
                data={filteredItems}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.itemContainer, darkMode && styles.darkItemContainer]}>
                        <Text style={[styles.categoryText, darkMode && styles.darkText]}>{item.category}</Text>
                        <View style={styles.itemRow}>
                            <Text style={[styles.itemText, darkMode && styles.darkText]}>{item.name}</Text>
                            <Text style={[styles.priceText, darkMode && styles.darkText]}>฿{item.price.toFixed(2)}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    darkContainer: {
        backgroundColor: '#333', 
    },
    Background: {
        backgroundColor: '#CC99FF', 
        paddingVertical: 20,
        paddingHorizontal: 0,
        width: '100%',
    },
    darkBackground: {
        backgroundColor: '#444', 
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center', 
        flex: 1, 
    },
    darkText: {
        color: '#FFF',
    },
    listHeader: {
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 10,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    addListButton: {
        backgroundColor: '#CC66FF',
        padding: 10,
        borderRadius: 5,
    },
    addListButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 18,
        borderColor: '#e0e0e0',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
    },
    darkInput: {
        backgroundColor: '#555',
        borderColor: '#666',
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 20,
    },
    darkItemContainer: {
        backgroundColor: '#555', 
    },
    categoryText: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#9900FF',
        marginBottom: 5,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 18,
        fontWeight: 'bold' 
    },
    priceText: {
        fontSize: 16,
    },
    darkModeSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    darkModeText: {
        fontSize: 24,
        color: '#FFF',
        marginRight: 10,
    },
});

export default HomeScreen;

