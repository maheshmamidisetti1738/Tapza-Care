import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export function AnimateInView({
  play,
  children,
}: {
  play: boolean;
  children: ReactNode;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (play) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [play, progress]);

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [28, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
