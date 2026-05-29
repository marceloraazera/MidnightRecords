import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 32,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
  },
  link: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    color: "#0a7ea4",
  },
});