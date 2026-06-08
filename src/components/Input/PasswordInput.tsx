import React, { useState } from 'react';
import { TextInput as RNTextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseInput } from './BaseInput';
import { InputProps } from './types';
import { styles, COLORS } from './styles';

export const PasswordInput: React.FC<InputProps> = ({
  label,
  error,
  iconName,
  value,
  onValueChange,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(true);

  const handleFocus = (e: any) => {
    setFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: any) => {
    setFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleChangeText = (text: string) => {
    if (onValueChange) {
      onValueChange(text);
    }
  };

  const toggleSecureEntry = () => {
    setSecure((prev) => !prev);
  };

  // Right-aligned eye toggle button
  const rightElement = (
    <Pressable onPress={toggleSecureEntry} hitSlop={12}>
      <Ionicons
        name={secure ? 'eye-off-outline' : 'eye-outline'}
        size={20}
        color={error ? COLORS.errorColor : COLORS.borderDefault}
      />
    </Pressable>
  );

  return (
    <BaseInput
      label={label}
      error={error}
      focused={focused}
      iconName={iconName}
      rightElement={rightElement}
    >
      <RNTextInput
        style={styles.inputControl}
        placeholderTextColor={COLORS.placeholderColor}
        value={value ?? ''}
        onChangeText={handleChangeText}
        secureTextEntry={secure}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
    </BaseInput>
  );
};
