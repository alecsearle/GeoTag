import React from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import AndroidPrompt from "../Components/AndroidPrompt";
import { CommonActions } from "@react-navigation/native";

function GeoTagSearchScreen(props) {
  const { route, navigation } = props;
  const { geoTag } = route.params;
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanResult, setScanResult] = React.useState(null);
  const androidPromptRef = React.useRef();

  async function scanForGeoTag() {
    try {
      setIsScanning(true);
      setScanResult(null);

      if (Platform.OS === "android") {
        androidPromptRef.current?.setHintText("Detecting Geo Tag");
        androidPromptRef.current?.setVisible(true);
      }

      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      // Extract the geo tag ID from the NFC tag
      let scannedId = null;

      if (tag.ndefMessage && tag.ndefMessage.length > 0) {
        const ndefRecord = tag.ndefMessage[0];

        // Check if it's a text record (our geo tag ID)
        if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN) {
          if (ndefRecord.type.every((b, i) => b === Ndef.RTD_BYTES_TEXT[i])) {
            scannedId = Ndef.text.decodePayload(ndefRecord.payload);
          }
        }
      }

      // Compare scanned ID with the current geo tag ID
      if (scannedId === geoTag.id) {
        // Success! Found the correct tag
        setScanResult({
          success: true,
          message: "Congratulations! You found the correct Geo Tag!",
        });
        Alert.alert(
          "🎉 Success!",
          `You found "${geoTag.name}"!\n\nYou've successfully located the hidden geo tag.`,
          [
            {
              text: "Search Another",
              onPress: () => {
                // Go back to the list screen
                navigation.navigate("GeoTagList");
              },
            },
            {
              text: "Go Home",
              onPress: () => {
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
      } else if (scannedId) {
        // Wrong tag
        setScanResult({
          success: false,
          message: "This is not the correct Geo Tag. Keep searching!",
        });
        Alert.alert("❌ Wrong Tag", "This geo tag doesn't match. Check the hint and try again!", [
          { text: "Try Again" },
        ]);
      } else {
        // Not a valid geo tag
        setScanResult({
          success: false,
          message: "This NFC tag is not a valid Geo Tag.",
        });
        Alert.alert("Invalid Tag", "This NFC tag doesn't contain a valid Geo Tag ID.", [
          { text: "OK" },
        ]);
      }
    } catch (ex) {
      console.error("Error scanning NFC:", ex);
      if (ex.toString().includes("cancelled") || ex.toString().includes("Session invalidated")) {
        // User cancelled, don't show error
      } else {
        Alert.alert("Scan Error", "Failed to scan NFC tag. Please try again.");
      }
    } finally {
      NfcManager.cancelTechnologyRequest();
      if (Platform.OS === "android") {
        androidPromptRef.current?.setVisible(false);
      }
      setIsScanning(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              Searching For:
            </Text>
            <Text variant="headlineMedium" style={styles.geoTagName}>
              {geoTag.name}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="labelLarge" style={styles.label}>
              Location Hint
            </Text>
            <Text variant="bodyLarge" style={styles.hint}>
              {geoTag.hint}
            </Text>
          </Card.Content>
        </Card>

        {scanResult && (
          <Card style={[styles.card, scanResult.success ? styles.successCard : styles.errorCard]}>
            <Card.Content>
              <Text
                variant="titleMedium"
                style={scanResult.success ? styles.successText : styles.errorText}
              >
                {scanResult.success ? "✓ " : "✗ "}
                {scanResult.message}
              </Text>
            </Card.Content>
          </Card>
        )}

        <View style={styles.instructions}>
          <Text variant="bodyMedium" style={styles.instructionText}>
            Use the hint above to find the hidden geo tag. When you think you've found it, tap the
            scan button below and hold your device near the NFC tag.
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={scanForGeoTag}
          loading={isScanning}
          disabled={isScanning}
          style={styles.scanButton}
          icon="nfc-variant"
          contentStyle={styles.scanButtonContent}
        >
          {isScanning ? "Scanning..." : "Scan Geo Tag"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate("GeoTagList")}
          style={styles.backButton}
        >
          Back to List
        </Button>
      </View>

      <AndroidPrompt
        ref={androidPromptRef}
        onCancelPress={() => {
          NfcManager.cancelTechnologyRequest();
          setIsScanning(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 15,
    elevation: 3,
  },
  title: {
    color: "#666",
    marginBottom: 10,
  },
  geoTagName: {
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  hint: {
    color: "#333",
    lineHeight: 24,
    fontSize: 16,
  },
  instructions: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  instructionText: {
    color: "#1976d2",
    lineHeight: 22,
  },
  scanButton: {
    marginTop: 10,
    marginBottom: 15,
  },
  scanButtonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 5,
  },
  successCard: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  errorCard: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 2,
  },
  successText: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  errorText: {
    color: "#c62828",
    fontWeight: "bold",
  },
});

export default GeoTagSearchScreen;
