import React, { useEffect, useState } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ListViewBase,
} from "react-native";
import BarCodeScannerComponent from "./components/BarCodeScanner";

export declare interface DataType {
  ean: string;
  name: string;
  ingredients: string;
  allergens: string;
}
export declare interface FodMapType {
  ingredient: string;
  severity: string;
}

export default function App() {
  const [value, setValue] = useState<DataType | null>(null);
  const [showBarCodeButton, setShowBarCodeButton] = useState(false);
  const [upcCode, setUpcCode] = useState("");
  const [intolerancesInformationText, setIntolerancesInformationText] = useState("");
  useEffect(() => {
    if (value != null) {
      async function getintolerancesInformationText() {
        var informationText = await generateFodMapText(value?.name ? value?.name : "", value?.ingredients)
        setIntolerancesInformationText(informationText);
      }
      getintolerancesInformationText()
    }
  }, []);

  useEffect(() => {
    setUpcCode("")
  }, [value])

  const isFodMapFriendly = async (ingredients: string | undefined): Promise<FodMapType[]> => {
    if (ingredients === undefined) {
      return [];
    }
    var ingredients_body = `{"ingredients": "${ingredients}"}`
    var filteredList = await getFodMapList(ingredients_body)
    console.log('filteredList', filteredList)
    return filteredList;
  };
  const getFodMapHigh = (filteredList: FodMapType[]) => {
    return filteredList.filter((f: FodMapType) => f.severity === "high");
  };
  const getFodMapMedium = (filteredList: FodMapType[]) => {
    return filteredList.filter((f: FodMapType) => f.severity === "medium");
  };
  const checkSeverity = (fodMapList: FodMapType[]): string => {
    var highSeverity = getFodMapHigh(fodMapList);
    if (highSeverity.length > 0) {
      return "high";
    }
    var mediumSeverity = getFodMapMedium(fodMapList);
    if (mediumSeverity.length > 3) {
      return "high";
    } else if (mediumSeverity.length > 0) {
      return "medium";
    } else {
      return "low";
    }
  };
  const getFodMapText = (name: string, fodMapList: FodMapType[]): string => {
    var stringBuilder = name + " is not IBS friendly. Contains ";
    var severityHighList = getFodMapHigh(fodMapList);
    var severityHighJoined = severityHighList
      .map((m) => m.ingredient)
      .join(", ");
    var severityMediumList = getFodMapMedium(fodMapList);
    var severityMediumJoined = severityMediumList
      .map((m) => m.ingredient)
      .join(", ");
    if (severityHighList.length > 0 && severityMediumList.length > 0) {
      stringBuilder += `ingredients with high FodMap value: ${severityHighJoined} and ingredients with medium FodMap value: ${severityMediumJoined}.`;
    } else if (severityHighList.length > 0) {
      stringBuilder += `ingredients with high FodMap value: ${severityHighJoined}.`;
    } else if (severityMediumList.length > 0) {
      stringBuilder += `ingredients with medium FodMap value: ${severityMediumList
        .map((m) => m.ingredient)
        .join(",")}.`;
    }
    return stringBuilder;
  };
  const generateFodMapText = async (
    name: string,
    ingredients: string | undefined
  ): Promise<string> => {
    var filteredList = await isFodMapFriendly(ingredients);
    var severityRank = checkSeverity(filteredList);
    if (severityRank === "low") {
      return `${name} is IBS friendly. Enjoy!`;
    }
    var text = getFodMapText(name, filteredList);
    return text;
  };

  const getIngredientsJson = (upcCode: string) => {
    var url = `https://ingredients-ibs-api.herokuapp.com/foodinformation/${upcCode}/`;
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  const getFodMapList = (ingredients: string): any => {
    var url = `https://ingredients-ibs-api.herokuapp.com/intolerances/ibs`;
    console.log(ingredients)
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: ingredients
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log("response is ", response)
        return response
      })
      .catch((e) => {
        console.log("Error", e);
        return []
      });
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
      <Button
        onPress={() => setShowBarCodeButton(!showBarCodeButton)}
        title="Scan barcode"
      >
        Open barcode scanner
      </Button>
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
        onEndEditing={() => getUpcInformation()}
      />

      {intolerancesInformationText != "" && (
        <Text style={styles.text}>
          {intolerancesInformationText}
        </Text>
      )}
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
  text: {
    textAlign: "center",
    marginTop: 20,
  },
  input: {
    margin: 15,
    height: 40,
    width: "35%",
    borderWidth: 1,
  },
});
