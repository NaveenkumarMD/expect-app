import styles from "@/Styles/calendarView.styles";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { type Expectation } from "@/Types/index.types";
import EventCard from "./Components/EventCard";
import { useSQLiteContext } from "expo-sqlite";
import { dbUtils } from "@/database";
import moment from "moment";

const today = toDateId(new Date());

const CalendarView = () => {
  const db = useSQLiteContext();
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [currentEvents, setCurrentEvents] = useState<Expectation[]>([]);
  const [eventDates, setEventDates] = useState<string[]>([]); // Stores all dates with events
  const [loading, setLoading] = useState<boolean>(false);

  // Navigate to the previous month
  const goToPrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );
  };

  // Navigate to the next month
  const goToNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
  };

  // Fetch all event dates
  const fetchEventDates = async () => {
    try {
      const allEvents = await dbUtils.getAllExpectations(db);
      const dates = allEvents.map((event) =>
        toDateId(new Date(event.expected_at))
      );
      setEventDates(dates);
    } catch (error) {
      console.error("Error fetching event dates:", error);
    }
  };

  const fetchEventsForDate = async (date: string) => {
    try {
      setLoading(true);
      const dateObj = new Date(date);
      const expectations = await dbUtils.getExpectationsForADay(db, dateObj);
      setCurrentEvents(expectations || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection change
  const onDateChange = (date: string) => {
    setSelectedDate(date);
    fetchEventsForDate(date);
  };

  // Initial fetch for today's events and event dates
  useEffect(() => {
    fetchEventsForDate(selectedDate);
    fetchEventDates();
  }, []);

  const calendarDisabledDateIds = ["2024-09-14", "2024-09-15"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading1}>Calendar View</Text>
      </View>

      {/* Calendar Component */}
      <Calendar
        calendarActiveDateRanges={[
          ...eventDates.map((date) => ({
            startId: date,
            endId: date,
          })),
          {
            startId: selectedDate,
            endId: selectedDate,
          },
        ]}
        calendarDisabledDateIds={calendarDisabledDateIds}
        calendarMonthId={toDateId(currentMonth)}
        onCalendarDayPress={onDateChange}
        calendarCustomStyle={{
          dayText: (date) =>
            date === selectedDate
              ? {
                  color: "#fff",
                  fontWeight: "bold",
                  backgroundColor: "#2E6FF3",
                  borderRadius: 16,
                  padding: 8,
                }
              : undefined,
        }}
      />

      {/* Navigation Buttons */}
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

      {/* Events Header */}
      <View style={styles.header}>
        <Text style={styles.heading1}>Events</Text>
        <Text style={styles.caption2}>
          {moment(selectedDate).format("ddd, Do MMM")}
        </Text>
      </View>

      {/* Events List */}
      <ScrollView>
        {loading ? (
          <View style={styles.noEvents}>
            <ActivityIndicator size={50} />
            <Text style={styles.noEventsText}>Loading events...</Text>
          </View>
        ) : currentEvents.length > 0 ? (
          currentEvents.map((expectation) => (
            <EventCard
              key={expectation.id}
              data={expectation}
              pastEvent={!!expectation.result}
            />
          ))
        ) : (
          <View style={styles.noEvents}>
            <Icon name="event-busy" color="#2B3039" size={100} />
            <Text style={styles.noEventsText}>No events for this date.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CalendarView;
