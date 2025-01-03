import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  noEvents: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  noEventsText: {
    fontSize: 18,
    fontFamily: '"Open Sans", sans-serif',
    color: "#7D8A95",
    fontWeight: "400",
  },
  fab: {
    position: "absolute",
    margin: 24,
    right: 0,
    bottom: 0,
    borderRadius: 50, // Use a number for border radius, not a string
    backgroundColor: "#2E6FF3",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 32,
    justifyContent: "space-between",
  },
  container: {
    backgroundColor: "#232528",
    flex: 1, // Ensure the container takes full screen height
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 16,
  },
  buttonView: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  heading1: {
    fontSize: 18,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "700",
  },
  heading2: {
    fontSize: 16,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 16,
    justifyContent: "space-between",
  },
  caption2: {
    color: "#7D8A95",
    fontSize: 16,
    fontFamily: '"Open Sans", sans-serif',
  },
});

export default styles;
