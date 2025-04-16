import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';


const { width,height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  const titles = [
    "Become Your Best\nSelf",
    "Personalized\nLearning",
    "Summarized Insights.\nMaximum Impact.",
  ];

  const subtitles = [
    "Your personal growth journey starts here. Better helps you learn, grow and improve with summarized insights from the leading self-development Youtube videos.",
    "Tell us your goals and we’ll recommend the best content for you. Whether you want to improve your health, learn about entrepreneurship or accelerate your career, we’ve got you covered.",
    "No time for long videos or books? No problem. Better breaks down key takeaways into short, text and audio summaries so you can learn and grow faster.",
  ];

  const handleNext = () => {
    if (index < titles.length - 1) {
      setIndex(index + 1);
    } else {
      navigation.navigate('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Image source={require('../Images/logo1.png')} style={styles.logo} />
      </View>

      {/* Carousel Text */}
      <View style={styles.carouselContainer}>
        <Swiper
          loop={false}
          showsPagination={true}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          onIndexChanged={(i) => setIndex(i)}
          index={index}
        >
          {titles.map((title, i) => (
            <View key={i} style={styles.slide}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitles[i]}</Text>
            </View>
          ))}
        </Swiper>

        {/* Fixed Buttons Below Text */}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {index === 0 ? 'Get started →' : 'Continue'}
          </Text>
        </TouchableOpacity>

        {index !== 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#6ca9ee',
    width: width * 1.5,
    height: height * 0.45,
    borderBottomRightRadius: 300,
    borderBottomLeftRadius: 300,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    position: 'absolute',
    top: 0,
    left: -(width * 0.25),
    zIndex: 1,
  },
  logo: {
    position: 'absolute',
    top: 83,    // Y position
    left: 245,  
    width: 85,
    height: 25,
    resizeMode: 'contain',
    
    marginTop: 10,

    
  },
  carouselContainer: {
    marginTop: height * 0.45,
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
  },
  slide: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  dot: {
    backgroundColor: '#ccc',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    marginTop: 30,
  },
  activeDot: {
    backgroundColor: '#1A73E8',
    width: 16,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    marginTop: 30,
  },
  button: {
    backgroundColor: '#1A73E8',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    marginTop: 30,
    alignSelf: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  skip: {
    marginTop: 16,
    color: '#1A73E8',
    fontSize: 14,
    textAlign: 'center',
  },
});
