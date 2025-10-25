import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

function StatusCard({ success, title, subtitle }) {
  return (
    <Card style={[styles.card, success ? styles.successCard : styles.errorCard]}>
      <Card.Content>
        <Text variant="headlineSmall" style={success ? styles.successTitle : styles.errorTitle}>
          {success ? "✓ " : "✗ "}
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodyMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  successCard: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#e8f5e9",
  },
  errorCard: {
    borderColor: "#f44336",
    borderWidth: 2,
    backgroundColor: "#ffebee",
  },
  successTitle: {
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 5,
  },
  errorTitle: {
    color: "#f44336",
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#666",
  },
});

export default StatusCard;
