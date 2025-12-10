import { View, ViewProps, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import React from "react";

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  center?: boolean;
}

export function ScreenContainer({ children, style, center, ...props }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <LinearGradient
      colors={Colors.darkGradient as any}
      style={[styles.container, style]}
      {...props}
    >
      <View style={[
        styles.content, 
        { paddingTop: insets.top, paddingBottom: insets.bottom },
        center && styles.center
      ]}>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
