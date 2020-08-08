import React from "react";
import { StyleSheet, TouchableOpacity, View, Image, Alert } from "react-native";
import { Button, Icon, Text, theme } from "galio-framework";
import { MaterialIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Header from "../common/header";
import { NavigationActions } from "@react-navigation/native";
import * as firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';

var firebaseConfig = {
  apiKey: "AIzaSyBsOhUnlv5KXiFg3rc3rIIAdwIbAciUdjo",
  authDomain: "skin-cancer-detection-ap-e2397.firebaseapp.com",
  databaseURL: "https://skin-cancer-detection-ap-e2397.firebaseio.com",
  projectId: "skin-cancer-detection-ap-e2397",
  storageBucket: "skin-cancer-detection-ap-e2397.appspot.com",
  messagingSenderId: "231959586751",
  appId: "1:231959586751:web:600edecbcffc177de9e30a",
  measurementId: "G-N2YPK2XFJ2"
};

firebase.initializeApp(firebaseConfig);

export default class HomePatient extends React.Component {
  constructor(props){
    super()
  }
  state = {
    image: null,
  };

  createTwoButtonAlert = () => {
    Alert.alert(
      "Skin Image",
      "Capture your skin image or upload it from a gallery!",
      [
        {
          text: "Camera",
          onPress: async () => {
            await Permissions.askAsync(Permissions.CAMERA);
            const { cancelled, uri } = await ImagePicker.launchCameraAsync({
              allowsEditing: false,
            });
            this.setState({ image: uri });
            console.log(uri);
          },
          style: "Camera",
        },
        {
          text: "Gallery",
          onPress: async () => {
            let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

            if (permissionResult.granted === false) {
              alert("Permission to access camera roll is required!");
              return;
            }

            let pickerResult = await ImagePicker.launchImageLibraryAsync();
            if (pickerResult.cancelled === true) {
              return;
            } else {
              this.setState({ image: pickerResult.uri });
            }
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  upload = async () => {
     const fileExtension = this.state.image.split('.').pop();
     var uuid = uuidv4();
     const fileName = `${uuid}.${fileExtension}`;
    const response = await fetch(this.state.image);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("my-image/" + fileName);
    return ref.put(blob);
} ;  

  render() {
    
    return (
      <View>
        <Header drawer={this.props} title={"Home"} />
        <View style={styles.container}>
          <Text p style={styles.description} color = {"#484a49"}>
            Upload or capture Image for your ubnormal skin ...
          </Text>

          <Image style={styles.image} source={{ uri: this.state.image }} />
        </View>
        <MaterialIcons
          name="photo-camera"
          size={45}
          color= '#5E72E4'
          style={styles.camera}
          onPress={this.createTwoButtonAlert}
        />
        <MaterialIcons
          name="search"
          size={45}
          color='#5E72E4'
          style={styles.predict}
          onPress={this.upload}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 21,
  },
  row: { flexDirection: "row" },
  image: {
    width: 300,
    height: 300,
    backgroundColor: "#FFF",

    borderWidth: 5,
    borderColor:'#5E72E4',
  },

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  camera: {
    position: "absolute",
    bottom: -600,
    right: 30,
  },
  predict: {
    position: "absolute",
    bottom: -600,
    left: 30,
  },
  description: {
    fontWeight: "bold",
    justifyContent: "space-between",
    padding: 30,
    fontSize: 25,
  },
});
