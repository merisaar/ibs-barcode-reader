import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

export default function CameraComponent() {
  const [camera, setCamera] = useState<
    { hasCameraPermission: null | boolean, type: any }>({
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    });
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  useEffect(() => {
    Permissions.askAsync(Permissions.CAMERA)
      .then(camera => {
        setCamera(prevState => ({
          ...prevState,
          hasCameraPermission: camera.status === 'granted'
        }))
      })
      .catch(e => console.log(e))
  }, []);

  const takePicture = () => {
    console.log("snap")
    if (cameraRef) {
      const options = { quality: 1, base64: true };
      cameraRef.takePictureAsync(options).then((data: any) => {
        console.log(data);
      });
    }
  }

  if (camera.hasCameraPermission === null) {
    return <View />;
  } else if (camera.hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Camera ref={ref => { setCameraRef(ref) }} style={{ flex: 1 }} type={camera.type}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                setCamera(prevState => ({
                  ...prevState,
                  type:
                    camera.type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back,
                }));
              }}>
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                {' '}
                Flip{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => takePicture()} style={{ flex: 1 }}>
              <Text style={{ fontSize: 14 }}> SNAP </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    )
  }
}
