import React from 'react';
import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import theme from '../../theme';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Card({ children, onPress, style }: CardProps) {
  const isPressable = Boolean(onPress);
  const Container = isPressable ? Pressable : View;

  return (
    <Container
      {...(isPressable ? { onPress } : {})}
      style={
        isPressable
          ? ({ pressed }) => [styles.card, style, pressed && styles.cardPressed]
          : [styles.card, style]
      }
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
