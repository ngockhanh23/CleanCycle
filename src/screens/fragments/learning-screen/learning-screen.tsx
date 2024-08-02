import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
// import Draggable from 'react-native-draggable';

const LearningScreen = ({ navigation }: any) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [optionsVisible, setOptionsVisible] = useState(false);

  const toggleOptions = () => {
    setOptionsVisible(!optionsVisible);
  };

  const handleOptionPress = (option: string) => {
    console.log('Option selected:', option);
    setOptionsVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Learning Screen</Text>
      </View>
      {/* <Draggable x={windowWidth - 70} y={windowHeight - 200} renderSize={50} renderColor='blue' isCircle onShortPressRelease={toggleOptions}>
        <View style={styles.fabButton}>
          <Text style={styles.fabText}>FAB</Text>
          {optionsVisible && (
            <View style={styles.optionsContainer}>
              <TouchableOpacity onPress={() => handleOptionPress('Option 1')}>
                <Text>Option 1</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionPress('Option 2')}>
                <Text>Option 2</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionPress('Option 3')}>
                <Text>Option 3</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Draggable> */}

    </View>
  );
};

const styles = StyleSheet.create({
  fabButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  optionsContainer: {
    width: 150, // Adjust the width as per your requirement
    position: 'absolute',
    height : 100,
    justifyContent : 'space-between',
    bottom: 30,
    right: 60,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
});

export default LearningScreen;
