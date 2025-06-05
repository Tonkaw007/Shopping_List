import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TotalSummary = ({ total }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.totalText}>รวมราคาสินค้า: ฿{total.toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
      padding: 10, 
      marginTop: 10, 
    },
    totalText: { 
      fontSize: 20, 
      fontWeight: 'bold' 
    }
});

export default TotalSummary;


