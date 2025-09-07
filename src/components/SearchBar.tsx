import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { STRINGS } from '../constants/strings';
import { COLORS } from '../constants/colors';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export const SearchBar = ({
  value,
  onChangeText,
  placeholder,
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || STRINGS.LABELS.searchBarPlaceholder}
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize={'none'}
        clearButtonMode={'while-editing'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});
