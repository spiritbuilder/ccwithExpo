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

const AddNews = ({ route }) => {
  const [modal, setModal] = useState(false);
  const submit = async (values) => {
    let response = await axios.post("");
  };

  const handleUpload = async (images) => {
    const formdata = new FormData();
    formdata.append("file", images);
    formdata.append("upload_preset", "cc");
    try {
      const resp = await axios.post(
        "https://api.cloudinary.com/v1_1/tolaifa/image/upload",
        formdata
      );
      setFieldValue(field, resp.data.secure_url);
      setUploading(false);
      setstate({ file: null, visible: false });
    } catch (error) {
      alert(error.message);
      setUploading(false);
    }
  };

  let schema = Yup.object().shape({
    author: Yup.string()
      .min(3, "Author name must be more than 3 characters")
      .required(),
    // body: Yup.string()
    //   .min(50, 'The news must be more than 50 characters')
    //   .required(),
    title: Yup.string()
      .min(3, "News title must be more than 3 characters")
      .required(),
    image: Yup.array(),
  });

  const options = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  };

  const pickImage = async (from) => {
    let result;
    if (from === "gallery") {
      result = await ImagePicker.launchImageLibraryAsync(options);
    } else {
      result = await ImagePicker.launchCameraAsync(options);
    }

    console.log(result);

    if (!result.cancelled) {
      return result.uri;
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
          onSubmit={() => {}}
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
                        let picked = await pickImage("gallery");
                        setFieldValue("images", [...values.images, picked]);
                        setModal(false);
                      }}
                    >
                      <Text style={styles.btnText}>Open Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addImage}
                      onPress={async () => {
                        let picked = await pickImage("camera");
                        setFieldValue("images", [...values.images, picked]);
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
                      <ImageBackground source={image} style={styles.images}>
                        <TouchableOpacity
                          style={[styles.cancel, { top: 0, right: 0 }]}
                          onPress={() => {
                            setModal(false);
                            setFieldValue(images);
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
                    style={[styles.addImage, { width: "100%", marginTop: 20 }]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.btnText}>Publish</Text>
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

export default AddNews;

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
    height: 65,
    marginHorizontal: 10,
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