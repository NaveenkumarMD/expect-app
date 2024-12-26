import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import { Button, FAB, IconButton } from "react-native-paper";
import Eventcard from "./Components/EventCard";
import MainInfoCard from "./Components/MainInfoCard";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import styles from "@/Styles/app.styles";
import { dbUtils } from "@/database";
import { type Expectation } from "@/Types/index.types";
import Icon from "@expo/vector-icons/Ionicons";

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
      console.log("Onme tghe Home poge");
      fetchExpectations();
    } catch (error) {
      console.error("fetching fails");
    }
  }, []);
  return (
    <View style={{ flex: 1, height: "100%" }}>
      <ScrollView>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={{ ...styles.heading1 }}>Dashboard</Text>

              <Link href="/CalendarView" asChild>
                <IconButton icon="calendar" iconColor="#fff" />
              </Link>
            </View>
            {/* <Button
              onPress={() => {
                dbUtils.cleartables(db);
              }}
            >
              Clear tabkes
            </Button> */}
            <MainInfoCard />
            <View style={styles.grid}>
              <Text style={styles.heading1}>Upcoming events</Text>
              <Text style={styles.caption2}>See all</Text>
            </View>
            {expectations.length > 0 ? (
              expectations
                ?.filter((expectation) => !expectation.result)
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
              <Text style={styles.heading1}>Previous events</Text>
              <TouchableHighlight
                onPress={() => setshowArchives((prev) => !prev)}
              >
                <Text style={styles.caption2}>Archives</Text>
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
    </View>
  );
}
