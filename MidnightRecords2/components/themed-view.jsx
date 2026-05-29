import { View } from "react-native";

export function ThemedView({ style, ...otherProps }) {
  return <View style={style} {...otherProps} />;
}
