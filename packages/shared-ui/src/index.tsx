import { Text, View } from "react-native";

export function MyButton() {
  return (
    <View style={{ padding: 10, backgroundColor: "blue", borderRadius: 6 }}>
      <Text style={{ color: "white" }}>Hello from UI Package</Text>
    </View>
  );
}
