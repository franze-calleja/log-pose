import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

interface FabProps extends TouchableOpacityProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
}

export function Fab({ 
  icon = 'camera', 
  iconSize = 28, 
  iconColor = 'white',
  className,
  ...props 
}: FabProps) {
  return (
    <TouchableOpacity
      className={`absolute bottom-6 right-6 bg-blue-500 rounded-full w-16 h-16 items-center justify-center shadow-xl ${className}`}
      activeOpacity={0.8}
      {...props}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}
