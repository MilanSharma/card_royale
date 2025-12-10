import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './ThemedText';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  style
}: ButtonProps) {

  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.selectionAsync();
    onPress();
  };

  const getHeight = () => {
    switch(size) {
      case 'sm': return 36;
      case 'lg': return 56;
      default: return 48;
    }
  };

  const height = getHeight();

  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={handlePress}
        disabled={disabled || loading}
        style={[styles.shadow, style]}
      >
        <LinearGradient
          colors={disabled ? [Colors.surface, Colors.surface] : Colors.goldGradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            { height, borderRadius: height / 2 },
            disabled && styles.disabled
          ]}
        >
          {loading ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <ThemedText weight="bold" style={{ color: disabled ? Colors.textDim : Colors.background }}>
              {title}
            </ThemedText>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.base,
        { height, borderRadius: height / 2 },
        variant === 'outline' && styles.outline,
        variant === 'secondary' && styles.secondary,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.text} />
      ) : (
        <ThemedText weight="medium" color={disabled ? Colors.textDim : Colors.text}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  shadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    opacity: 0.8,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  secondary: {
    backgroundColor: Colors.surface,
  },
});
