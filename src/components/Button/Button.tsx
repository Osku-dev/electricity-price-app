import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import theme from '../../theme';

type ButtonProps = {
  label: string;
  onPress?: () => void;
};

export function Button({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: theme.typography.fontSizes.body,
    color: theme.colors.textPrimary,
  },
});
