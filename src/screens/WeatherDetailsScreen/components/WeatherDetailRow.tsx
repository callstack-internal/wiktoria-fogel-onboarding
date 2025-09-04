import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants/colors';

type WetherDatilRowProps = {
  label: string;
  value: string;
};

export const WetherDatilRow = ({ label, value }: WetherDatilRowProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{label}</Text>
      <Text style={styles.info}>{value}</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  info: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.secondaryText,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
});
