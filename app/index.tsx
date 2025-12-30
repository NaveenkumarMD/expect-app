import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import styles from "@/Styles/login.styles";
import { Button, Icon } from "react-native-paper";
import PINInput from "./Components/PINInput";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSQLiteContext } from "expo-sqlite";

const Login = () => {
  const navigation = useRouter();
  const db = useSQLiteContext();
  const [isCompatible, setIsCompatible] = useState<boolean>(false);
  const [pinState, setPinState] = useState<string>("");
  const [fingerPrintsEnrolled, setFingerPrintsEnrolled] =
    useState<boolean>(false);
  useEffect(() => {
    checkDeviceForHardware();
  }, []);
  const checkDeviceForHardware = async () => {
    let compatible = await LocalAuthentication.hasHardwareAsync();
    setIsCompatible(compatible);
    if (compatible) {
      let fingerprints = await LocalAuthentication.isEnrolledAsync();
      setFingerPrintsEnrolled(fingerprints);
    }
  };

  const scanFingerprint = async () => {
    await LocalAuthentication.authenticateAsync().then((res) => {
      if (res.success === true) {
        navigation.replace("/Home");
      }
    });
  };

  function checkPIN() {
    if (pinState === "9715") {
      navigation.replace("/Home");
    }
  }
  function setPIN(pin: string) {
    setPinState(pin);
  }
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={require("../assets/images/adaptive-icon.png")}
          style={{ width: 120, height: 120, borderRadius: 60 }}
        />
      </View>
      <Text style={styles.heading}>Welcome Naveenkumar</Text>
      <PINInput length={4} onComplete={setPIN} />
      <Button
        mode="contained"
        style={styles.secondaryButton}
        labelStyle={styles.primaryButtonLabel}
        onPress={checkPIN}
      >
        Login using PIN
      </Button>
      {isCompatible && fingerPrintsEnrolled && (
        <Button
          mode="contained"
          style={styles.primaryButton}
          labelStyle={styles.primaryButtonLabel}
          onPress={scanFingerprint}
          icon="fingerprint"
        >
          Scan fingerprint
        </Button>
      )}
    </View>
  );
};

export default Login;
