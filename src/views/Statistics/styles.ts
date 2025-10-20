import { StyleSheet } from 'react-native';
import theme from '../../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.roundess,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPaddingSmall: {
    paddingLeft: 2,
  },
  chartAxisLabel: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.small,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  bottomSection: {
    marginBottom: 70,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSizes.heading,
    fontWeight: theme.typography.fontWeights.bold,
    marginBottom: 4,
  },
  text: {
    fontSize: theme.typography.fontSizes.body,
    color: theme.colors.textPrimary,
  },
  bold: {
    fontWeight: theme.typography.fontWeights.bold,
  },
  input: {
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.roundess,
    padding: 8,
    marginVertical: 8,
    color: theme.colors.textPrimary,
  },
  item: {
    fontSize: theme.typography.fontSizes.body,
    marginVertical: 2,
  },
});

export default styles;
