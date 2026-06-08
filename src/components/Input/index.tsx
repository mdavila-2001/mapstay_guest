import React from 'react';
import { TextInput } from './TextInput';
import { PasswordInput } from './PasswordInput';
import { DateInput } from './DateInput';
import { SelectInput } from './SelectInput';
import { InputProps } from './types';

export const Input: React.FC<InputProps> = (props) => {
  const { variant } = props;

  switch (variant) {
    case 'text':
    case 'number':
      return <TextInput {...props} />;
    case 'password':
      return <PasswordInput {...props} />;
    case 'date':
      return <DateInput {...props} />;
    case 'select':
      return <SelectInput {...props} />;
    default:
      return <TextInput {...props} variant="text" />;
  }
};

export { InputProps, SelectOption } from './types';
export default Input;
