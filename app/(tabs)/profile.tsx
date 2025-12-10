import { View, StyleSheet, Image } from 'react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import Colors from '@/constants/colors';
import { useUser } from '@/context/UserContext';

export default function ProfileScreen() {
  const { user } = useUser();

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <ThemedText style={{ fontSize: 40 }}>😎</ThemedText>
          </View>
          <ThemedText variant="h2" weight="bold" style={{ marginTop: 16 }}>{user.username}</ThemedText>
          <ThemedText style={{ color: Colors.primary }}>VIP Level {user.level}</ThemedText>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.stat}>
            <ThemedText variant="label" style={{ color: Colors.textDim }}>Total Chips</ThemedText>
            <ThemedText variant="h2" weight="bold">{user.chips.toLocaleString()}</ThemedText>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <ThemedText variant="label" style={{ color: Colors.textDim }}>XP</ThemedText>
            <ThemedText variant="h2" weight="bold">{user.xp.toLocaleString()}</ThemedText>
          </View>
        </View>

        <View style={styles.menu}>
          <MenuItem title="Edit Profile" />
          <MenuItem title="Settings" />
          <MenuItem title="Support" />
          <MenuItem title="Logout" danger />
        </View>
      </View>
    </ScreenContainer>
  );
}

function MenuItem({ title, danger }: { title: string, danger?: boolean }) {
  return (
    <View style={styles.menuItem}>
      <ThemedText style={{ color: danger ? Colors.error : Colors.text }}>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  menu: {
    gap: 12,
  },
  menuItem: {
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
});
