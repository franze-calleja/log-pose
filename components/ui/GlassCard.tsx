import { View, type ViewProps } from 'react-native';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <View
      className={`bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
