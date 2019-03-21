'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, ScrollView, Button, Share, TouchableHighlight} from 'react-native';
import { COLOR, Divider } from 'react-native-material-ui';
import striptags from 'striptags';
import _ from 'lodash';
import Swipe from 'react-native-swiper';


const CardAnekdot = (card) => <View style={styles.card}>
    <Text style={styles.title}>{card.desc}</Text>
    <Text style={styles.subtitle}>{card.site}</Text>
    <Divider/>
    <ScrollView style={styles.scroll}>
        <Text style={styles.text}>{striptags(replaceHtmlEntites(card.elementPureHtml))}</Text>
    </ScrollView>
    <TouchableHighlight onPress={card.share}>
        <View style={styles.button}>
            <Text>Click to share message, URL and title</Text>
        </View>
    </TouchableHighlight>
</View>

const replaceHtmlEntites = (function() {
    const translate_re = /&(nbsp|amp|quot|lt|gt);/g,
        translate = {
            'nbsp': String.fromCharCode(160),
            'amp' : '&',
            'quot': '"',
            'lt'  : '<',
            'gt'  : '>',
            'apos': '\'',
            'cent': '¢',
            'pound': '£',
            'yen': '¥',
            'euro': '€',
            'copy': '©',
            'reg': '®',

        },
        translator = function($0, $1) {
            return translate[$1];
        };

    return function(s) {
        return s.replace(translate_re, translator);
    };
})();

export default class SwipeView extends React.Component {
    constructor(props) {
        super(props);
        this.onSwipe = this.props.onSwipe.bind(this)
        this._shareTextWithTitle = this._shareTextWithTitle.bind(this)

    }

    render() {
        const {initIndex} = this.props
        return (
            <Swipe
                loop = {false}
                showsButtons = {true}
                showsPagination = {false}
                index = {initIndex}
                onIndexChanged = {this.onSwipe ? this.onSwipe : null}
            >
                {this.props.items.map((item, i)=><CardAnekdot key = {i} share = {this._shareTextWithTitle(item)} {...item} />)}
            </Swipe>

        )
    }
    _showResult (result) {
        console.log(result)
    }

    _shareTextWithTitle = (item) => () => {
        Share.share({
            message: striptags(replaceHtmlEntites(item.elementPureHtml)),
            title: item.desc,
            url: item.site
        }, {
            dialogTitle: 'Поделиться с друзьями',
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter',
                'com.apple.uikit.activity.mail'
            ],
            tintColor: 'green'
        })
            .then(this._showResult)
            .catch(err => console.log(err))
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#76c9f8',
        padding: 10,
        margin: 10,
        borderRadius: 5
    },
    card: {
        padding:15,
        width: '100%',
        minWidth: '100%',
        height: '100%',
        backgroundColor:COLOR.white,
        zIndex:999
    },
    title:{
        marginLeft:10,
        marginRight:10,
        fontSize: 21,
        fontWeight: '200',
        color:COLOR.grey900

    },
    subtitle:{
        marginLeft:10,
        marginRight:10,
        fontSize: 14,
        fontWeight: '100',
        color:COLOR.grey700,
        paddingBottom:5,

    },

    text:{
        fontSize: 20,
        fontWeight: '100',
        color:COLOR.grey900,
    },
    noMoreCardsText: {
        fontSize: 22,
    },
    scroll:{
        paddingTop:10,
        marginLeft:13,
        marginRight:13
    }
})

SwipeView.defaultProps = {
    items: [],
    initIndex:0
};

SwipeView.propTypes = {
    items: PropTypes.array.isRequired,
    initIndex:PropTypes.number,
    onSwipe:PropTypes.func
};