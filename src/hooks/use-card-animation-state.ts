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
  const justifyCard = useSharedValue<
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined
  >('center');
  const fontSize = useSharedValue(26);
  const fontFamily = useSharedValue('SpaceMono-Bold');
  const textAlign = useSharedValue<'left' | 'right' | 'center' | 'justify'>(
    'center',
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));
  const animatedStyleInsiceCard = useAnimatedStyle(() => ({
    backgroundColor: pressedColor.value,
    justifyContent: justifyCard.value,
  }));
  const animatedStyleText = useAnimatedStyle(() => ({
    fontSize: fontSize.value,
    fontFamily: fontFamily.value,
    textAlign: textAlign.value,
  }));
  return {
    data,
    setData,
    translateX,
    scale,
    pressedColor,
    justifyCard,
    fontSize,
    fontFamily,
    textAlign,
    animatedStyle,
    animatedStyleInsiceCard,
    animatedStyleText,
  };
};
