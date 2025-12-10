import { Text, TextProps, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  weight?: 'regular' | 'medium' | 'bold';
}

export function ThemedText({ 
  style, 
  variant = 'body', 
  color = Colors.text, 
  weight = 'regular',
  ...props 
}: ThemedTextProps) {
  
  return (
    <Text 
      style={[
        { color },
        styles[variant],
        styles[weight],
        style
      ]} 
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.textDim,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
  },
});
