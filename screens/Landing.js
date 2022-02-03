import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import store from "../store/start"
import React, { useState, useEffect } from "react";
import baseUrl from "../utils/helpers";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NewsItem from "../components/NewsItem";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { Toast } from "react-native-toast-message/lib/src/Toast";


const Landing = ({ navigation, model }) => {
  const {dispatch}=store
  console.log(dispatch.news);
  let isfocused = useIsFocused();
  const [news, setNews] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      setRefreshing(true);
      let response = await axios.get(baseUrl + "news");
      setNews(response.data);

      console.log(response.data, "this is the response");
      setRefreshing(false);
    } catch (error) {
      Toast.show({
        type: "info",
        text1:"Couldn't fetch News"
      })
      console.log(error);
      setTimeout(fetchNews, 5000);
    }
  };

  useEffect(() => {
    
    if (isfocused) {
      fetchNews();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Toast />

      <View></View>
      <Text style={styles.c}>{ JSON.stringify(model)}cc News Today!</Text>
      {refreshing ? <ActivityIndicator /> : null}
      {refreshing ? (
        <View style={styles.activity}>
          <ActivityIndicator size={"large"} color={"green"} />
          <Text>Fetching News</Text>
        </View>
      ) : (
        <FlatList
          data={news}
          renderItem={({ item }) => <NewsItem data={item} />}
          keyExtractor={(item) => item.id}
          onRefresh={fetchNews}
          refreshing={refreshing}
        />
      )}

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("AddNews")}
      >
        <View style={styles.iconbutton}>
          <Icon color={"#fff"} name="feather" size={30} />
          <Text style={styles.btntext}>Add News</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Landing;

const styles = StyleSheet.create({
  container: { flex: 1, display: "flex" },
  scroll: {
    backgroundColor: "#eee",
    width: "100%",
    height: "50%",
  },
  btn: {
    position: "absolute",
    bottom: 30,
    right: 10,
    zIndex: 10,
  },
  iconbutton: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: "rgba(26, 137, 23, 1)",
    zIndex: 12,
    display: "flex",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    justifyContent: "center",
    alignItems: "center",
  },
  btntext: {
    color: "#fff",
  },
  c: {
    alignSelf: "center",
    fontSize: 18,
  },
  activity: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
  },
});
