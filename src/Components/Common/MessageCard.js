import React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

function MessageCard({ children, type = "info" }) {
  const getStyles = () => {
    switch (type) {
      case "error":
        return {
          text: styles.errorText,
          card: styles.errorCard,
        };
      case "warning":
        return {
          text: styles.warningText,
          card: styles.warningCard,
        };
      default:
        return {
          text: styles.infoText,
          card: styles.infoCard,
        };
    }
  };

  const styleSet = getStyles();

  return (
    <Card style={[styles.card, styleSet.card]}>
      <Card.Content>
        <Text variant="bodySmall" style={styleSet.text}>
          {children}
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
  infoCard: {
    backgroundColor: "#e3f2fd",
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  errorCard: {
    backgroundColor: "#ffebee",
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  warningCard: {
    backgroundColor: "#fff3e0",
    borderLeftWidth: 4,
    borderLeftColor: "#ff9800",
  },
  infoText: {
    color: "#1976d2",
    lineHeight: 20,
  },
  errorText: {
    color: "#666",
    lineHeight: 20,
  },
  warningText: {
    color: "#e65100",
    lineHeight: 20,
  },
});

export default MessageCard;
