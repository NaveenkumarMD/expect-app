import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  avatarContainer: {
    marginTop: 32,
    marginBottom: 32,
    width: 120,
    height: 120,
    borderRadius: "50%",
    backgroundColor: "#2E6FF3",
    textAlign: "center",
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  container: {
    backgroundColor: "#232528",
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    height: "100%",
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "800",
    marginTop: "10%",
    textAlign: "center",
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

  primaryButton: {
    backgroundColor: "#2E6FF3",
    padding: 8,
    marginTop: 32,
    marginBottom: 32,
  },
  secondaryButton: {
    backgroundColor: "#555C6B",
    padding: 8,
    marginTop: 32,
    marginBottom: 32,
  },
  primaryButtonLabel: {
    color: "white",
    fontSize: 16,
  },
  option: {
    backgroundColor: "#333D4D",
    borderRadius: 8,
    color: "white",
    paddingLeft: 16,
    padding: 20,
    marginTop: 20,
  },
  optionText: {
    fontSize: 16,
    fontFamily: '"Open Sans", sans-serif',
    color: "#fff",
    fontWeight: "600",
  },
});

export default styles;
