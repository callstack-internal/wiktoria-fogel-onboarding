import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.backgroud,
  },
  listContainer: {
    padding: 16,
  },
  errorWrapper: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  errorInfo: {
    color: COLORS.error,
    fontWeight: 600,
  },
});
