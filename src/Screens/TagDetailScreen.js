import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { Ndef } from "react-native-nfc-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import StatusCard from "../Components/Common/StatusCard";
import InfoCard from "../Components/Common/InfoCard";
import MetadataCard from "../Components/Common/MetadataCard";
import MessageCard from "../Components/Common/MessageCard";

function TagDetailScreen(props) {
  const { route } = props;
  const { tag } = route.params;
  const [geoTagData, setGeoTagData] = React.useState(null);
  const [isVerified, setIsVerified] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [geoTagId, setGeoTagId] = React.useState(null);

  React.useEffect(() => {
    async function loadGeoTagData() {
      try {
        // Extract the geo tag ID from the NFC tag
        let extractedId = null;

        if (tag.ndefMessage && tag.ndefMessage.length > 0) {
          const ndefRecord = tag.ndefMessage[0];

          // Check if it's a text record (our geo tag ID)
          if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN) {
            if (ndefRecord.type.every((b, i) => b === Ndef.RTD_BYTES_TEXT[i])) {
              extractedId = Ndef.text.decodePayload(ndefRecord.payload);
            }
          }
        }

        setGeoTagId(extractedId);

        if (extractedId) {
          // Look up the geo tag data in AsyncStorage
          const storedData = await AsyncStorage.getItem(`geotag_${extractedId}`);

          if (storedData) {
            const parsedData = JSON.parse(storedData);
            setGeoTagData(parsedData);
            setIsVerified(true);
          } else {
            setIsVerified(false);
          }
        }
      } catch (error) {
        console.error("Error loading geo tag data:", error);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    }

    loadGeoTagData();
  }, [tag]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Verifying Geo Tag...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {isVerified && geoTagData ? (
          <>
            <StatusCard
              success={true}
              title="Geo Tag Verified!"
              subtitle="This tag is registered in your app"
            />

            <InfoCard
              label="Geo Tag Name"
              content={geoTagData.name}
              variant="headlineMedium"
              contentStyle={styles.name}
            />

            <InfoCard label="Location Hint" content={geoTagData.hint} contentStyle={styles.hint} />

            <MetadataCard
              items={[
                { label: "Tag ID", value: geoTagData.id },
                { label: "Created", value: new Date(geoTagData.createdAt).toLocaleString() },
              ]}
            />
          </>
        ) : (
          <>
            <StatusCard
              success={false}
              title="Geo Tag Not Recognized"
              subtitle="This tag is not registered in your app"
            />

            {geoTagId && (
              <MessageCard type="error">
                <Text variant="labelSmall" style={styles.metadata}>
                  Tag ID: {geoTagId}
                </Text>
                {"\n"}
                This tag may have been created on a different device or the data may have been
                cleared.
              </MessageCard>
            )}

            {!geoTagId && (
              <MessageCard type="error">
                This NFC tag doesn't contain a valid Geo Tag ID.
                {"\n\n"}
                <Text variant="labelSmall" style={styles.debugInfo}>
                  Raw tag data:
                </Text>
                {"\n"}
                <Text variant="bodySmall" style={styles.debugInfo}>
                  {JSON.stringify(tag, null, 2)}
                </Text>
              </MessageCard>
            )}
          </>
        )}

        <Button
          mode="outlined"
          onPress={() =>
            props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
              })
            )
          }
          style={styles.backButton}
        >
          Back to Home
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  name: {
    fontWeight: "bold",
  },
  hint: {
    lineHeight: 24,
  },
  metadata: {
    color: "#999",
  },
  debugInfo: {
    color: "#999",
    fontSize: 10,
    fontFamily: "monospace",
  },
  backButton: {
    marginTop: 20,
  },
});

export default TagDetailScreen;
