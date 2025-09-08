import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/colors';

type EmptyComponentListProps = {
  title: string;
};

export const EmptyComponentList = ({ title }: EmptyComponentListProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.info}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 10,
    marginTop: 4,
    alignItems: 'center',
  },
  info: {
    color: COLORS.secondaryText,
    fontWeight: 600,
  },
});
