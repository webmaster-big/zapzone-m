import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input, type InputProps } from '@/components/ui/Input';

export interface ControlledInputProps<T extends FieldValues> extends Omit<InputProps, 'value' | 'onChangeText'> {
  control: Control<T>;
  name: Path<T>;
}

/** React Hook Form bound text input that surfaces field-level validation errors. */
export function ControlledInput<T extends FieldValues>({
  control,
  name,
  ...inputProps
}: ControlledInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          value={value != null ? String(value) : ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...inputProps}
        />
      )}
    />
  );
}
