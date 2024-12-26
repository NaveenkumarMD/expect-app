import { dbUtils } from "@/database";
import { Expectation } from "@/Types/index.types";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 150,
    backgroundColor: "#2E6FF3",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 42,
  },
  heading1: {
    fontSize: 14,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10,
  },
  text1: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "semibold",
    fontFamily: '"Open Sans", sans-serif',
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    width: "auto",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 4,
  },
  timeContainer: {
    display: "flex",
    flexDirection: "row",
    width: "auto",
    justifyContent: "flex-start",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  loaderContainer: {
    marginLeft: "6%",
  },
});

const props = {
  activeStrokeWidth: 25,
  inActiveStrokeWidth: 25,
  inActiveStrokeOpacity: 0.2,
};

interface result {
  disappointmentCount: number;
  total: number;
  percentage: number;
  expectedResult: number;
}
const defaultResult = {
  disappointmentCount: 0,
  total: 0,
  percentage: 0,
  expectedResult: 0,
};

const MainInfoCard = () => {
  const db = useSQLiteContext();
  const [expectations, setExpectations] = useState<Expectation[]>();
  const [result, setResult] = useState<result>(defaultResult);
  const data = {
    labels: ["Swim", "Bike", "Run"], // optional
    data: [0.4, 0.6, 0.8],
  };
  async function fetchData() {
    const data = await dbUtils.getAllExpectations(db);
    if (!data) return;
    let disAppointedCount = 0;
    let total = 0;
    let expectedResult = 0;
    let percentage = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].result) {
        total++;
        disAppointedCount += data[i].isDisappointed ? 1 : 0;
        expectedResult += data[i].resultPercentage === 1 ? 1 : 0;
        percentage += data[i].resultPercentage ?? 0;
      }
    }
    percentage = total > 0 ? percentage / total : 0;
    const resObj = {
      disappointmentCount: disAppointedCount,
      total: total,
      percentage: Number(percentage.toFixed(2)),
      expectedResult: expectedResult,
    };
    console.log(resObj);
    setResult(resObj);
  }
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        <CircularProgress
          value={result.percentage * 100}
          radius={50}
          inActiveStrokeColor={"#fff"}
          inActiveStrokeOpacity={0.15}
          progressValueColor={"#fff"}
          activeStrokeWidth={8}
          activeStrokeColor="white"
          valueSuffix={"%"}
        />
      </View>
      <View>
        <Text style={styles.heading1}>{result.total} | Total </Text>
        <Text style={styles.heading1}>
          {result.expectedResult} | Expected Result
        </Text>
        {/* <Text style={styles.heading1}>
          {result.percentage} | Result Percentage
        </Text> */}
        <Text style={styles.heading1}>
          {result.disappointmentCount} | Disappointment
        </Text>
        <View></View>
      </View>
    </View>
  );
};

export default MainInfoCard;
