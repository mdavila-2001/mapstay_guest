import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { TYPOGRAPHY } from '../core/theme/theme';

const COLORS = {
  primaryBg: '#59dad1',
  primaryText: '#003734',
  secondaryBg: '#001f3f',
  secondaryText: '#afc8f0',
  outlineBorder: '#8e9198',
  outlineText: '#dae2fd',
  textVariantColor: '#59dad1',
};

const TEXT_COLORS = {
  primary: COLORS.primaryText,
  secondary: COLORS.secondaryText,
  outline: COLORS.outlineText,
  text: COLORS.textVariantColor,
};

export interface ButtonProps extends TouchableOpacityProps {

  text?: string;

  variant?: 'primary' | 'secondary' | 'outline' | 'text';

  roundness?: 'sm' | 'md' | 'lg' | 'full';

  size?: 'sm' | 'md';

  loading?: boolean;

  icon?: React.ReactNode;

  style?: StyleProp<ViewStyle>;

  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  variant = 'primary',
  roundness = 'md',
  size = 'md',
  loading = false,
  icon,
  disabled,
  style,
  textStyle,
  ...rest
}) => {
  const isButtonDisabled = disabled || loading;
  const textColor = TEXT_COLORS[variant];

  const getRoundnessStyle = () => {
    switch (roundness) {
      case 'sm':
        return styles.roundnessSm;
      case 'lg':
        return styles.roundnessLg;
      case 'full':
        return styles.roundnessFull;
      case 'md':
      default:
        return styles.roundnessMd;
    }
  };

  const getSizeStyle = () => {
    return size === 'sm' ? styles.sizeSm : styles.sizeMd;
  };

  const getTextSizeStyle = () => {
    return size === 'sm' ? styles.labelSm : styles.labelMd;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isButtonDisabled}
      style={[
        styles.baseButton,
        styles[variant],
        getRoundnessStyle(),
        getSizeStyle(),
        isButtonDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isButtonDisabled, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
          {text ? (
            <Text
              style={[
                styles.baseText,
                { color: textColor },
                getTextSizeStyle(),
                textStyle,
              ]}
            >
              {text}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

  baseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 0,
    borderStyle: 'solid',
  },

  primary: {
    backgroundColor: COLORS.primaryBg,
  },
  secondary: {
    backgroundColor: COLORS.secondaryBg,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.outlineBorder,
  },
  text: {
    backgroundColor: 'transparent',
  },

  md: {

    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  sizeMd: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  sizeSm: {
    minHeight: 38,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  roundnessSm: {
    borderRadius: 4,
  },
  roundnessMd: {
    borderRadius: 12,
  },
  roundnessLg: {
    borderRadius: 16,
  },
  roundnessFull: {
    borderRadius: 9999,
  },

  disabled: {
    opacity: 0.5,
  },

  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapper: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  baseText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    textAlign: 'center',
  },
  labelMd: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: '500',
    lineHeight: 16,
  },
  labelSm: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: '500',
    lineHeight: 14,
  },
});

