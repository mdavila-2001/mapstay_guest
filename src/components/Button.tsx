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

// Color Palette based on MapStay Design System (Dark Mode Preferred)
const COLORS = {
  primaryBg: '#59dad1',       // Sea Green / Teal
  primaryText: '#003734',     // On-Secondary (Dark Teal)
  secondaryBg: '#001f3f',     // Primary Container (Dark Blue)
  secondaryText: '#afc8f0',   // Primary (Light Blue)
  outlineBorder: '#8e9198',   // Outline Grey
  outlineText: '#dae2fd',     // On-Surface (Light Off-white)
  textVariantColor: '#59dad1', // Teal Text
};

// Map of variant text colors to be used dynamically for ActivityIndicator and icons
const TEXT_COLORS = {
  primary: COLORS.primaryText,
  secondary: COLORS.secondaryText,
  outline: COLORS.outlineText,
  text: COLORS.textVariantColor,
};

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * The text to display inside the button.
   */
  text?: string;

  /**
   * The visual style variant of the button.
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'text';

  /**
   * The explicit border radius configuration.
   * @default 'md'
   */
  roundness?: 'sm' | 'md' | 'lg' | 'full';

  /**
   * The size of the button which defines height and typography.
   * @default 'md'
   */
  size?: 'sm' | 'md';

  /**
   * Shows a loading spinner and disables interactions.
   * @default false
   */
  loading?: boolean;

  /**
   * Optional icon component to display on the left side of the text.
   */
  icon?: React.ReactNode;

  /**
   * Optional custom style overrides for the button container.
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Optional custom style overrides for the button text.
   */
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

  // Resolve custom roundness styles
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

  // Resolve custom size styles
  const getSizeStyle = () => {
    return size === 'sm' ? styles.sizeSm : styles.sizeMd;
  };

  // Resolve text size styles
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
  // Base button container layout
  baseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 0,
    borderStyle: 'solid',
  },
  // Variant styles
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
  // Size styles
  md: {
    // Height specification: Minimum 48px to guarantee touch target
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
  // Roundness styles
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
  // Disabled state
  disabled: {
    opacity: 0.5,
  },
  // Content container
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Icon wrapper
  iconWrapper: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Typography base and sizes
  baseText: {
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  labelMd: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
  },
  labelSm: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 14,
  },
});
