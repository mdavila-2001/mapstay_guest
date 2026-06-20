import React, { useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { BaseInput } from './BaseInput';
import { InputProps } from './types';
import { styles, COLORS } from './styles';

export const TextInput: React.FC<InputProps> = ({
  label,
  error,
  variant,
  iconName,
  value,
  onValueChange,
  onFocus,
  onBlur,
  style,
  containerStyle,
  inputContainerStyle,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);

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

  return (
    <BaseInput
      label={label}
      error={error}
      focused={focused}
      iconName={iconName}
      containerStyle={containerStyle}
      inputContainerStyle={inputContainerStyle}
    >
      <RNTextInput
        style={[styles.inputControl, style]}
        placeholderTextColor={COLORS.placeholderColor}
        value={value ?? ''}
        onChangeText={handleChangeText}
        keyboardType={variant === 'number' ? 'numeric' : 'default'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
    </BaseInput>
  );
};
