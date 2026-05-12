import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Wrong turn" }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.sign}>
          <Text style={styles.signText}>!</Text>
        </View>
        <Text style={styles.title}>Wrong turn.</Text>
        <Text style={styles.subtitle}>
          Sophie can{"\u2019"}t find this screen. Let{"\u2019"}s head back to
          the lesson.
        </Text>
        <Link href="/" style={styles.link} testID="not-found-back">
          <Text style={styles.linkText}>Back to lesson</Text>
        </Link>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: Colors.warmWhite,
    gap: 10,
  },
  sign: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 3,
    borderColor: Colors.black,
  },
  signText: {
    fontSize: 38,
    fontWeight: "900",
    color: Colors.black,
    marginTop: -4,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.black,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
    textAlign: "center",
    marginBottom: 16,
    maxWidth: 280,
    lineHeight: 22,
  },
  link: {
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 22,
    backgroundColor: Colors.black,
    borderRadius: 999,
  },
  linkText: {
    color: Colors.yellow,
    fontWeight: "900",
    fontSize: 15,
  },
});
