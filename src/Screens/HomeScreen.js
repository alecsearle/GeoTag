import React from "react";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { Button } from "react-native-paper";
import AndroidPrompt from "../Components/AndroidPrompt";

function HomeScreen(props) {
  const { navigation } = props;
  const [hasNfc, setHasNfc] = React.useState(null);
  const [enabled, setEnabled] = React.useState(null);
  const androidPromptRef = React.useRef();

  React.useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setEnabled(await NfcManager.isEnabled());
      }
      setHasNfc(supported);
    }

    checkNfc();
  }, []);

  React.useEffect(() => {
    function handleUrl(url) {
      if (url) {
        navigation.navigate("DeepLinking", { msg: url.split("://")[1] });
      }
    }
    Linking.getInitialURL().then((url) => {
      handleUrl(url);
    });
    Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });
    return () => {
      Linking.removeAllListeners("url");
    };
  }, [navigation]);

  // THIS PATTERN IS STANDARD EXAMPLE FOR READING NFC TAGS
  async function readNdef() {
    try {
      if (Platform.OS === "android") {
        androidPromptRef.current.setVisible(true);
      }
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      navigation.navigate("Tag", { tag });
    } catch (ex) {
      //   bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
      if (Platform.OS === "android") {
        androidPromptRef.current.setVisible(false);
      }
    }
  }

  function renderNfcButtons() {
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
          Tap
        </Button>
        <Button
          mode="contained"
          style={[styles.btn]}
          onPress={() => {
            navigation.navigate("WriteNdef");
          }}
        >
          WRITE
        </Button>
        <AndroidPrompt
          ref={androidPromptRef}
          onCancelPress={() => {
            NfcManager.cancelTechnologyRequest();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.bannerText}>Find The Tag</Text>
      </View>
      {renderNfcButtons()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    fontSize: 42,
    textAlign: "center",
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

export default HomeScreen;
