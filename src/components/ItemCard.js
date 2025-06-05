import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ItemCard = ({ item, onToggle, onDelete, onEdit, isAddedRecently }) => {
  return (
      <View style={[styles.card, isAddedRecently && styles.newItem]}>
          <TouchableOpacity onPress={onToggle} style={[styles.checkbox, item.bought && styles.checked]}>
              {item.bought && <Text style={styles.checkmark}> ✔ </Text>}
          </TouchableOpacity>
          
          <Text style={[styles.itemText, item.bought && styles.strikethrough]}>{item.name}</Text>
          <Text style={[styles.priceText, item.bought && styles.strikethrough]}>฿{item.price.toFixed(2)}</Text>
          
          <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                  <Text style={styles.deleteText}> X </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onEdit(item)} style={styles.editButton}>
                  <Text style={styles.editText}>✏️</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
    card: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 10, 
      borderBottomWidth: 1, 
      borderColor: '#ccc' 
    },
    checkbox: { 
      width: 24, 
      height: 24, 
      borderWidth: 1, 
      borderRadius: 5, 
      justifyContent: 'center', 
      alignItems: 'center', 
      marginRight: 10 
    },
    checked: { 
      backgroundColor: '#00CC66' 
    },
    checkmark: { 
      color: 'white', 
      fontWeight: 'bold' 
    },
    itemText: { 
      flex: 1, 
      fontSize: 16 
    },
    priceText: { 
      fontSize: 16, 
      marginRight: 10 
    },
    strikethrough: { 
      textDecorationLine: 'line-through', 
      color: 'gray' 
    },
    actionsContainer: { 
      flexDirection: 'row', 
      alignItems: 'center' 
    },
    deleteButton: { 
      borderWidth: 2, 
      borderColor: 'red', 
      padding: 5, 
      borderRadius: 5, 
      backgroundColor: 'red' 
    },
    deleteText: { 
      color: 'white', 
      fontWeight: 'bold',
      fontSize: 15
    },
    editButton: {
      marginLeft: 10,
      padding: 5,
      borderRadius: 5,
    },
    editText: {
      fontWeight: 'bold',
      fontSize: 15,
      color: 'white',
    }
});

export default ItemCard;

