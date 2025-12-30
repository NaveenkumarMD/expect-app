import * as FileSystem from "expo-file-system/legacy";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { SQLiteDatabase } from "expo-sqlite";
import { dbUtils } from "@/database";
import { Note, type Expectation } from "@/Types/index.types";

const optionsUtils = {
  splitString: "|||",
  split: function (optionString: string) {
    const res = optionString.split(this.splitString);
    return res;
  },
  join: function (optionsArray: string[]) {
    return optionsArray.join(this.splitString);
  },
};

const ENCRYPTION_KEY = "fannymagnet";

// Simple XOR-based encryption (for basic obfuscation)
function encryptData(data: string, key: string): string {
  let encrypted = "";
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(charCode);
  }
  // Convert to base64 for safe storage
  return btoa(encrypted);
}

function decryptData(encryptedData: string, key: string): string {
  try {
    // Decode from base64
    const encrypted = atob(encryptedData);
    let decrypted = "";
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
  } catch (error) {
    throw new Error(
      "Failed to decrypt data. Invalid encryption key or corrupted data."
    );
  }
}

const requestFileWritePermission = async () => {
  const permissions =
    await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
    console.log("File write Permissions Denied!!");
    return {
      access: false,
      directoryUri: null,
    };
  }
  return {
    access: true,
    directoryUri: permissions.directoryUri,
  };
};

async function downloadData(db: SQLiteDatabase) {
  try {
    const data = await dbUtils.getAllExpectations(db);
    const notes = await dbUtils.getSecretNotes(db);
    const finalData = {
      expectations: data,
      notes: notes,
    };
    const jsonData = JSON.stringify(finalData, null, 2);

    // Encrypt the data before saving
    const encryptedData = encryptData(jsonData, ENCRYPTION_KEY);

    const reqPermissionResponse = await requestFileWritePermission();
    if (!reqPermissionResponse.access || !reqPermissionResponse.directoryUri) {
      return Alert.alert("Permissions denied");
    }

    await FileSystem.StorageAccessFramework.createFileAsync(
      reqPermissionResponse.directoryUri,
      "Expectations.enc",
      "application/octet-stream"
    )
      .then(async (uri) => {
        await FileSystem.writeAsStringAsync(uri, encryptedData);
      })
      .then(() => {
        Alert.alert("Success", "Encrypted file saved successfully");
      })
      .catch((e: any) => {
        Alert.alert("Error", `Could not save file: ${e.message}`);
      });
  } catch (error: any) {
    Alert.alert("Error", `Could not Download file ${error?.message}`);
  }
}

async function importData(db: SQLiteDatabase, onSuccess?: () => void) {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      type: "*/*", // Accept both .enc and .json files
    });

    if (!res.assets) {
      return Alert.alert("Error", "Please select a valid file");
    }

    const uri = res.assets[0].uri;
    const fileData = await FileSystem.readAsStringAsync(uri);

    let parsedData: {
      expectations: Expectation[];
      notes: Note[];
    };

    // Try to decrypt first (for .enc files), fallback to plain JSON
    try {
      const decryptedData = decryptData(fileData, ENCRYPTION_KEY);
      parsedData = JSON.parse(decryptedData);
    } catch (decryptError) {
      // If decryption fails, try parsing as plain JSON (backward compatibility)
      try {
        parsedData = JSON.parse(fileData);
      } catch (jsonError) {
        return Alert.alert(
          "Error",
          "Invalid file format. Please select a valid encrypted or JSON file."
        );
      }
    }

    await dbUtils.importData(db, parsedData);
    if (onSuccess) {
      onSuccess();
    }
    Alert.alert("Success", "Data imported successfully");
  } catch (error: any) {
    Alert.alert("Error", `Could not import file: ${error.message}`);
  }
}

export { optionsUtils, downloadData, importData };
