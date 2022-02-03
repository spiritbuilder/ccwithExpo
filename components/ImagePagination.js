import React from "react";
import { StyleSheet } from "react-native";
import { Pagination } from "react-native-swiper-flatlist";



const ImagePagination = (props) => {
  return (
    <Pagination
      {...props}
      paginationStyle={styles.paginationContainer}
      paginationStyleItem={styles.pagination}
      paginationDefaultColor="#eee"
      paginationActiveColor="rgba(26, 137, 23, 1)"
    />
  );
};

export default ImagePagination;

const styles = StyleSheet.create({
  paginationContainer: {
        top: 175,
  },
  pagination: {
    borderRadius: 10,
  },
});
