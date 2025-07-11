import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

type iconType = {
    size?: number;
    color?: string;
}

export const IconBack: FC<iconType> = (props) => {
    const { size = 32, color = '#FFFFFF' } = props;
    return (
        <Svg height={size} viewBox="0 -960 960 960" width={size} fill={color}>
            <Path d="M560-280 360-480l200-200v400Z" />
        </Svg>
    );
};
