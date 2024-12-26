// OtpInput.js
import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { TextInput as RNTextInput } from "react-native";

const PINInput = ({
  length = 6,
  onComplete,
}: {
  length: number;
  onComplete: Function;
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<(RNTextInput | null)[]>([]);

  const focusNext = (index: number) => {
    if (index < length - 1 && inputs.current[index + 1]) {
      inputs.current[index + 1]!.focus();
    }
  };

  const focusPrev = (index: number) => {
    if (index > 0 && inputs.current[index - 1]) {
      inputs.current[index - 1]!.focus();
    }
  };

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text) {
      focusNext(index);
    }

    if (newOtp.every((val) => val !== "") && onComplete) {
      onComplete(newOtp.join(""));
    }
  };

  const handleKeyPress = (
    { nativeEvent: { key } }: { nativeEvent: { key: string } },
    index: number
  ) => {
    if (key === "Backspace" && !otp[index]) {
      focusPrev(index);
    }
  };

  return (
    <View style={styles.container}>
      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          style={[
            styles.input,
            { marginHorizontal: index !== 0 || index !== length - 1 ? 10 : 0 },
          ]}
          keyboardType="numeric"
          maxLength={1}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          value={value}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 50,
    marginTop: 90,
  },
  input: {
    borderBottomWidth: 2,
    paddingBottom: 10,
    borderBottomColor: "#fff",
    color: "white",
    fontWeight: 800,
    width: 40,
    textAlign: "center",
    fontSize: 20,
  },
});

export default PINInput;
