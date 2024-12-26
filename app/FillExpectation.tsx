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
  console.log(expectation);
  async function archiveExpectation() {
    try {
      if (!expectation) {
        return;
      }
      await dbUtils.archiveExpectation(db, expectation, true);
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={{ ...styles.heading, marginBottom: 16, marginTop: 32 }}>
          {expectation?.title ?? ""}
        </Text>
        <View>
          <View>
            {options.map((option, id) => {
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
