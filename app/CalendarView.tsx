import styles from "@/Styles/calendarView.styles";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useEffect, useState } from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { type Expectation } from "@/Types/index.types";
import EventCard from "./Components/EventCard";
import { useSQLiteContext } from "expo-sqlite";
import { dbUtils } from "@/database";

const today = toDateId(new Date());

const CalendarView = () => {
  const db = useSQLiteContext();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [currentEvents, setCurrentEvents] = useState<Expectation[]>();

  const goToPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
    );
  };

  async function onDateChange(date: string) {
    try {
      const dateObj = new Date(date);
      setSelectedDate(toDateId(dateObj));
      const expectations = await dbUtils.getExpectationsForADay(db, dateObj);
      setCurrentEvents(expectations);
    } catch (error) {}
  }
  useEffect(() => {
    console.log("dew");
    onDateChange(selectedDate);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading1}> Calendar View</Text>
      </View>

      <Calendar
        calendarActiveDateRanges={[
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarMonthId={toDateId(currentMonth)}
        onCalendarDayPress={onDateChange}
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={goToPrevMonth}>
          <View style={styles.buttonView}>
            <Icon color={"#fff"} size={32} name="navigate-before" />
            <Text style={styles.heading2}>Prev</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextMonth}>
          <View style={styles.buttonView}>
            <Text style={styles.heading2}>Next</Text>
            <Icon color={"#fff"} size={32} name="navigate-next" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.heading1}>Events</Text>
      </View>
      <View>
        {currentEvents &&
          currentEvents?.map((expectation) => {
            return (
              <EventCard
                key={expectation.id}
                data={expectation}
                pastEvent={!!expectation.result}
              />
            );
          })}
      </View>
    </View>
  );
};

export default CalendarView;
