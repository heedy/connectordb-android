import React, { Component } from 'react';
import { View, Text } from 'react-native';

import StarRating from 'react-native-star-rating';

import { addInput } from './index';

addInput("rating.stars", ({stream, insert}) => (
    <View>
        <StarRating
            disabled={false}
            maxStars={10}
            rating={7}
            emptyStar={'ios-star-outline'}
            fullStar={'ios-star'}
            halfStar={'ios-star-half'}
            iconSet={'Ionicons'}
            starColor={'rgb(59,89,152)'}
            starSize={34}
            selectedStar={(rating) => insert(rating)}
            />
    </View>
));