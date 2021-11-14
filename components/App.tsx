import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import BarCodeScannerComponent from "./BarCodeScanner";
import { generateFodMapText, baseUrl } from "./InformationTextBuilder";

export declare interface DataType {
  ean: string;
  name: string;
  ingredients: string;
  allergens: string;
}

export default function App() {
  const [value, setValue] = useState<DataType | null>(null);
  const [showBarCodeButton, setShowBarCodeButton] = useState(false);
  const [upcCode, setUpcCode] = useState("");
  const [intolerancesInformationText, setIntolerancesInformationText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (value != null) {
      async function getintolerancesInformationText() {
        setLoading(true);
        var informationText = await generateFodMapText(value?.name ? value?.name : "", value?.ingredients)
        setIntolerancesInformationText(informationText);
        setLoading(false)
        console.log(informationText)
      }
      getintolerancesInformationText();

      setUpcCode("")
    }

  }, [value])
  const getIngredientsJson = (upcCode: string) => {
    var url = `${baseUrl}/foodinformation/${upcCode}/`;
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  const getUpcInformation = () => {
    getIngredientsJson(upcCode)
      .then((res) => {
        console.log(res)
        if (!res.ok) {
          setValue(null);
          alert("Barcode not found. Try again.");
        }
        return res.json();
      })
      .then((response) => {
        setValue(response);
      })
      .catch((e) => {
        setValue(null);
        console.log("Error", e);
      });
  };
  return showBarCodeButton ? (
    <BarCodeScannerComponent
      setData={setValue}
      setShowBarCodeButton={setShowBarCodeButton}
      getIngredientsJson={getIngredientsJson}
    />
  ) : (
    <View style={styles.container}>
      <ImageBackground source={require('../resources/background.jpg')} resizeMode="cover" style={styles.image}>
        <View style={styles.scanButton}>
          <Button
            onPress={() => setShowBarCodeButton(!showBarCodeButton)}
            title="Scan barcode"
          >
            Open barcode scanner
          </Button>
        </View>
        <Text style={styles.text}>or</Text>
        <TextInput
          value={upcCode}
          style={styles.input}
          keyboardType="numeric"
          underlineColorAndroid="transparent"
          placeholder="Add ean here"
          autoCapitalize="none"
          onChangeText={setUpcCode}
          maxLength={15}
          onSubmitEditing={() => getUpcInformation()}
        />

        {loading ? <ActivityIndicator size="large" color={"#003319"} />
          : (
            <Text style={styles.intoleranceInformationText}>
              {intolerancesInformationText}
            </Text>
          )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    marginTop: 20,
    color: "#FFFFFF"
  },
  input: {
    marginTop: 15,
    height: 40,
    width: "50%",
    borderWidth: 1,
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    position: "relative",
    left: "25%"
  },
  image: {
    flex: 1,
    justifyContent: "center",
    width: '100%',
  },
  scanButton: {
    justifyContent: "center",
    width: '50%',
    position: "relative",
    left: "25%",
    backgroundColor: "#FFFFFF"
  },
  intoleranceInformationText: {
    textAlign: "center",
    marginTop: 20,
    color: "#FFFFFF",
    fontSize: 18
  }
});
