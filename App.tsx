import React from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from "react-native";
import CameraComponent from "./CameraComponent";

export default function App() {
  const [value, setValue] = React.useState("");
  const [showBarCodeButton, setShowBarCodeButton] = React.useState(false);
  return showBarCodeButton ? (
    <CameraComponent />
  ) : (
    <View style={styles.container}>
      <Text></Text>
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        onChangeText={(text) => setValue(text)}
        value={value}
      />
      <Button
        onPress={() => setShowBarCodeButton(!showBarCodeButton)}
        title="Open camera"
      >
        Open barcode scanner
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
