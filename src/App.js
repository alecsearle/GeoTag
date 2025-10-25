import * as React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./AppNavigator.js";
import { AdminProvider } from "./context/AdminContext.js";

function Main() {
  return (
    <PaperProvider>
      <AdminProvider>
        <AppNavigator />
      </AdminProvider>
    </PaperProvider>
  );
}

export default Main;
