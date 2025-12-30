import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface CreatableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: string[];
  onCreateOption: (newOption: string) => void;
  placeholder?: string;
  inputStyle?: any;
}

const CreatableSelect: React.FC<CreatableSelectProps> = ({
  value,
  onValueChange,
  options,
  onCreateOption,
  placeholder = "Select or create...",
  inputStyle,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    onValueChange(text);
    setShowDropdown(true);
  };

  const handleSelectOption = (option: string) => {
    setInputValue(option);
    onValueChange(option);
    setShowDropdown(false);
  };

  const handleCreateOption = () => {
    if (inputValue && !options.includes(inputValue)) {
      onCreateOption(inputValue);
    }
    setShowDropdown(false);
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#fff"
        value={inputValue}
        onChangeText={handleInputChange}
        onFocus={() => setShowDropdown(true)}
      />
      {showDropdown && inputValue && (
        <View style={styles.dropdown}>
          <ScrollView nestedScrollEnabled={true}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectOption(option)}
                >
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateOption}
              >
                <Text style={styles.createButtonText}>
                  + Create "{inputValue}"
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
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
  dropdown: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "#333D4D",
    borderRadius: 8,
    maxHeight: 200,
    borderWidth: 2,
    borderColor: "#2E6FF3",
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#232528",
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 16,
  },
  createButton: {
    padding: 16,
    backgroundColor: "#2E6FF3",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CreatableSelect;

