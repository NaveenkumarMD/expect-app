import React from "react";
import moment from "moment";
import { Expectation } from "@/Types/index.types";
import { optionsUtils } from "@/utils";
import { Link, RelativePathString } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { Button, Avatar } from "react-native-paper";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "@/Styles/eventCard.styles";

export const CardButton = ({ href, text }) => {
  return (
    <Link href={href} asChild>
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        {text}
      </Button>
    </Link>
  );
};

interface EventCardProps {
  data: Expectation;
  pastEvent: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ data, pastEvent }) => {
  const dateObj: Date = new Date(data.created_at);
  const dateString: string = moment(dateObj).format("ddd, Do MMM");
  const timeString: string = moment(dateObj).format("h:mm A");

  return (
    <View style={styles.container}>
      <View style={styles.dataContainer}>
        <Avatar.Icon
          style={{ backgroundColor: "#2E6FF3" }}
          size={40}
          icon="alarm-light"
        />
        <View>
          <Text style={styles.title}>{data?.title ?? ""}</Text>

          <View style={styles.optionsContainer}>
            {optionsUtils
              .split(data?.options ?? "")
              .map((option: string, idx: number) => {
                if (
                  idx ===
                  optionsUtils.split(data?.options ?? "").length - 1
                ) {
                  return (
                    <React.Fragment key={option}>
                      <Text style={styles.options}>{option ?? ""}</Text>
                    </React.Fragment>
                  );
                }
                return (
                  <React.Fragment key={option}>
                    <Text style={styles.options}>{option ?? ""}</Text>
                    <View style={styles.separator}></View>
                  </React.Fragment>
                );
              })}
          </View>
          <View style={{ ...styles.timeContainer, marginTop: 8 }}>
            <View style={{ ...styles.grid, marginRight: 32 }}>
              <FeatherIcon name="calendar" color="#7D8A95" />
              <Text style={styles.text1}>{dateString}</Text>
            </View>
            <View style={styles.grid}>
              <MaterialIcon name="clock-time-three-outline" color="#7D8A95" />
              <Text style={styles.text1}>{timeString}</Text>
            </View>
          </View>
        </View>
      </View>
      <CardButton
        text={pastEvent ? "View" : "Update"}
        href={{
          pathname: "/FillExpectation",
          params: { id: data.id },
        }}
      />
    </View>
  );
};

export default EventCard;
