import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

function InfoCard({ label, content, variant = "bodyLarge", contentStyle }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="labelLarge" style={styles.label}>
          {label}
        </Text>
        <Text variant={variant} style={[styles.content, contentStyle]}>
          {content}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  label: {
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  content: {
    color: "#333",
  },
});

export default InfoCard;
