import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import styles from "@/Styles/app.styles";
import { Button, FAB } from "react-native-paper";
import React, { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { dbUtils } from "@/database";
import CreatableSelect from "./Components/CreatableSelect";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NoteItem from "./Components/NoteItem";

interface Note {
  id: number | null;
  category: string;
  notes: string;
  isDone?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

function SecretNotes() {
  const db = useSQLiteContext();
  const [addViewVisible, setAddViewVisible] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [noteText, setNoteText] = useState<string>("");
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [swipedNoteId, setSwipedNoteId] = useState<number | null>(null);

  const [categories, setCategories] = useState<string[]>([
    "Personal",
    "Work",
    "Ideas",
    "Passwords",
  ]);

  const handleCreateCategory = (newCategory: string) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  async function fetchNotes() {
    try {
      const data = await dbUtils.getSecretNotes(db);
      setNotes(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (!selectedCategory || !noteText) {
      Alert.alert("Error", "Please select a category and enter a note");
      return;
    }
    await dbUtils.addNewNote(db, {
      category: selectedCategory,
      notes: noteText,
    });
    setAddViewVisible(false);
    setNoteText("");
    fetchNotes();
  };
  const handleDeleteNote = async (id: number) => {
    await dbUtils.deleteNote(db, id);
    fetchNotes();
  };

  const handleMarkAsDone = async (id: number, isDone: boolean) => {
    await dbUtils.markNoteAsDone(db, id, isDone);
    fetchNotes();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, height: "100%" }}>
        <ScrollView>
          <SafeAreaView style={styles.container}>
            {addViewVisible && (
              <>
                <View style={styles.header}>
                  <Text style={styles.heading1}>Add new Notes</Text>
                </View>

                <View>
                  <CreatableSelect
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    options={categories}
                    onCreateOption={handleCreateCategory}
                    placeholder="Category"
                    inputStyle={styles.input}
                  />
                  <View style={{ height: 16 }}></View>
                  <TextInput
                    onChangeText={(text: string) => setNoteText(text)}
                    value={noteText}
                    multiline={true}
                    numberOfLines={4}
                    style={styles.inputnotes}
                    placeholder="Notes"
                    placeholderTextColor="#fff"
                  />
                </View>
                <View style={{ height: 16 }}></View>
                <Button
                  mode="contained"
                  style={styles.primaryButton}
                  labelStyle={styles.primaryButtonLabel}
                  onPress={() => {
                    handleAddNote();
                  }}
                >
                  Submit
                </Button>
              </>
            )}
            <View style={styles.header}>
              <Text style={styles.heading11}>Secret Notes</Text>
            </View>
            <View>
              {Object.entries(
                notes.reduce((acc, note) => {
                  if (!acc[note.category]) {
                    acc[note.category] = [];
                  }
                  acc[note.category].push(note);
                  return acc;
                }, {} as Record<string, Note[]>)
              ).map(([category, categoryNotes]) => (
                <View key={category}>
                  <Text style={styles.heading1}>{category}</Text>
                  <View style={{ height: 16 }}></View>

                  {categoryNotes.map((note, index) => (
                    <NoteItem
                      key={`${category}-${index}`}
                      note={note}
                      isExpanded={expandedNoteId === note.id}
                      isSwiped={swipedNoteId === note.id}
                      onToggleExpand={() =>
                        setExpandedNoteId(
                          expandedNoteId === note.id ? null : note.id || null
                        )
                      }
                      onMarkAsDone={handleMarkAsDone}
                      onDelete={handleDeleteNote}
                      onSwipeOpen={() => setSwipedNoteId(note.id)}
                      onSwipeClose={() => setSwipedNoteId(null)}
                    />
                  ))}
                </View>
              ))}
            </View>
          </SafeAreaView>
        </ScrollView>

        <FAB
          icon="plus"
          color="#fff"
          style={styles.fab}
          onPress={() => setAddViewVisible(true)}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default SecretNotes;
