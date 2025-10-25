import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GeoTagForm from "../Components/Admin/GeoTagForm";
import WriteGeoTagButton from "../Components/Admin/WriteGeoTagButton";
import AndroidPrompt from "../Components/AndroidPrompt";
import { useGeoTagWriter } from "../hooks/useGeoTagWriter";

function WriteNdefScreen(props) {
  const androidPromptRef = React.useRef();
  const { geoTagName, setGeoTagName, geoTagHint, setGeoTagHint, isWriting, writeGeoTag } =
    useGeoTagWriter(props.navigation, androidPromptRef);

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.wrapper}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.wrapper} contentContainerStyle={styles.pad}>
            <GeoTagForm
              geoTagName={geoTagName}
              setGeoTagName={setGeoTagName}
              geoTagHint={geoTagHint}
              setGeoTagHint={setGeoTagHint}
            />
          </ScrollView>
        </TouchableWithoutFeedback>

        <WriteGeoTagButton onPress={writeGeoTag} isWriting={isWriting} />
      </KeyboardAvoidingView>

      <AndroidPrompt
        ref={androidPromptRef}
        onCancelPress={() => {
          // Cancel will be handled in the hook
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  pad: {
    padding: 20,
  },
});

export default WriteNdefScreen;
