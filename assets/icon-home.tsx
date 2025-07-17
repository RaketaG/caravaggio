import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

type iconType = {
    size?: number;
    color?: string;
}

export const IconHome: FC<iconType> = (props) => {
    const { size = 32, color = '#FFFFFF' } = props;
    return (
        <Svg height={size} viewBox="0 -960 960 960" width={size} fill={color}>
            <Path d="M160-120v-392.33l-80 61-40-53.34L480-840l440 336-40 52.33-80-60.66V-120H160Zm66.67-66.67h506.66v-376.66L480-756.33l-253.33 193v376.66Zm0 0h506.66-506.66ZM320-360q-17 0-28.5-11.5T280-400q0-17 11.5-28.5T320-440q17 0 28.5 11.5T360-400q0 17-11.5 28.5T320-360Zm160 0q-17 0-28.5-11.5T440-400q0-17 11.5-28.5T480-440q17 0 28.5 11.5T520-400q0 17-11.5 28.5T480-360Zm160 0q-17 0-28.5-11.5T600-400q0-17 11.5-28.5T640-440q17 0 28.5 11.5T680-400q0 17-11.5 28.5T640-360Z" />
        </Svg>
    );
};
