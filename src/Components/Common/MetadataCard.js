import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

function MetadataCard({ items }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        {items.map((item, index) => (
          <Text key={index} variant="labelSmall" style={styles.metadata}>
            {item.label}: {item.value}
          </Text>
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  metadata: {
    color: "#999",
    marginTop: 5,
  },
});

export default MetadataCard;
