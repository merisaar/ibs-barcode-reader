import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function BarCodeScannerComponent() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [upcCode, setUpcCode] = useState("")
  const [upcData, setUpcData] = useState<any | null>(null);
  useEffect(() => {
    BarCodeScanner.requestPermissionsAsync().then(
      (scanner: any) => {
        setHasPermission(scanner.status === 'granted');
      }
    )
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    if (upcCode != "") {
      getUpcInformation();
    }
  }, [upcCode])

  useEffect(() => {
    alert(`${upcData}`);
  }, [upcData])

  useEffect(() => {
    console.log("halojata", scanned)
    if(scanned == true) {
      console.log("halooo", scanned)
      getUpcInformation()
    }
    console.log("scanned code ", upcCode)
    console.log("received data", upcData)
  }, [scanned])

  const getUpcInformation = () => {
    var key = "/w2TStaBExGh"
    var signature = "hnkTkPCpwa+UrhmO+xpZiQLnt3Y="
    var url = `	https://www.digit-eyes.com/gtin/v2_0/?upcCode=${upcCode}&field_names=description&language=en&app_key=${key}&signature=${signature}`;
    
    console.log(url)
    fetch('https://jsonplaceholder.typicode.com/todos/1', { method: 'POST',
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin', 
    headers: {
      'Content-Type': 'application/json'
    }})
      .then(res => res.json()).then(data => { setUpcData(data); console.log(data.description); })
      .catch(e => console.log(e))
  };
  const handleBarCodeScanned = ({ type, data }: { type: any, data: any }): boolean => {
    console.log("haloo")
    setScanned(true);
    setUpcCode(data);
    return scanned;
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  );
}