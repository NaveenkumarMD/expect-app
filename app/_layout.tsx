import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { SQLiteProvider } from "expo-sqlite";
import { migrateDbIfNeeded } from "@/database";

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
    <SQLiteProvider databaseName="data.db" onInit={migrateDbIfNeeded}>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor={"#232528"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        />
      </PaperProvider>
    </SQLiteProvider>
  );
}
