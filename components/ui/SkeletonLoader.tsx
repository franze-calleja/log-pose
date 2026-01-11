import { useEffect, useRef } from 'react';
import { Animated, View, type DimensionValue } from 'react-native';

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  className?: string;
}

export function SkeletonLoader({ 
  width = '100%', 
  height = 16,
  className = ''
}: SkeletonLoaderProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={{ width, height }} className={`bg-gray-300 rounded ${className}`}>
      <Animated.View 
        style={{ 
          width: '100%', 
          height: '100%', 
          opacity,
          backgroundColor: '#d1d5db'
        }} 
      />
    </View>
  );
}
