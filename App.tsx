import { BarCodeScanner } from "expo-barcode-scanner";
import React from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from "react-native";
import BarCodeScannerComponent from "./BarCodeScanner";

export default function App() {
  const [value, setValue] = React.useState("");
  const [showBarCodeButton, setShowBarCodeButton] = React.useState(false);
  return showBarCodeButton ? (
    <BarCodeScannerComponent />
  ) : (
    <View style={styles.container}>
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
