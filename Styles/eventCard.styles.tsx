import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#2B3037",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  text1: {
    color: "#F1F4F6",
    fontSize: 14,
    fontWeight: "semibold",
    fontFamily: '"Open Sans", sans-serif',
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 4,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#555C6B",
    borderRadius: 32,
    height: 40,
    width: "100%",
  },
  buttonLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    fontFamily: '"Open Sans", sans-serif',
  },
  dataContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: '"Open Sans", sans-serif',
  },
  options: {
    color: "#AAB6C3",
    fontFamily: '"Open Sans", sans-serif',
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  separator: {
    height: 12,
    borderLeftColor: "#AAB6C3",
    borderLeftWidth: 1,
  },
});

export default styles;
