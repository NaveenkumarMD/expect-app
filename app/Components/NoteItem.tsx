import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Button, IconButton } from "react-native-paper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import moment from "moment";
import styles from "@/Styles/app.styles";

interface Note {
  id: number | null;
  category: string;
  notes: string;
  isDone?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

interface NoteItemProps {
  note: Note;
  isExpanded: boolean;
  isSwiped: boolean;
  onToggleExpand: () => void;
  onMarkAsDone: (id: number, isDone: boolean) => void;
  onDelete: (id: number) => void;
  onSwipeOpen: () => void;
  onSwipeClose: () => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  isExpanded,
  isSwiped,
  onToggleExpand,
  onMarkAsDone,
  onDelete,
  onSwipeOpen,
  onSwipeClose,
}) => {
  const renderLeftActions = () => {
    return (
      <View
        style={{
          width: 80,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ff4444",

          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        }}
      >
        <IconButton
          icon="delete"
          iconColor="#fff"
          size={24}
          onPress={() => {
            if (note.id) {
              Alert.alert(
                "Delete Note",
                "Are you sure you want to delete this note?",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete(note.id!),
                  },
                ]
              );
            }
          }}
          style={{
            margin: 0,
          }}
        />
      </View>
    );
  };

  const renderRightActions = () => {
    const isDone = note.isDone || false;
    return (
      <View
        style={{
          width: 60,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDone ? "#ff9800" : "#4caf50",

          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <IconButton
          icon={isDone ? "close-circle" : "check-circle"}
          iconColor="#fff"
          size={24}
          onPress={() => {
            if (note.id) {
              onMarkAsDone(note.id, !isDone);
            }
          }}
          style={{
            margin: 0,
          }}
        />
      </View>
    );
  };

  return (
    <>
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableOpen={onSwipeOpen}
        onSwipeableClose={onSwipeClose}
      >
        <TouchableOpacity onPress={onToggleExpand} activeOpacity={0.7}>
          <View
            style={[
              styles.notelistItem,
              {
                flexDirection: "column",
                borderTopLeftRadius: isSwiped ? 0 : 8,
                borderTopRightRadius: isSwiped ? 0 : 8,
                borderBottomRightRadius: isSwiped ? 0 : 8,
                borderBottomLeftRadius: isSwiped ? 0 : 8,
              },
            ]}
          >
            {/* Header Row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {note.isDone && (
                <View style={{ marginRight: 18, width: 20, height: 20 }}>
                  <IconButton
                    icon="check-circle"
                    iconColor="#4caf50"
                    size={20}
                    style={{ margin: 0, marginRight: 18, marginTop: -8 }}
                  />
                </View>
              )}
              <Text
                style={[styles.text1, { flex: 1 }]}
                numberOfLines={isExpanded ? undefined : 1}
              >
                {note.notes}
              </Text>
            </View>

            {/* Expanded Content */}
            {isExpanded && (
              <View style={{ marginTop: 12 }}>
                {/* Created Date */}
                {note.createdAt && (
                  <Text style={[styles.text1, { fontSize: 12, opacity: 0.7 }]}>
                    Created:{" "}
                    {moment(note.createdAt).format("MMM DD, YYYY hh:mm A")}
                  </Text>
                )}

                {/* Action Buttons */}
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 12,
                    gap: 8,
                  }}
                >
                  <Button
                    mode="contained"
                    icon={note.isDone ? "close-circle" : "check-circle"}
                    onPress={() => {
                      if (note.id) {
                        onMarkAsDone(note.id, !note.isDone);
                      }
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: note.isDone ? "#ff9800" : "#4caf50",
                    }}
                    // labelStyle={{ fontSize: 12 }}
                  >
                    {note.isDone ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                  <Button
                    mode="contained"
                    icon="delete"
                    onPress={() => {
                      if (note.id) {
                        Alert.alert(
                          "Delete Note",
                          "Are you sure you want to delete this note?",
                          [
                            {
                              text: "Cancel",
                              style: "cancel",
                            },
                            {
                              text: "Delete",
                              style: "destructive",
                              onPress: () => onDelete(note.id!),
                            },
                          ]
                        );
                      }
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: "#ff4444",
                    }}
                    // labelStyle={{ fontSize: 12 }}
                  >
                    Delete
                  </Button>
                </View>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Swipeable>
      <View style={{ height: 16 }}></View>
    </>
  );
};

export default NoteItem;
