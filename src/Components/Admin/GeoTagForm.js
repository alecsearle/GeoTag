import React from "react";
import { StyleSheet } from "react-native";
import { TextInput, Text } from "react-native-paper";

function GeoTagForm({ geoTagName, setGeoTagName, geoTagHint, setGeoTagHint }) {
  return (
    <>
      <Text variant="headlineSmall" style={styles.title}>
        Create a New Geo Tag
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enter a name and hint for where this tag will be hidden.
      </Text>

      <TextInput
        label="Geo Tag Name"
        value={geoTagName}
        onChangeText={setGeoTagName}
        mode="outlined"
        style={styles.input}
        placeholder="e.g., Hidden Treasure, Secret Spot"
        returnKeyType="next"
      />

      <TextInput
        label="Geo Tag Hint"
        value={geoTagHint}
        onChangeText={setGeoTagHint}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
        placeholder="e.g., Near the old oak tree by the park entrance"
        returnKeyType="done"
        blurOnSubmit={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 20,
    color: "#666",
  },
  input: {
    marginBottom: 15,
  },
});

export default GeoTagForm;
