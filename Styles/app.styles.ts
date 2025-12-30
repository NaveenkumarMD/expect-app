import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 24,
    right: 0,
    bottom: 0,
    borderRadius: 50, // Use a number for border radius, not a string
    backgroundColor: "#2E6FF3",
  },
  primaryButton: {
    backgroundColor: "#2E6FF3",
    borderRadius: 8,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  primaryButtonLabel: {
    color: "white",
    fontSize: 16,
  },
  notes: {
    position: "absolute",
    margin: 24,
    right: 80,
    bottom: 0,
    borderRadius: 50, // Use a number for border radius, not a string
    backgroundColor: "#2E6FF3",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 24,
    justifyContent: "space-between",
  },
  container: {
    backgroundColor: "#232528",
    flex: 1, // Ensure the container takes full screen height
    paddingTop: 30,
    paddingLeft: 20,
    paddingRight: 20,
  },
  input: {
    borderWidth: 2,
    backgroundColor: "#333D4D",
    borderColor: "#333D4D",
    borderRadius: 8,
    color: "white",
    height: 56,
    fontSize: 16,
    paddingLeft: 16,
  },
  inputnotes: {
    borderWidth: 2,
    backgroundColor: "#333D4D",
    borderColor: "#333D4D",
    borderRadius: 8,
    color: "white",
    minHeight: 100,
    fontSize: 16,
    paddingLeft: 16,
  },
  notelistItem: {
    backgroundColor: "#333D4D",
    padding: 16,
  },
  heading1: {
    fontSize: 18,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "800",
  },
  heading11: {
    fontSize: 20,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "800",
  },
  text1: {
    color: "#F1F4F6",
    fontSize: 14,
    fontWeight: "semibold",
    fontFamily: '"Open Sans", sans-serif',
    padding: 2,
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
