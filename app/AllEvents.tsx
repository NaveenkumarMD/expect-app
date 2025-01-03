import { dbUtils } from "@/database";
import styles from "@/Styles/app.styles";
import { Expectation } from "@/Types/index.types";
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableHighlight,
  SafeAreaView,
} from "react-native";
import EventCard from "./Components/EventCard";

const AllEvents = () => {
  const db = useSQLiteContext();

  const [expectations, setExpectations] = useState<Expectation[]>([]);
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
    <ScrollView>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={{ ...styles.heading1 }}>All Upcoming events</Text>
          </View>
          <View>
            {expectations.length > 0 ? (
              expectations
                ?.sort((a, b) => {
                  return a.expected_at - b.expected_at;
                })
                ?.filter((expectation) => !expectation.result)

                .map((expectation) => (
                  <EventCard
                    key={expectation.id}
                    data={expectation}
                    pastEvent={false}
                  />
                ))
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default AllEvents;
