import { View, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const CircleAvatar = ({ width, height, url } : any) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={{ uri: url }}
        style={styles.image}
      />
    </View>
  );
}

CircleAvatar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100, // Large enough to ensure the view is fully rounded
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
  }
});

export default CircleAvatar;
