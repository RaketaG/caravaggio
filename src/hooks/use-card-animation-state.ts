import { useState } from 'react';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { CardDataType } from '../components/card-swipe-view';

export const useCardAnimationState = (
  initialX: number,
  cardData: CardDataType,
) => {
  const [data, setData] = useState<CardDataType>(cardData);
  const translateX = useSharedValue(initialX);
  const scale = useSharedValue(1);
  const pressedColor = useSharedValue('#00000000');
  const fontSize = useSharedValue(26);
  const fontFamily = useSharedValue('SpaceMono-Bold');
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));
  const animatedStyleInsiceCard = useAnimatedStyle(() => ({
    backgroundColor: pressedColor.value,
  }));
  const animatedStyleText = useAnimatedStyle(() => ({
    fontSize: fontSize.value,
    fontFamily: fontFamily.value,
  }));
  return {
    data,
    setData,
    translateX,
    scale,
    pressedColor,
    fontSize,
    fontFamily,
    animatedStyle,
    animatedStyleInsiceCard,
    animatedStyleText,
  };
};
