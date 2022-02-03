import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";

import axios from "axios";
import baseUrl from "../utils/helpers";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import colors from "../utils/colors";

const Comment = ({ comment, refreshFunction }) => {
  const [edit, setEdit] = useState();
  const [requesting, setRequesting] = useState(false);

  const request = async (x) => {
    if (x === "delete") {
      try {
        setRequesting(true);
        let response = await axios.delete(
          baseUrl + `news/${comment.newsId}/comments/${comment.id}`
        );
        Toast.show({
          type: "info",
          text1: "Success",
          text2: "Comment Successfully deleted",
        });
        setRequesting(false);
        refreshFunction();
      } catch (error) {
        Toast.show({
          type: "info",
          text1: "Error",
          text2: "Couldn't delete Comment",
        });
        setRequesting(false);
      }
    } else {
      try {
        setRequesting(true);
        let response = await axios.put(
          baseUrl + `news/${comment.newsId}/comments/${comment.id}`,
          {
            comment: edit,
          }
        );
        Toast.show({
          type: "info",
          text1: "Success",
          text2: "Comment Successfully Updated",
        });
        setRequesting(false);
        refreshFunction();
      } catch (error) {
        Toast.show({
          type: "info",
          text1: "Error",
          text2: "Couldn't Update Comment",
        });
        setRequesting(false);
      }
    }
  };

  const handleUpdate = (x) => {
    if (x === "edit") {
      setEdit(comment.comment);
    } else if (x === "cancel") {
      setEdit();
    } else if (x === "send") {
      request("send");
      setEdit();
    } else {
      request("delete");
      setEdit();
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={{ uri: comment.avatar }} />
      <View>
        <View style={{ flex: 1 }}>
          {edit ? (
            <TextInput
              value={edit}
              onChangeText={setEdit}
              style={
                edit ? [styles.comment, styles.input] : { display: "none" }
              }
              multiline
            />
          ) : (
            <Text style={styles.comment}>{comment.comment}</Text>
          )}
        </View>
        <Text style={styles.name}>{comment.name}</Text>
        {!requesting === false ? (
          <ActivityIndicator size="small" color={colors.green} />
        ) : (
          <View style={styles.btnholder}>
            <TouchableOpacity
              style={{ ...styles.btn, backgroundColor: "green" }}
              onPress={() => {
                typeof edit === "string"
                  ? handleUpdate("send")
                  : handleUpdate("edit");
              }}
            >
              <Text style={styles.btnText}>
                {typeof edit === "string" ? "Send" : "Edit"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.btn, backgroundColor: "red" }}
              onPress={() => {
                typeof edit == "string"
                  ? handleUpdate("cancel")
                  : handleUpdate("delete");
              }}
            >
              <Text style={styles.btnText}>
                {typeof edit === "string" ? "Cancel" : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  avatar: {
    resizeMode: "cover",
    width: 30,
    height: 30,
    borderRadius: 40,
    marginRight: 5,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    alignItems: "center",
    backgroundColor: "rgba(124,200,122,0.2)",
    borderRadius: 4,
    marginVertical: 3,
    width: "100%",
  },
  comment: {
    fontSize: 13,

    textAlign: "left",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  btn: {
    padding: 8,
    borderRadius: 4,
  },
  btnText: {
    color: "white",
    fontSize: 11,
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 5,
    borderRadius: 2,
    backgroundColor: "#efefef",
  },
  btnholder: {
    display: "flex",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
  },
});
