import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  Alert,
} from "react-native";
import { Button, FAB, IconButton, Snackbar } from "react-native-paper";
import Eventcard from "./Components/EventCard";
import MainInfoCard from "./Components/MainInfoCard";
import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import styles from "@/Styles/app.styles";
import { dbUtils } from "@/database";
import { type Expectation } from "@/Types/index.types";
import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";

export default function Home() {
  const db = useSQLiteContext();

  const [expectations, setExpectations] = useState<Expectation[]>([]);
  const [showArchives, setshowArchives] = useState<boolean>(false);
  async function fetchExpectations() {
    try {
      const data = await dbUtils.getAllExpectations(db);
      setExpectations(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    try {
      fetchExpectations();
    } catch (error) {
      console.error("fetching fails");
    }
  }, []);

  const requestFileWritePermission = async () => {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) {
      console.log("File write Permissions Denied!!");
      return {
        access: false,
        directoryUri: null,
      };
    }
    return {
      access: true,
      directoryUri: permissions.directoryUri,
    };
  };
  async function downloadData() {
    try {
      const data = await dbUtils.getAllExpectations(db);
      const jsonData = JSON.stringify(data, null, 2);

      const reqPermissionResponse = await requestFileWritePermission();
      if (
        !reqPermissionResponse.access ||
        !reqPermissionResponse.directoryUri
      ) {
        return Alert.alert("Permissions denied");
      }

      await FileSystem.StorageAccessFramework.createFileAsync(
        reqPermissionResponse.directoryUri,
        "Expectations.json",
        "application/json"
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, jsonData);
        })
        .then(() => {
          Alert.alert("Success", "File Saved Successfully");
        })
        .catch((e) => {
          Alert.alert("Error", `Could not save file: ${e.message}`);
        });
    } catch (error) {
      Alert.alert("Error", `Could not Download file ${error?.message}`);
    }
  }
  async function importData() {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });

      if (!res.assets) {
        return Alert.alert("Error", "Please select a valid JSON file");
      }

      const uri = res.assets[0].uri;
      const data = await FileSystem.readAsStringAsync(uri);
      const parsedData = JSON.parse(data) as Expectation[];

      await dbUtils.importData(db, parsedData);
      await fetchExpectations(); // Refresh the list
      Alert.alert("Success", "Data imported successfully");
    } catch (error) {
      Alert.alert("Error", `Could not import file: ${error.message}`);
    }
  }
  return (
    <View style={{ flex: 1, height: "100%" }}>
      <ScrollView>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={{ ...styles.heading1 }} onLongPress={downloadData}>
                Dashboard
              </Text>
              <Link href="/CalendarView" asChild>
                <IconButton icon="calendar" iconColor="#fff" />
              </Link>
            </View>

            <MainInfoCard />
            <View style={styles.grid}>
              <Text onLongPress={importData} style={styles.heading1}>
                Upcoming events
              </Text>
              <TouchableHighlight
                underlayColor="#232528"
                onPress={() => router.navigate("/AllEvents")}
              >
                <Text style={styles.caption2}>See all</Text>
              </TouchableHighlight>
            </View>
            {expectations.length > 0 ? (
              expectations
                ?.sort((a, b) => {
                  return a.expected_at - b.expected_at;
                })
                ?.filter((expectation) => !expectation.result)
                .slice(0, 5)
                .map((expectation) => (
                  <Eventcard
                    key={expectation.id}
                    data={expectation}
                    pastEvent={false}
                  />
                ))
            ) : (
              <Text></Text>
            )}
            <View style={{ ...styles.grid, marginTop: 40 }}>
              <Text style={styles.heading1}>
                {showArchives ? "Archived" : "Previous"} events
              </Text>
              <TouchableHighlight
                underlayColor="#232528"
                onPress={() => setshowArchives((prev) => !prev)}
              >
                <Text style={styles.caption2}>
                  {!showArchives ? "Archived" : "Previous"}
                </Text>
              </TouchableHighlight>
            </View>
            {expectations.length > 0 &&
              expectations
                ?.filter((expectation) => !!expectation.result)
                ?.filter(
                  (expectation) =>
                    Boolean(expectation.archived) === showArchives
                )
                .map((expectation) => (
                  <Eventcard
                    key={expectation.id}
                    data={expectation}
                    pastEvent={true}
                  />
                ))}
          </View>
        </SafeAreaView>
      </ScrollView>

      <Link href="/AddNewExpect" asChild>
        <FAB icon="plus" color="#fff" style={styles.fab} onPress={() => {}} />
      </Link>
      <Link href="/SecretNotes" asChild>
        <FAB icon="note" color="#fff" style={styles.notes} onPress={() => {}} />
      </Link>
    </View>
  );
}
