import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import NfcManager from "react-native-nfc-manager";
import { Button } from "react-native-paper";
import { useAdmin } from "../context/AdminContext";

function RenderNfcButtons({ hasNfc, enabled, setEnabled, navigation, readNdef }) {
  const { isAdmin } = useAdmin();

  if (hasNfc === null) {
    return null;
  } else if (!hasNfc) {
    return (
      <View style={styles.container}>
        <Text>Your device doesn't support NFC</Text>
      </View>
    );
  } else if (!enabled) {
    return (
      <View>
        <View style={styles.container}>
          <Text>Your NFC is not enabled!</Text>
        </View>
        <Pressable
          onPress={() => {
            NfcManager.goToNfcSetting();
          }}
        >
          <Text>GO TO NFC SETTINGS</Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            setEnabled(await NfcManager.isEnabled());
          }}
        >
          <Text>CHECK AGAIN</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.bottom}>
      <Button
        mode="contained"
        style={[styles.btn]}
        onPress={() => {
          readNdef();
        }}
      >
        Search for a Geo Tag
      </Button>
      {isAdmin && (
        <Button
          mode="contained"
          style={[styles.btn]}
          onPress={() => {
            navigation.navigate("WriteNdef");
          }}
        >
          Create a new Geo Tag
        </Button>
      )}
    </View>
  );
}

export default RenderNfcButtons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  btn: {
    width: 250,
    marginBottom: 15,
  },
});
