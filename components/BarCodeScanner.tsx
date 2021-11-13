import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TextInput } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { DataType } from "../App";

export declare interface BarCodeScannerPropTypes {
  setData: React.Dispatch<React.SetStateAction<DataType | null>>;
  setShowBarCodeButton: React.Dispatch<React.SetStateAction<boolean>>;
  getIngredientsJson: (upcCode: string) => Promise<Response>;
}
export default function BarCodeScannerComponent({
  setData,
  setShowBarCodeButton,
  getIngredientsJson
}: BarCodeScannerPropTypes) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [upcCode, setUpcCode] = useState("");
  const [upcData, setUpcData] = useState<any | null>(null);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (upcCode != "") {
      getUpcInformation();
    }
  }, [upcCode]);

  useEffect(() => {
    if (upcData != null) {
      setData(upcData);
      setShowBarCodeButton(false);
    }
  }, [upcData]);
  const getUpcInformation = () => {
    getIngredientsJson(upcCode)
      .then((res) => {
        if (!res.ok) {
          setScanned(false);
          setData(null);
          setShowBarCodeButton(false);
          alert("Ingredients not found. Try again.");
        } else {
          return res.json();
        }
      })
      .then((response) => {
        setUpcData(response);
      })
      .catch((e) => {
        setScanned(false);
        setData(null);
        console.log("Error", e);
      });
  };
  const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
    console.log("type", type)
    setScanned(true);
    setUpcCode(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const MockScan = () => {
    setScanned(true);
    setUpcCode("6416453015234");
    alert(`Bar code with data 6416453015234 has been scanned!`);
  };
  const styles = StyleSheet.create({
    titleText: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      bottom: 20,
    },
    input: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      height: 50,
      width: "95%",
      margin: 12,
      borderWidth: 1,
    },
    backButtonStyle: {
      position: "absolute",
      marginBottom: 10,
      height: "10%",
      width: "20%",
    },
    mockButtonStyle: {
      position: "absolute",
      right: 0,
      marginBottom: 10,
      height: "10%",
      width: "20%",
    },
  });
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <BarCodeScanner
        // @ts-ignore
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.ean8,
        BarCodeScanner.Constants.BarCodeType.upc_a,
        BarCodeScanner.Constants.BarCodeType.upc_e]}
      />

      <View style={styles.backButtonStyle}>
        <Button
          title={"Go back"}
          onPress={() => setShowBarCodeButton(false)}
        ></Button>
      </View>
      {!scanned && (
        <>
          <Text style={styles.titleText}>Scan the barcode.</Text>
          <View style={styles.mockButtonStyle}>
            <Button title={"Tap to Scan Mock"} onPress={() => MockScan()} />
          </View>
        </>
      )}
    </View >
  );
}
