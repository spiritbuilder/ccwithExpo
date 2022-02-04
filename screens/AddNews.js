import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import colors from "../utils/colors";
import baseUrl from "../utils/helpers";

import axios from "axios";
import { connect } from "react-redux";
import store from "../store/start";
import Toast from "react-native-simple-toast";
const { dispatch } = store;

const AddNews = ({ route, navigation }) => {
  const [modal, setModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const submit = async (values) => {
    try {
      let response = route.params
        ? await axios.post(baseUrl + `news`, {
            values,
          })
        : await axios.put(baseUrl + `${route.params.id}`);
    } catch (error) {
      Toast.show("couldn't add news");
    }
  };

  const deleteImage = async (newsId, imageId, listId, setter, val) => {
    try {
      if (route.params) {
        let response = await axios.delete(
          baseUrl + `${newsId}/images/${imageId}`
        );
      }
      setter("images", val["images"].splice(listId, 1));
    } catch (error) {}
  };

  const handleUpload = async (uri, setter, val) => {
    setUploading(true);

    const data = new FormData();

    data.append("file", uri);
    data.append("cloud_name", "ddkfwcu7t");
    data.append("upload_preset", "bonsfnr0");
    const form = {
      key: "6d207e02198a847aa98d0a2a901485a5",
      action: "upload",
      source:uri.uri
    };
    // formdata.append("api_key", "379238249965154");
    try {
      const resp = await axios.post("https://freeimage.host/api/1/upload", form);
      console.log(resp.data);
      setter("images", [...val.images, ...resp.data.secure_url]);
      setUploading(false);
    } catch (error) {
      console.log(error.response);
      Toast.show("could not upload image");
      setUploading(false);
    }
  };

  let schema = Yup.object().shape({
    author: Yup.string()
      .min(3, "Author name must be more than 3 characters")
      .required(),
    body: Yup.string()
      .min(10, "The news must be more than 10 characters")
      .required(),
    title: Yup.string()
      .min(3, "News title must be more than 3 characters")
      .required(),
    image: Yup.array(),
  });

  const options = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
  };

  const pickImage = async (from, setter, val) => {
    let result;
    if (from === "gallery") {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }

    if (!result.cancelled) {
      handleUpload(result, setter, val);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar
        backgroundColor="rgba(26, 137, 23, 1)"
        barStyle="light-content"
      />

      <ScrollView style={styles.container}>
        <Formik
          initialValues={{
            author: route.params ? route.params.author : "",
            title: route.params ? route.params.title : "",
            body: route.params ? route.params.body : "",
            images: route.params ? route.params.images : [],
            id: route.params ? route.params.id : null,
          }}
          validationSchema={schema}
          onSubmit={async (val) => {
            if (route.params) {
              try {
                console.log(" i edited");
                let res = await axios.put(
                  baseUrl + `/news/${route.params.id}`,

                  val
                );

                navigation.navigate("Landing", "reload");
              } catch (error) {
                console.log("err");
              }
            } else {
              axios.post(baseUrl + "/news", val).then(async (res) => {
                if (val.images.length > 0) {
                }
                for (let i = 0; i < val.images.length; i++) {
                  await axios.post(baseUrl + `/news/${res.id}/images`, {
                    newsId: res.id,
                    image: val.images[i],
                  });
                }
                navigation.navigate("Landing", "reload");
              });

              navigation.navigate("Landing", reload);
            }
          }}
        >
          {({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
            <>
              {modal ? (
                <View style={styles.modal}>
                  <View style={styles.modalbox}>
                    <TouchableOpacity
                      style={styles.cancel}
                      onPress={() => setModal(false)}
                    >
                      <MaterialIcons name="cancel" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addImage}
                      onPress={async () => {
                        let picked = await pickImage(
                          "gallery",
                          setFieldValue,
                          values
                        );

                        setModal(false);
                      }}
                    >
                      <Text style={styles.btnText}>Open Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addImage}
                      onPress={async () => {
                        let picked = await pickImage(
                          "camera",
                          setFieldValue,
                          values
                        );

                        setModal(false);
                      }}
                    >
                      <Text style={styles.btnText}>Launch Camera</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <ScrollView horizontal>
                    {values.images.map((image, id) => (
                      <ImageBackground
                        key={id}
                        source={image}
                        style={styles.images}
                      >
                        <TouchableOpacity
                          style={[styles.cancel, { top: 0, right: 0 }]}
                          onPress={() => {
                            console.log("first" + image);
                            if (route.params.id) {
                              deleteImage(
                                route.params.id,
                                image.imageId,
                                id,
                                setFieldValue,
                                values
                              );
                            } else {
                              setFieldValue(
                                "images",
                                values.images.splice(id, 1)
                              );
                            }

                            setModal(false);
                          }}
                        >
                          <MaterialIcons
                            name="cancel"
                            size={24}
                            color="rgba(0,0,0,.9)"
                          />
                        </TouchableOpacity>
                      </ImageBackground>
                    ))}
                  </ScrollView>
                  <View style={styles.inputwrap}>
                    <Text style={styles.text}>Title :</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("title")}
                      value={values.title}
                    />
                    <Text>{errors && errors.title}</Text>
                  </View>
                  <View style={styles.inputwrap}>
                    <Text style={styles.text}>Author :</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleChange("author")}
                      value={values.author}
                    />
                    <Text>{errors && errors.author}</Text>
                  </View>
                  <View style={styles.inputwrap}>
                    <Text style={styles.text}>Body :</Text>
                    <TextInput
                      style={[{ height: 200 }, styles.input]}
                      multiline
                      onChangeText={handleChange("body")}
                      value={values.body}
                    />
                    <Text>{errors && errors.body}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addImage}
                    onPress={() => {
                      setModal(true);
                    }}
                  >
                    <Text style={styles.btnText}>Add Images </Text>
                    <AntDesign name="picture" size={24} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.addImage,
                      { width: "100%", marginVertical: 20 },
                    ]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.btnText}>
                      {route.params ? "Update" : "Publish"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}
        </Formik>
      </ScrollView>
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

export default connect(mapState, mapDispatch)(AddNews);

const styles = StyleSheet.create({
  input: {
    borderRadius: 2,
    borderColor: colors.green,
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 40,
  },
  scroll: {
    flex: 1,
    paddingBottom: 40,
  },
  inputwrap: {
    paddingVertical: 10,
  },
  text: {
    color: "black",
    fontWeight: "bold",
    marginBottom: 4,
  },

  addImage: {
    // width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  images: {
    width: 130,
    height: 80,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
  },
  modal: {
    width: "100%",
    height: "100%",
    zIndex: 35,
    padding: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,.6)",
  },
  modalbox: {
    height: 200,
    width: "90%",
    borderRadius: 4,
    display: "flex",
    justifyContent: "space-evenly",
    borderRadius: 20,
  },
  cancel: {
    position: "absolute",
    right: -10,
    top: -10,
  },
});
