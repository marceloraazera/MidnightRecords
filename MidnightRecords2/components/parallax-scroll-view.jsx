import { StyleSheet, useColorScheme } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";

const HEADER_HEIGHT = 250;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}) {
  const colorScheme = useColorScheme() ?? "light";
  const backgroundColor = colorScheme === "dark" ? "#151718" : "#ffffff";
  const { bottom } = useSafeAreaInsets();

  const headerBackground = headerBackgroundColor?.[colorScheme] ?? backgroundColor;

  const scrollRef = useAnimatedRef();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}
      scrollIndicatorInsets={{ bottom }}
      contentContainerStyle={{ paddingBottom: bottom }}
      bounces={false}
      overScrollMode="never"
    >
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackground },
          headerAnimatedStyle,
        ]}
      >
        {headerImage}
      </Animated.View>

      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});
