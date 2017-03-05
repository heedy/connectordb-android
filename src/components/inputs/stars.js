import React, { Component } from 'react';
import { View, Text } from 'react-native';

import StarRating from 'react-native-star-rating';

import { addInput } from './input';

class MyStarRating extends Component {

    constructor(props) {
        super(props);
        this.state = {
            starCount: 0
        };
    }

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
        this.props.insert(rating);
    }

    render() {
        return (
            <View>
                <StarRating
                    disabled={false}
                    maxStars={10}
                    emptyStar={'ios-star-outline'}
                    fullStar={'ios-star'}
                    halfStar={'ios-star-half'}
                    iconSet={'Ionicons'}
                    starColor={'rgb(59,89,152)'}
                    starSize={34}
                    rating={this.state.starCount}
                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                />
            </View>
        );
    }
}

addInput("rating.stars", MyStarRating);