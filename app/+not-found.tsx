import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';

export default function NotFoundScreen() {
  return (
    <ScreenContainer center>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <ThemedText variant="h1" weight="bold" style={{ marginBottom: 16 }}>404</ThemedText>
        <ThemedText style={{ marginBottom: 32, textAlign: 'center' }}>
          This screen doesn&apos;t exist.
        </ThemedText>
        
        <Link href="/" asChild>
          <Button title="Go to Home" onPress={() => {}} />
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
