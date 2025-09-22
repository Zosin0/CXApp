import React, { useState } from 'react';
import { TextInput, StyleSheet, Text, View, TextInputProps } from 'react-native';
import { Colors } from '../constants/theme';

interface CaixaInputProps extends TextInputProps {
  label: string;
}

export default function CaixaInput({ label, style, ...props }: CaixaInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused, style]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.WHITE,
    height: 50,
    borderColor: Colors.BORDER,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: Colors.CAIXA_BLUE,
    borderWidth: 2,
    shadowColor: Colors.CAIXA_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
