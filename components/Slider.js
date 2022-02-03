import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import ExpoFastImage  from 'expo-fast-image'

//import { fox, cat, background, element, lion } from "./images";
import  ImagePagination  from "./ImagePagination";

const { width, height } = Dimensions.get("window");





const Slider = ({ images, width }) => {
    
    
  return (
    <SwiperFlatList
      autoplay
      autoplayDelay={5}
     
      autoplayLoop
      data={images}
          renderItem={({ item }) => {

             
         return (
           <ExpoFastImage
             style={[styles.image, { width: width }]}
             source={item}
           />
           //  <Image style={[styles.image, { width: width }]} source={item}  />
         );
          }}
      showPagination
      PaginationComponent={ImagePagination}
    />
  );
};

export default Slider
const styles = StyleSheet.create({
  image:{
    height: 200,
    borderRadius:10
  }
})
