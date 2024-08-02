import React, { useRef } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  TouchableOpacity,
  Dimensions,
  LogBox,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import { getFeatureViewAnimation } from './utils/utils';
import ColorServices from './../../../services/color-services';
import Carousel from 'react-native-snap-carousel';
import VideoReelComponents from '../../../components/video-reel/video-reel';
import Post from '../../../components/posts/post';
import PostListComponent from '../../../components/post-list-component/post-list-component';
import CircleAvatar from './../../../components/circle-avatar/circle-avatar';
import AuthServices from '../../../services/auth-services';


const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const UPPER_HEADER_HEIGHT = 82;
const UPPER_HEADER_PADDING_TOP = 4;
const LOWER_HEADER_HEIGHT = 96;
const width = Dimensions.get('window').width;

const Home = ({ navigation }: any) => {
  LogBox.ignoreLogs([
    'react-native-snap-carousel: It is recommended to use at least version 0.44 of React Native with the plugin',
  ]);
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const lastOffsetY = useRef(0);
  const scrollDirection = useRef('');
  const userLogged = AuthServices.getInstance().GetUserLogged();


  const feature1 = getFeatureViewAnimation(animatedValue, 36);
  const feature2 = getFeatureViewAnimation(animatedValue, -16);
  const feature3 = getFeatureViewAnimation(animatedValue, -56);
  const feature4 = getFeatureViewAnimation(animatedValue, -92);

  const featureIconCircleAnimation = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 25],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };
  const featureNameAnimation = {
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 30],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 30],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };
  const featureIconAnimation = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    }),
  };

  const textInputAnimation = {
    transform: [
      {
        scaleX: animatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [1, 0],
          extrapolate: 'clamp',
        }),
      },
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 25],
          outputRange: [0, -100],
          extrapolate: 'clamp',
        }),
      },
    ],
    opacity: animatedValue.interpolate({
      inputRange: [0, 25],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    }),
  };








  const carouselItems = [
    {
      image: require('../../../../assets/images/slides/slide1.png'),
      title: 'Slide 1',
    },
    {
      image: require('../../../../assets/images/slides/slide2.png'),
      title: 'Slide 2',
    },
    // {
    //   image: require('../../../../assets/images/slides/slide3.png'),
    //   title: 'Slide 3',
    // },
    // Add more items as needed
  ];



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* <SafeAreaView>
        <View style={styles.upperHeaderPlaceholder} />
      </SafeAreaView>

      <SafeAreaView style={styles.header}>
        <View style={styles.upperHeader}>
          <View style={styles.searchContainer}>

            <Image
              source={require('../../../../assets/icons/ic_search_white.png')}
              style={[styles.icon20, { marginLeft: 8 }]}
            />

            <AnimatedTextInput
              placeholder="Tìm kiếm"
              placeholderTextColor="rgba(255, 255, 255, 0.8)"
              style={[styles.searchInput, textInputAnimation]}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Image
              source={require('../../../../assets/icons/ic_ring_outline.png')}
              style={styles.bell}
            />
            <Image style={styles.userImage} source={{ uri: 'https://www.shareicon.net/data/512x512/2016/09/15/829472_man_512x512.png' }} />
          </View>

         
        </View>

        <View style={[styles.lowerHeader]}>
          <View >
            <Animated.View style={[styles.feature, feature1]}>
              <Animated.Image
                source={require('../../../../assets/icons/ic_gia_tien_rac_white.png')}
                style={[styles.featureIcon, featureIconAnimation]}
              />
              <Animated.Image
                source={require('../../../../assets/icons/ic_gia_tien_rac_shape.png')}
                style={[styles.icon32, featureIconCircleAnimation]}
              />
              <Animated.Text style={[styles.featureName, featureNameAnimation]}>
                Giá tiền rác
              </Animated.Text>
            </Animated.View>
          </View>

          <View >
            <Animated.View style={[styles.feature, feature2]}>
              <Animated.Image
                source={require('../../../../assets/icons/ic_cach_bo_rac_white.png')}
                style={[styles.featureIcon, featureIconAnimation]}
              />
              <Animated.Image
                source={require('../../../../assets/icons/ic_cach_bo_rac_shape.png')}
                style={[styles.icon32, featureIconCircleAnimation]}
              />
              <Animated.Text style={[styles.featureName, featureNameAnimation]}>
                Cách bỏ rác
              </Animated.Text>
            </Animated.View>
          </View>

          <View >
            <Animated.View style={[styles.feature, feature3]}>
              <Animated.Image
                source={require('../../../../assets/icons/ic_gui_khieu_nai_white.png')}
                style={[styles.featureIcon, featureIconAnimation]}
              />
              <Animated.Image
                source={require('../../../../assets/icons/ic_gui_khieu_nai_shape.png')}
                style={[styles.icon32, featureIconCircleAnimation]}
              />
              <Animated.Text style={[styles.featureName, featureNameAnimation]}>
                Gửi khiếu nại
              </Animated.Text>
            </Animated.View>
          </View>

          <View >

            <Animated.View style={[styles.feature, feature4]}>
              <Animated.Image
                source={require('../../../../assets/icons/ic_tin_tuc_white.png')}
                style={[styles.featureIcon, featureIconAnimation]}
              />
              <Animated.Image
                source={require('../../../../assets/icons/ic_tin_tuc_shape.png')}
                style={[styles.icon32, featureIconCircleAnimation]}
              />
              <Animated.Text style={[styles.featureName, featureNameAnimation]}>
                Tin tức
              </Animated.Text>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView> */}





      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={e => {
          const offsetY = e.nativeEvent.contentOffset.y;
          scrollDirection.current =
            offsetY - lastOffsetY.current > 0 ? 'down' : 'up';
          lastOffsetY.current = offsetY;
          animatedValue.setValue(offsetY);
        }}
        onScrollEndDrag={() => {

        }}
        scrollEventThrottle={16}>
        <View style={styles.spaceForHeader} />
        <View style={styles.scrollViewContent}>
        <View style={styles.appBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm..."
      />
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={require('../../../../assets/icons/ic_ring_outline.png')}
            style={styles.bell}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarButton}>
          <CircleAvatar
            width={40}
            height={40}
            url={userLogged ? userLogged.photoUrl : 'https://i0.wp.com/sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png?ssl=1'}
          />
        </TouchableOpacity>
      </View>
    </View>
          <View style={styles.contentContainer}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 20, color: ColorServices.primaryColor }}>Nhật ký xanh</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableWithoutFeedback onPress={() => { }}>
                  <Image style={{ width: 30, height: 30 }} source={require('../../../../assets/icons/ic_sort.png')} />
                </TouchableWithoutFeedback>
                <View style={{ width: 10 }}></View>
                <TouchableWithoutFeedback onPress={() => { }}>
                  <Image style={{ width: 30, height: 30 }} source={require('../../../../assets/icons/ic_category_story.png')} />
                </TouchableWithoutFeedback>
              </View>
            </View>


            <VideoReelComponents navigation={navigation} />

            <View>
              {/* <Post navigation = {navigation}/>
            <Post navigation = {navigation}/>*/}
              <PostListComponent navigation={navigation} />


            </View>





          </View>



        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorServices.primaryColor,
  },
  contentContainer: {
    padding: 10
  },
  appBar: {
    height: 80,
    backgroundColor: ColorServices.primaryColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent : 'flex-start'
    // marginLeft: 10,
  },
  iconButton: {
    // marginRight: 15,
  },
  avatarButton: {
    width: 40,
    height: 40,
  },
  icon20: {
    width: 20,
    height: 20,
  },
  icon32: {
    width: 40,
    height: 40,
  },
  upperHeaderPlaceholder: {
    height: UPPER_HEADER_HEIGHT + UPPER_HEADER_PADDING_TOP,
    paddingBottom: UPPER_HEADER_PADDING_TOP,

    // backgroundColor : 'orange',
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 1
  },
  upperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: UPPER_HEADER_HEIGHT + UPPER_HEADER_PADDING_TOP,
    paddingTop: UPPER_HEADER_PADDING_TOP,

    // backgroundColor: 'green'
  },
  lowerHeader: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: UPPER_HEADER_HEIGHT + UPPER_HEADER_PADDING_TOP,
    // paddingBottom : 100,
    paddingHorizontal: 40,
  },
  searchContainer: {
    // flex: 1,
    justifyContent: 'center',

  },
  featureIcon: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -12,
  },
  bell: {
    width: 27,
    height: 27,
    marginHorizontal: 8,
  },


  searchInput: {
    // position: 'absolute',
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    borderRadius: 4,
    paddingVertical: 4,
    paddingLeft: 32,
  },
  feature: {
    alignItems: 'center',
  },
  featureName: {
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 14,
    color: '#FFFFFF',
    marginTop: 12,
  },
  spaceForHeader: {
    // height: LOWER_HEADER_HEIGHT + UPPER_HEADER_PADDING_TOP,
  },
  scrollViewContent: {
    // height: 2000,
    backgroundColor: 'white',
  },
  userImage: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 10
  },
  slides: { height: 200 }
});

export default Home;
