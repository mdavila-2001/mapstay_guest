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
  containerStyle,
  inputContainerStyle,
}) => {
  const ContainerComponent = onPressContainer ? Pressable : View;

  const getIconColor = () => {
    if (error) return COLORS.errorColor;
    if (focused) return COLORS.borderFocus;
    return COLORS.borderDefault;
  };

  return (
    <View style={[styles.fieldContainer, containerStyle]}>

      {label ? <Text style={styles.label}>{label}</Text> : null}

      <ContainerComponent
        onPress={onPressContainer}
        style={[
          styles.inputWrapper,
          focused && styles.wrapperFocused,
          error ? styles.wrapperError : null,
          inputContainerStyle,
        ]}
      >
        <View
          style={styles.innerRow}
          pointerEvents={onPressContainer ? 'none' : 'auto'}
        >

          {iconName ? (
            <View style={styles.leftIconWrapper}>
              <Ionicons
                name={iconName as any}
                size={20}
                color={getIconColor()}
              />
            </View>
          ) : null}

          {children}

          {rightElement ? (
            <View style={styles.rightIconWrapper}>{rightElement}</View>
          ) : null}
        </View>
      </ContainerComponent>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};
