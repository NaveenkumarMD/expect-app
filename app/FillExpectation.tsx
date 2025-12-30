import React, { useEffect, useState } from "react";
import { Button } from "react-native-paper";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router/build/hooks";
import styles from "@/Styles/fillExpect.styles";
import { dbUtils } from "@/database";
import { useSQLiteContext } from "expo-sqlite";
import { Expectation } from "@/Types/index.types";
import { optionsUtils } from "@/utils";
import Icon from "@expo/vector-icons/Entypo";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";

const UpdateExpectation = () => {
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();
  const router = useRouter();
  const [options, setOptions] = useState<string[]>([]);
  const [expectation, setExpecatation] = useState<Expectation>();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [unExpected, setUnExpected] = useState("");
  const [pastEvent, setPastEvent] = useState<boolean>(false);

  async function fetchData() {
    const data = (await dbUtils.getExpectationWithId(
      db,
      Number(id)
    )) as Expectation;
    setExpecatation(data);
    const options = optionsUtils.split(data.options);
    if (!!data?.result) {
      setPastEvent(true);
      if (options.includes(data.result)) {
        setSelectedOption(data.result);
      } else {
        setUnExpected(data.result);
      }
    }
    if (options.length === 1 && options[0] === "") {
      setOptions([]);
    }

    setOptions(options);
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  async function archiveExpectation() {
    try {
      if (!expectation) {
        return;
      }
      await dbUtils.archiveExpectation(db, expectation, true);
      router.replace("/Home");
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSubmit() {
    try {
      if (!expectation) {
        return;
      }
      const result = selectedOption ?? unExpected;
      await dbUtils.updateExpectation(db, expectation, result);
      router.replace("/Home");
    } catch (error) {
      console.log(error);
    }
  }
  let timeStringExpected: string = "";
  let dateStringExpected: string = "";
  let timeStringCreated: string = "";
  let dateStringCreated: string = "";
  if (expectation) {
    const dateObj: Date = new Date(expectation.expected_at);
    dateStringExpected = moment(dateObj).format("ddd, Do MMM");
    timeStringExpected = moment(dateObj).format("h:mm A");
    const dateObjCreated: Date = new Date(expectation.created_at);
    dateStringCreated = moment(dateObjCreated).format("ddd, Do MMM");
    timeStringCreated = moment(dateObjCreated).format("h:mm A");
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={{ ...styles.heading, marginBottom: 16, marginTop: 32 }}>
          {expectation?.title ?? ""}
        </Text>
        <View>
          <View>
            {options.map((option, id) => {
              if (!option) return;
              return (
                <TouchableHighlight
                  key={option}
                  disabled={pastEvent}
                  underlayColor={"#232528"}
                  style={{
                    ...styles.option,
                    backgroundColor:
                      selectedOption === option ? "#2E6FF3" : "#333D4D",
                  }}
                  onPress={() => setSelectedOption(option)}
                >
                  <View key={id}>
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                </TouchableHighlight>
              );
            })}
          </View>
          <View style={{ marginTop: 16 }}>
            <Text style={styles.heading1}>Unexpected happened</Text>
            <TextInput
              editable={!pastEvent}
              value={unExpected}
              style={styles.input}
              onChangeText={(value) => {
                setUnExpected(value);
              }}
            />
          </View>
          <View style={{ marginTop: 16 }}>
            <Text style={styles.heading1}>Expected at</Text>
            <View style={{ ...styles.timeContainer, marginTop: 8 }}>
              <View style={{ ...styles.grid, marginRight: 32 }}>
                <FeatherIcon name="calendar" color="#7D8A95" />
                <Text style={styles.text1}>{dateStringExpected}</Text>
              </View>
              <View style={styles.grid}>
                <MaterialIcon name="clock-time-three-outline" color="#7D8A95" />
                <Text style={styles.text1}>{timeStringExpected}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: 16 }}>
            <Text style={styles.heading1}> Created at</Text>
            <View style={{ ...styles.timeContainer, marginTop: 8 }}>
              <View style={{ ...styles.grid, marginRight: 32 }}>
                <FeatherIcon name="calendar" color="#7D8A95" />
                <Text style={styles.text1}>{dateStringCreated}</Text>
              </View>
              <View style={styles.grid}>
                <MaterialIcon name="clock-time-three-outline" color="#7D8A95" />
                <Text style={styles.text1}>{timeStringCreated}</Text>
              </View>
            </View>
          </View>
          {!pastEvent && (
            <Button
              mode="contained"
              buttonColor="red"
              style={styles.primaryButton}
              labelStyle={styles.primaryButtonLabel}
              onPress={() => {
                handleSubmit();
              }}
            >
              Submit
            </Button>
          )}
          {pastEvent && !expectation?.archived && (
            <Button
              mode="contained"
              buttonColor="red"
              style={styles.primaryButton}
              labelStyle={styles.primaryButtonLabel}
              onPress={() => {
                archiveExpectation();
              }}
              icon="archive"
            >
              Archive
            </Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdateExpectation;
