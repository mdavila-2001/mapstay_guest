import { TextInputProps } from 'react-native';

export type InputVariant = 'text' | 'number' | 'password' | 'date' | 'select';

export interface SelectOption {
  label: string;
  value: any;
}

export interface InputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  error?: string;
  variant: InputVariant;
  iconName?: string;
  options?: SelectOption[];
  value?: any;
  onValueChange?: (value: any) => void;
}

export interface BaseInputProps {
  label?: string;
  error?: string;
  focused?: boolean;
  iconName?: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
  onPressContainer?: () => void;
}
