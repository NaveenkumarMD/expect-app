import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "@/database";
import { View } from "react-native";

const theme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    background: "#232528",
  },
};

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#232528" }}>
      <SQLiteProvider databaseName="data.db" onInit={migrateDbIfNeeded}>
        <PaperProvider theme={theme}>
          <StatusBar style="light" backgroundColor={"#232528"} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "#232528",
              },
              animation: "slide_from_bottom",
              animationDuration: 200,
              presentation: "modal",
              cardOverlayEnabled: true,
              cardStyle: {
                backgroundColor: "#232528",
              },
            }}
          />
        </PaperProvider>
      </SQLiteProvider>
    </View>
  );
}
