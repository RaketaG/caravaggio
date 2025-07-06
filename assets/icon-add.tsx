import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

type iconType = {
    size?: number;
    color?: string;
}

export const IconAdd: FC<iconType> = (props) => {
    const { size = 32, color = '#FFFFFF' } = props;
    return (
        <Svg height={size} viewBox="0 -960 960 960" width={size} fill={color}>
            <Path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </Svg>
    );
};
