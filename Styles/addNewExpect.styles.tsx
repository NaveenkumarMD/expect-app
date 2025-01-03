import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  removeIcon: {
    position: "absolute",
    right: 2,
    top: "20%",
    // transform: [{ translateY: -12 }],
    backgroundColor: "#333D4D",
    padding: 4,
    borderRadius: 4,
    height: 40,
    width: 50,
  },
  container: {
    backgroundColor: "#232528",
    paddingTop: 40,
    paddingLeft: 20,
    height: "100%",
    flex: 1,
  },
  heading: {
    fontSize: 18,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "800",
  },
  heading1: {
    fontSize: 16,
    marginVertical: 16,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "800",
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
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    color: "white",
  },
  secondaryButtonLabel: {
    color: "#7D8A95",
  },
  primaryButton: {
    backgroundColor: "#2E6FF3",
    padding: 8,
    marginTop: 32,
    marginBottom: 32,
  },
  primaryButtonLabel: {
    color: "white",
    fontSize: 16,
  },
});

export default styles;
