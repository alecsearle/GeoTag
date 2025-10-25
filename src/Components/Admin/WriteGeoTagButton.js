import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

function WriteGeoTagButton({ onPress, isWriting }) {
  return (
    <View style={styles.bottom}>
      <Button mode="contained" onPress={onPress} loading={isWriting} disabled={isWriting}>
        {isWriting ? "Writing..." : "Write to Geo Tag"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    padding: 10,
    alignItems: "center",
  },
});

export default WriteGeoTagButton;
