import {StyleSheet, Text, View, TouchableWithoutFeedback, Image} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import axios from 'axios';
import Slider from './Slider';
import baseUrl from '../utils/helpers';
import {useNavigation} from '@react-navigation/native';


function createImageArray(arr) {
  let imageArr = [];
  for (let i = 0; i < arr.length; i++) {
    imageArr.push({uri: arr[i].image,imageId:arr[i].id });
  }
  
  return imageArr;
}

export default function NewsItem({data}) {
  const [images, setImages] = useState();
  const [width, setWidth] = useState();
  const prepData = {...data, images: images};
  let {navigate} = useNavigation();
  const fetchImages = async () => {
    try {
      let response = await axios.get(baseUrl + `news/${data.id}/images`);
      prepData.images = response.data;

      setImages(createImageArray(response.data));
    } catch (error) { 
      
 
    }
  };
  useEffect(() => {
    fetchImages();
  }, []);
  return (
    <TouchableWithoutFeedback onPress={() => navigate("News", prepData)}>
      <View
        style={styles.container}
        onLayout={(e) => {
          setWidth(e.nativeEvent.layout.width);
        }}
      >
        {!images ? (<Image width={width} height={200} source={require("../assets/news.jpg")} />):
          (<Slider images={images} width={width-10} />)}
        <Text style={styles.newstitle}>{data.title}</Text>
        <Text>{data.body.slice(0, 80) + "..."}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    backgroundColor: '#eee',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    marginVertical: 5,
  },
  newstitle: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});
