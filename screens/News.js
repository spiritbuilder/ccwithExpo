import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import baseUrl from "../utils/helpers";
import Comment from "../components/Comment";
import axios from "axios";
import Slider from "../components/Slider";
import { FontAwesome } from "@expo/vector-icons";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import colors from "../utils/colors";
import { useIsFocused } from "@react-navigation/native";

const News = ({ route, navigation }) => {
  let isfocused = useIsFocused();
  let { images, title, id, body, createdAt, author } = route.params;
  const [width, setWidth] = useState();
  const [comments, setComments] = useState();
  const [newComment, setNewComment] = useState();
  const fetchComments = async () => {
    try {
      console.log("fetching api");
      let response = await axios.get(
        baseUrl + `news/${route.params.id}/comments`
      );
      setComments(response.data);

      return;
    } catch (error) {
      setTimeout(() => {
        fetchComments();
      }, 5000);
    }
  };

  const addComments = (comment) => {
    try {
      console.log("first" + id);
      let response = axios.post(baseUrl + `news/${id}/comments`, {
        comment: newComment,
        name: "Timi",
        avatar:
          "https://media.istockphoto.com/photos/illustration-of-standing-african-american-woman-with-arms-crossed-of-picture-id1296857178?s=612x612",
        newsId: id,
      });
      Toast.show({
        type: "info",
        text1: "Success",
        text2: "Successfully added your comment",
      });
      fetchComments();
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "info",
        text1: "Error",
        text2: "Couldn't add Comment",
      });
    }
  };
  const deleteNews = async () => {
    try {
      let response = await axios.delete(baseUrl + `news/${id}`);
      navigation.navigate("Landing");
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "info",
        text1: "Error",
        text2: "Could not delete news, Please Try again",
      });
    }
  };
  useEffect(() => {
    if (isfocused) {
      fetchComments();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="rgba(26, 137, 23, 1)"
      />
      <View>
        <TouchableOpacity></TouchableOpacity>
      </View>
      <View
        style={styles.container}
        onLayout={(e) => {
          setWidth(e.nativeEvent.layout.width);
        }}
      >
        <ScrollView
          style={styles.scroll}
          onLayout={(e) => {
            setWidth(e.nativeEvent.layout.width);
          }}
        >
          {images ? (
            <Slider images={images} width={width && width - 20} />
          ) : (
            <Image source={require("../assets/news.jpg")} />
          )}
          <View style={styles.btns}>
            <TouchableOpacity
              style={styles.editbtn}
              onPress={() =>
                navigation.navigate("AddNews", { ...route.params })
              }
            >
              <Text style={styles.editbtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editbtn}
              onPress={() => {
                deleteNews();
              }}
            >
              <Text style={styles.editbtnText}>Delete this news</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.authorbar}>
            <Text>{createdAt.slice(0, 10)}</Text>
            <Text>By: {author}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.body}>{body}</Text>

          {comments?.map((item, id) => (
            <Comment
              key={id}
              comment={item}
              newsId={route.params.id}
              commentId={id}
              refreshFunction={fetchComments}
            />
          ))}
        </ScrollView>
        <View style={styles.commentbox}>
          <TextInput
            style={styles.comment}
            onChangeText={setNewComment}
            value={newComment}
            placeholder="Add Comment"
          />
          <TouchableOpacity
            style={styles.send}
            onPress={() => {
              newComment?.length > 0 && addComments();
              setNewComment();
            }}
          >
            <FontAwesome name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default News;

const styles = StyleSheet.create({
  container: { flex: 1, display: "flex" },
  scroll: {
    backgroundColor: "#eee",
    width: "100%",
    flex: 1,
    padding: 10,
  },
  btn: {
    position: "absolute",
    bottom: 30,
    right: 10,
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
  authorbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    marginVertical: 5,
  },
  commentbox: {
    width: "100%",
    borderColor: colors.green,

    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  send: {
    backgroundColor: colors.green,
    borderRadius: 4,
    padding: 10,
  },
  comment: {
    flex: 1,
    backgroundColor: "rgb(210,210,210)",
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderColor: colors.green,
  },
  body: {
    marginVertical: 5,
    textAlign: "justify",
  },
  editbtn: {
    borderWidth: 1,
    borderColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  editbtnText: {
    fontSize: 13,
    color: colors.green,
  },
  btns: {
    display: "flex",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});
