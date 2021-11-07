import { exportDefaultSpecifier } from "@babel/types";
import React, { useEffect } from "react";
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
  ingredients: string;
  allergens: string;
}
export declare interface FodMapType {
  ingredient: string;
  severity: string;
}

export default function App() {
  const [value, setValue] = React.useState<DataType | null>(null);
  const [showBarCodeButton, setShowBarCodeButton] = React.useState(false);
  const fodMapList: FodMapType[] = JSON.parse(require("./FodMapList.json"));
  // useEffect(() => {
  //   var filteredList = fodMapList.filter((fodMap: FodMapType) =>
  //     ingredient.toLowerCase().includes(fodMap.ingredient.toLowerCase())
  //   );
  //   console.log(filteredList);
  // }, [fodMapList]);
  const isFodMapFriendly = (ingredients: string | undefined): FodMapType[] => {
    if (ingredients === undefined) {
      return [];
    }
    var filteredList = fodMapList.filter((fodMap: FodMapType): any =>
      ingredients.toLowerCase().includes(fodMap.ingredient.toLowerCase())
    );
    console.log(filteredList);
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
  const getFodMapText = (fodMapList: FodMapType[]): string => {
    var stringBuilder = "This food is not IBS friendly. Contains ";
    var severityHighList = getFodMapHigh(fodMapList);
    var severityHighJoined = severityHighList
      .map((m) => m.ingredient)
      .join(",");
    var severityMediumList = getFodMapMedium(fodMapList);
    var severityMediumJoined = severityMediumList
      .map((m) => m.ingredient)
      .join(",");
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
  const generateFodMapText = (ingredients: string | undefined): string => {
    var filteredList = isFodMapFriendly(ingredients);
    var severityRank = checkSeverity(filteredList);
    if (severityRank === "low") {
      return "This food is IBS friendly. Enjoy!";
    }
    var text = getFodMapText(filteredList);
    return text;
  };

  return showBarCodeButton ? (
    <BarCodeScannerComponent
      setData={setValue}
      setShowBarCodeButton={setShowBarCodeButton}
    />
  ) : (
    <View style={styles.container}>
      <Button
        onPress={() => setShowBarCodeButton(!showBarCodeButton)}
        title="Open camera"
      >
        Open barcode scanner
      </Button>
      {value != null && (
        <Text style={styles.text}>
          {generateFodMapText(value?.ingredients)}
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
});
