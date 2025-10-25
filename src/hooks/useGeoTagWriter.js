import { useState } from "react";
import { Alert, Platform } from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

/**
 * Custom hook for writing geo tags to NFC tags
 * Handles validation, NFC writing, and AsyncStorage persistence
 */
export function useGeoTagWriter(navigation, androidPromptRef) {
  const [geoTagName, setGeoTagName] = useState("");
  const [geoTagHint, setGeoTagHint] = useState("");
  const [isWriting, setIsWriting] = useState(false);

  // Generate a unique ID for the geo tag
  function generateGeoTagId() {
    return `geotag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async function writeGeoTag() {
    // Validate inputs
    if (!geoTagName.trim()) {
      Alert.alert("Error", "Please enter a Geo Tag Name");
      return;
    }
    if (!geoTagHint.trim()) {
      Alert.alert("Error", "Please enter a Geo Tag Hint");
      return;
    }

    setIsWriting(true);

    try {
      // Generate unique ID for this geo tag
      const geoTagId = generateGeoTagId();

      // Create a text record with the geo tag ID
      const textRecord = Ndef.textRecord(geoTagId);
      const bytes = Ndef.encodeMessage([textRecord]);

      // Show Android prompt if on Android
      if (Platform.OS === "android" && androidPromptRef?.current) {
        androidPromptRef.current.setHintText("Assign Geo Tag");
        androidPromptRef.current.setVisible(true);
      }

      // Write to NFC tag
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);

      // Save geo tag data to AsyncStorage
      const geoTagData = {
        id: geoTagId,
        name: geoTagName.trim(),
        hint: geoTagHint.trim(),
        createdAt: new Date().toISOString(),
      };

      // Store in AsyncStorage with the ID as key
      await AsyncStorage.setItem(`geotag_${geoTagId}`, JSON.stringify(geoTagData));

      // Also maintain a list of all geo tag IDs
      const existingIds = await AsyncStorage.getItem("geotag_ids");
      const idList = existingIds ? JSON.parse(existingIds) : [];
      idList.push(geoTagId);
      await AsyncStorage.setItem("geotag_ids", JSON.stringify(idList));

      Alert.alert(
        "Success!",
        `Geo Tag "${geoTagName}" has been written to the NFC tag.\n\nID: ${geoTagId}`,
        [
          {
            text: "OK",
            onPress: () => {
              setGeoTagName("");
              setGeoTagHint("");
              // Reset navigation to Home screen (clear stack)
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Home" }],
                })
              );
            },
          },
        ]
      );
    } catch (ex) {
      console.error("Error writing NFC:", ex);
      Alert.alert("Error", "Failed to write to NFC tag. Please try again.");
    } finally {
      NfcManager.cancelTechnologyRequest();
      if (Platform.OS === "android" && androidPromptRef?.current) {
        androidPromptRef.current.setVisible(false);
      }
      setIsWriting(false);
    }
  }

  return {
    geoTagName,
    setGeoTagName,
    geoTagHint,
    setGeoTagHint,
    isWriting,
    writeGeoTag,
  };
}
