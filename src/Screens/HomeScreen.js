import React from "react";
import { Linking, StyleSheet, Text, View, ImageBackground } from "react-native";
import NfcManager from "react-native-nfc-manager";
import { Switch } from "react-native-paper";
import { useAdmin } from "../context/AdminContext";
import RenderNfcButtons from "../Components/RenderNfcButtons";

function HomeScreen(props) {
  const { navigation } = props;
  const [hasNfc, setHasNfc] = React.useState(null);
  const [enabled, setEnabled] = React.useState(null);
  const { isAdmin, toggleAdmin, loading: adminLoading } = useAdmin();

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
    // Navigate to the geo tag list screen instead of scanning directly
    navigation.navigate("GeoTagList");
  }

  return (
    <ImageBackground
      source={require("../../assets/images/topographic_map.jpg")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.adminToggleContainer}>
          <Text style={styles.adminLabel}>{isAdmin ? "Admin" : "User"}</Text>
          <Switch value={isAdmin} onValueChange={toggleAdmin} disabled={adminLoading} />
        </View>
        <Text style={styles.bannerText}>Geo Tag</Text>
        <RenderNfcButtons
          hasNfc={hasNfc}
          enabled={enabled}
          setEnabled={setEnabled}
          navigation={navigation}
          readNdef={readNdef}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    resizeMode: "cover",
  },
  bannerText: {
    fontSize: 42,
    textAlign: "center",
  },
  adminToggleContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adminLabel: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default HomeScreen;
