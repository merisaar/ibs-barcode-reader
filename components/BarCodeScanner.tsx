import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { DataType } from "../App";

export declare interface BarCodeScannerPropTypes {
  setData: React.Dispatch<React.SetStateAction<DataType | null>>;
  setShowBarCodeButton: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function BarCodeScannerComponent({
  setData,
  setShowBarCodeButton,
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
    var url = `http://127.0.0.1:8000/foodinformation/${upcCode}/`;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          alert("Barcode not found. Try again.");
          setScanned(false);
        }
        return res.json();
      })
      .then((response) => {
        setUpcData(response);
      })
      .catch((e) => {
        console.log("Error", e);
      });
  };
  const handleBarCodeScanned = ({ type, data }: { type: any; data: any }) => {
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
      {!scanned && <Text style={styles.titleText}>Scan the barcode.</Text>}
      <BarCodeScanner
        // @ts-ignore
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      {!scanned && (
        <Button title={"Tap to Scan Mock"} onPress={() => MockScan()} />
      )}
    </View>
  );
}
