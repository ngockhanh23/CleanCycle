import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AuthServices from '../../../services/auth-services';
import User from '../../../models/user';
import ColorServices from '../../../services/color-services';
import PostsListByUser from '../../../components/post-list-by-user/post-list-by-user';
import PostModel from '../../../models/post';
import ProfileUser from '../../../components/profile-user/profile-user';

const ProfileScreen = ({ navigation }: any) => {
  
  const userLogged = AuthServices.getInstance().GetUserLogged();


  useEffect(() => {
    // setUser(loggedInUser);
  }, []);

  const handleLogout = () => {
    AuthServices.getInstance().Logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.appBar}>
        <Image style={styles.iconAppbar} source={require('../../../../assets/icons/ic_user_white.png')} />
        <Text style={styles.appBarTitle}>{userLogged?.email}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Image style={styles.iconAppbar} source={require('../../../../assets/icons/ic_logout.png')} />
        </TouchableOpacity>
      </View>

      <ProfileUser navigation={navigation} userID= {userLogged!.id}/>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    height: 65,
    backgroundColor: ColorServices.primaryColor,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row'
  },
  appBarTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center'
  },
  iconAppbar: {
    width: 30,
    height: 30,
    resizeMode: 'contain'
  },
  textInfor: {
    fontSize: 20,
  },
  tabBarView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: ColorServices.primaryColor,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
