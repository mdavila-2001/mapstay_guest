import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseInputProps } from './types';
import { styles, COLORS } from './styles';

export const BaseInput: React.FC<BaseInputProps> = ({
  label,
  error,
  focused,
  iconName,
  children,
  rightElement,
  onPressContainer,
}) => {
  const ContainerComponent = onPressContainer ? Pressable : View;

  // Resolve left icon color based on error or focus state
  const getIconColor = () => {
    if (error) return COLORS.errorColor;
    if (focused) return COLORS.borderFocus;
    return COLORS.borderDefault;
  };

  return (
    <View style={styles.fieldContainer}>
      {/* Top Label (label-sm) */}
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Input Outer Wrapper Box */}
      <ContainerComponent
        onPress={onPressContainer}
        style={[
          styles.inputWrapper,
          focused && styles.wrapperFocused,
          error ? styles.wrapperError : null,
        ]}
      >
        <View
          style={styles.innerRow}
          pointerEvents={onPressContainer ? 'none' : 'auto'}
        >
          {/* Left Icon (Decorative) */}
          {iconName ? (
            <View style={styles.leftIconWrapper}>
              <Ionicons
                name={iconName as any}
                size={20}
                color={getIconColor()}
              />
            </View>
          ) : null}

          {/* Dynamic Nested Control */}
          {children}

          {/* Right Element (Toggle buttons, arrows, etc.) */}
          {rightElement ? (
            <View style={styles.rightIconWrapper}>{rightElement}</View>
          ) : null}
        </View>
      </ContainerComponent>

      {/* Error Message (error text) */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
