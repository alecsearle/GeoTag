import { StyleSheet, Text, View } from "react-native";

function DeepLinkingScreen(props) {
  const { route } = props;
  const { msg } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.msg}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  msg: {
    fontSize: 24,
    textAlign: "center",
  },
});

export default DeepLinkingScreen;
