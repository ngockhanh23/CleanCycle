// CustomHeader.js
import React from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';

const CustomHeader = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ marginRight: 10 }}>
        <Image style={{ width: 40, height: 40, resizeMode: 'contain' }} source={require('../../../../assets/icons/ic_mua_ve_chai.png')} />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Tra cứu địa điểm phân loại rác"
        placeholderTextColor="#ececec"
      />
      <View style={styles.rightContent}>
        <View style={styles.rightContentItem}>
          <Image style={{ width: 25, height: 25, resizeMode: 'contain',  }} source={require('../../../../assets/icons/ic_kim_cuong.png')} />
          <Text style = {{color : '#023E8A'}}>0</Text>
        </View>

        <TouchableOpacity style={styles.rightContentItem}>
          <Image style={{ width: 25, height: 25, resizeMode: 'contain',  }} source={require('../../../../assets/icons/ic_co_bon_la.png')} />
          <Text style = {{color : '#00BF15'}}>0</Text>
        </TouchableOpacity>

        <View style={styles.rightContentItem}>
          <Image style={{ width: 25, height: 25, resizeMode: 'contain',  }} source={require('../../../../assets/icons/ic_xu.png')} />
          <Text style = {{color : '#F57F17'}}>0</Text>
        </View>

        <TouchableOpacity style={styles.rightContentItem}>
          <Image style={{ width: 35, height: 35, resizeMode: 'contain',  }} source={require('../../../../assets/icons/ic_ring_outline.png')} />
        
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10
    // backgroundColor: '#fff',
    // height: 60,
    // elevation: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#fff',
    paddingHorizontal: 15,
  },
  rightContent: {
    flexDirection: 'row',
    justifyContent : 'center',
    alignItems : 'center'
  },
  rightContentItem: {
    alignItems : 'center',
    marginHorizontal : 5
  }
});

export default CustomHeader;
