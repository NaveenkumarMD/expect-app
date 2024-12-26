import React, { useState } from "react";
import { Button, Snackbar } from "react-native-paper";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import styles from "@/Styles/addNewExpect.styles";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes";
import { dbUtils } from "@/database";
import { useSQLiteContext } from "expo-sqlite";
import { optionsUtils } from "@/utils";
import { useRouter } from "expo-router";
import moment from "moment";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

const AddNewExpect = () => {
  const db = useSQLiteContext();
  const router = useRouter();
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [showDatepicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimepicker, setShowTimePicker] = useState<boolean>(false);
  const [timestamp, setTimestamp] = useState<Timestamp | null>(null);

  const [options, setOptions] = useState<string[]>([""]);

  const addNewOption = (): void => {
    const temp = [...options];
    temp.push("");
    setOptions(temp);
  };
  const removeOption = (index: number): void => {
    const temp = [...options];
    temp.splice(index, 1);
    setOptions(temp);
  };
  const handleOptionChange = (value: string, id: number): void => {
    const temp = [...options];
    temp[id] = value;
    setOptions(temp);
  };

  const onChangeDate = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ): void => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDatePicker(false);
    updateTimestamp(currentDate, time);
  };

  const onChangeTime = (
    _event: DateTimePickerEvent,
    selectedTime: Date | undefined
  ): void => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
    setShowTimePicker(false);
    updateTimestamp(date, currentTime);
  };

  const updateTimestamp = (selectedDate: Date, selectedTime: Date): void => {
    // Combine date and time into a new Date object
    const combinedDateTime = new Date(selectedDate);
    combinedDateTime.setHours(selectedTime.getHours());
    combinedDateTime.setMinutes(selectedTime.getMinutes());
    combinedDateTime.setSeconds(selectedTime.getSeconds());
    setTimestamp(combinedDateTime.getTime());
  };
  function handleSubmit(): void {
    if (!title) {
      setSnackbarVisible(true);
      return;
    }
    const currentTime: number = new Date().getTime();
    dbUtils.addNewExpectation(db, {
      id: null,
      title: title,
      created_at: currentTime,
      options: optionsUtils.join(options),
      expected_at: timestamp ?? currentTime,
    });
    router.replace("/Home");
  }
  return (
    <View style={styles.container}>
      <Snackbar visible={snackbarVisible}> Title is required</Snackbar>
      <ScrollView style={{ paddingRight: 20 }}>
        <Text style={{ ...styles.heading, marginBottom: 16, marginTop: 16 }}>
          New Expectation
        </Text>
        <View>
          <View>
            <Text style={styles.heading1}>Title</Text>
            <TextInput
              onChangeText={(text: string) => setTitle(text)}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.heading1}> Options</Text>
            {options.map((option, id) => {
              return (
                <View
                  style={{
                    marginBottom: 16,
                    position: "relative",
                  }}
                  key={id}
                >
                  <TextInput
                    style={styles.input}
                    onChangeText={(value) => handleOptionChange(value, id)}
                  />

                  <View style={styles.removeIcon}>
                    <TouchableHighlight
                      underlayColor={"#333D4D"}
                      onPress={() => {
                        removeOption(id);
                      }}
                    >
                      <MaterialIcon name="remove" color="#7D8A95" size={24} />
                    </TouchableHighlight>
                  </View>
                </View>
              );
            })}
            <Button
              mode="text"
              labelStyle={styles.secondaryButtonLabel}
              onPress={addNewOption}
              rippleColor="#232528"
            >
              Add new
            </Button>
          </View>
          <View>
            <Text style={styles.heading1}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                editable={false}
                value={date.toDateString()}
              />
            </TouchableOpacity>
            {showDatepicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                onChange={onChangeDate}
              />
            )}
          </View>
          <View>
            <Text style={styles.heading1}> Time</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <TextInput
                style={styles.input}
                editable={false}
                value={moment(time).format("hh:mm A")}
              />
            </TouchableOpacity>
            {showTimepicker && (
              <DateTimePicker
                testID="timePicker"
                value={time}
                mode="time"
                is24Hour={false}
                onChange={onChangeTime}
              />
            )}
          </View>

          <Button
            mode="contained"
            style={styles.primaryButton}
            labelStyle={styles.primaryButtonLabel}
            onPress={handleSubmit}
          >
            Submit
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddNewExpect;
