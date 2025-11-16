import { StyleSheet } from 'react-native';
import theme from 'theme';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.body,
  },

  axisText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.small,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    marginTop: 40,
  },

  backButtonWrapper: {
    position: 'absolute',
    left: 8,
  },

  spacer: {
    width: 12,
  },

  chartCard: {
    padding: 8,
    backgroundColor: theme.colors.background,
  },

  highlightCard: {
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
