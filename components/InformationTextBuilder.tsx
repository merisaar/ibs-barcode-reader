import React, { useEffect, useState } from "react";

export declare interface FodMapType {
    ingredient: string;
    severity: string;
}

const isDevelopment = false;
export const baseUrl = isDevelopment ? "http://127.0.0.1:8000" : "https://ingredients-ibs-api.herokuapp.com";

const isFodMapFriendly = async (ingredients: string | undefined): Promise<FodMapType[]> => {
    if (ingredients === undefined) {
        return [];
    }
    var ingredients_body = `{"ingredients": "${ingredients}"}`
    var filteredList = await getFodMapList(ingredients_body)
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
export const getFodMapText = (name: string, fodMapList: FodMapType[]): string => {
    var stringBuilder = name + "\n is not IBS friendly. \n \n Contains ";
    var severityHighList = getFodMapHigh(fodMapList);
    var severityHighJoined = severityHighList
        .map((m) => m.ingredient)
        .join(", ");
    var severityMediumList = getFodMapMedium(fodMapList);
    var severityMediumJoined = severityMediumList
        .map((m) => m.ingredient)
        .join(", ");
    if (severityHighList.length > 0 && severityMediumList.length > 0) {
        stringBuilder += `ingredients with high FodMap value: \n ${severityHighJoined} \n and ingredients with medium FodMap value: \n ${severityMediumJoined}.`;
    } else if (severityHighList.length > 0) {
        stringBuilder += `ingredients with high FodMap value: \n ${severityHighJoined}.`;
    } else if (severityMediumList.length > 0) {
        stringBuilder += `ingredients with medium FodMap value: \n ${severityMediumList
            .map((m) => m.ingredient)
            .join(",")}.`;
    }
    return stringBuilder;
};
export const generateFodMapText = async (
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


export const getFodMapList = (ingredients: string): any => {
    var url = `${baseUrl}/intolerances/ibs`;
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
