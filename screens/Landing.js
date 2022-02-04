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
import store from "../store/start";
import React, { useState, useEffect } from "react";
import baseUrl from "../utils/helpers";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NewsItem from "../components/NewsItem";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { AntDesign } from "@expo/vector-icons";
import colors from "../utils/colors";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";
const { dispatch } = store;

const Landing = ({ news: rematchnews, navigation, loadnews, route }) => {
  let isfocused = useIsFocused();
  const [news, setNews] = useState(rematchnews.pageNews);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async () => {
    try {
      setRefreshing(true);
      let response = await axios.get(baseUrl + "news");
      dispatch.news.loadnews(response.data);
      setRefreshing(false);
      await AsyncStorage.setItem("news", response.data);
    } catch (error) {
      Toast.show({
        type: "info",
        text1: "Couldn't fetch News",
      });
      let res = await AsyncStorage.getItem("news");

      res
        ? () => {
            setNews(res);
          }
        : setTimeout(fetchNews, 5000);
    }
  };

  useEffect(() => {
    if (isfocused || route.params) {
      fetchNews();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.c}>cc News Today!</Text>
      {news ? (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={styles.pagebtn}
            onPress={() => dispatch.news.prevpage()}
          >
            <AntDesign name="caretleft" size={24} color="white" />
          </TouchableOpacity>
          <Text>
            {"Page " + rematchnews.currentpage + " of " + rematchnews.maxpages}
          </Text>
          <TouchableOpacity
            style={styles.pagebtn}
            onPress={() => dispatch.news.nextpage()}
          >
            <AntDesign name="caretright" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ) : null}
      {refreshing ? <ActivityIndicator /> : null}
      {refreshing ? (
        <View style={styles.activity}>
          <ActivityIndicator size={"large"} color={"green"} />
          <Text>Fetching News</Text>
        </View>
      ) : (
        <FlatList
          data={rematchnews.pageNews}
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
const mapState = (state) => ({
  news: state.news,
});
const mapDispatch = (dispatch) => ({
  loadnews: () => dispatch.model.loadnews(),
  nextpage: () => dispatch.model.nextpage(),
  prevpage: () => dispatch.model.prevpage(),
});

export default connect(mapState, mapDispatch)(Landing);

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
  pagination: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  pagebtn: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 10,
  },
});
