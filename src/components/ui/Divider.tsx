import { View } from 'react-native';
import { cn } from '@/utils/cn';

export interface DividerProps {
  className?: string;
  vertical?: boolean;
}

export function Divider({ className, vertical = false }: DividerProps) {
  return (
    <View
      className={cn(
        'bg-border-subtle',
        vertical ? 'w-px self-stretch' : 'h-px w-full',
        className,
      )}
    />
  );
}
