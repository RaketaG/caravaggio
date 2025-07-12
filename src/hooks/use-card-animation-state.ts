import { useState } from 'react';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { CardDataType } from '../components/card-swipe-view';

export const useCardAnimationState = (
  initialX: number,
  cardData: CardDataType,
) => {
  const [data, setData] = useState<CardDataType>(cardData);
  const translateX = useSharedValue(initialX);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  return { data, setData, translateX, animatedStyle };
};
