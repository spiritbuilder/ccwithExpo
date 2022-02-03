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
} from "react-native";

import baseUrl from "../utils/helpers";
import Comment from "../components/Comment";
import axios from "axios";
import Slider from "../components/Slider";
import { FontAwesome } from "@expo/vector-icons";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import colors from "../utils/colors";
import { useIsFocused } from "@react-navigation/native";

const News = ({ route , navigation }) => {
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
      console.log(response.data);
      return
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "info",
        text1: "Couldn't fetch",
        text2: "Attempting to refetch Comments",
      });
      fetchComments()
    }
  };

  const addComments = (comment) => {
    try {
      console.log("first" + id);
      let response = axios.post(baseUrl + `news/${id}/comments`, {
        comment: newComment,
        name: "Timi",
        avatar:
          "https://www.google.com/imgres?imgurl=https%3A%2F%2Ffiverr-res.cloudinary.com%2Fimages%2Ft_main1%2Cq_auto%2Cf_auto%2Cq_auto%2Cf_auto%2Fgigs%2F27504677%2Foriginal%2Fdc8eab2b4552007634258e64f0655927e4dcb938%2Fdraw-your-cartoon-avatar.jpg&imgrefurl=https%3A%2F%2Fwww.fiverr.com%2Fsovan19%2Fdraw-your-cartoon-avatar&tbnid=EAmoDJzZ-STc-M&vet=12ahUKEwiamOb-3uH1AhWITMAKHYtlBJ4QMygbegUIARCYAg..i&docid=gUzpIsV0i2sncM&w=680&h=457&itg=1&q=nice%20avatar&ved=2ahUKEwiamOb-3uH1AhWITMAKHYtlBJ4QMygbegUIARCYAg",
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
  const deleteNews = async() => {
  try {
    let response = await axios.delete(baseUrl + `news/${id}`)
    navigation.navigate("Landing")

  } catch (error) {
    console.log(error);
    Toast.show({
      type: "info",
      text1: "Error",
      text2:"Could not delete news, Please Try again"
    })
  }
}
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
      <View><TouchableOpacity></TouchableOpacity></View>
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
    paddingVertical:10
  },

  editbtnText: {
    fontSize: 13,
    color:colors.green
    
  },
  btns: {
    display: "flex",
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection:"row"
  }
});
