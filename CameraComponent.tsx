"use strict";
import React, { PureComponent } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { RNCamera } from "react-native-camera";

export default function CameraComponent() {
  let camera: RNCamera;
  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      camera
        .takePictureAsync(options)
        .then((res: any) => console.log(res.uri))
        .catch((e) => console.log("error ", e));
    }
  };
  const onBarCodeRead = (e: any) => {
    Alert.alert("Barcode value is" + e.data, "Barcode type is" + e.type);
  };
  return (
    <View style={styles.container}>
      <RNCamera
        ref={(cam: any) => {
          camera = cam;
        }}
        captureAudio={false}
        // type={RNCamera.Constants.Type.back}
        onBarCodeRead={(e) => onBarCodeRead(e)}
      />
      <View style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}>
        <TouchableOpacity onPress={() => takePicture} style={styles.capture}>
          <Text style={{ fontSize: 14 }}> SNAP </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
  },
});
