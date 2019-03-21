import React from 'react';
import {connect} from 'react-redux'
import { actions } from './../redux/modules/anekdots'
import { randomItemsSelector } from './../redux/selectors/anekdotsSelector'
import { Pulse } from 'react-native-loader';
import { COLOR } from 'react-native-material-ui';
import Swipe from './SwipeView';

import { StyleSheet, Text, View, ScrollView } from 'react-native';
class Random extends React.Component {
    constructor(props) {
        super(props);
        this.setItemIndex = this.props.setItemIndex.bind(this)
    }

    componentDidMount() {
        const { getRandomItemLocal, getItemIndex } = this.props
        getItemIndex()
        getRandomItemLocal()
    }

    shouldComponentUpdate(nextProps) {
        return this.props.anekdotsFetching !== nextProps.anekdotsFetching
            && this.props.initialIndex !== undefined
            && !!nextProps.anekdots
    }

    componentWillReceiveProps(nextProps) {
        const {anekdotsErrorCode, anekdotsFetching, anekdots, initialIndex} = nextProps
        const { getRandomItemHTTP } = this.props
        console.log('Anecdots fetching:'+ anekdotsFetching);
        if(!anekdotsFetching && !anekdotsErrorCode && !anekdots && initialIndex !== undefined
            || (Array.isArray(anekdots) && anekdots.length <= initialIndex+1)){
            // in case if we do not have items in the Local storage
            // try to get them from Internet
            getRandomItemHTTP()
        }
    }

    render() {
        const {anekdots=[], anekdotsFetching, initialIndex} = this.props
        return anekdotsFetching || initialIndex === undefined ?
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height:'100%'
            }}>
                <Pulse  size={56} color={COLOR.blue500} />
            </View> :
            <Swipe
                items={anekdots || []}
                onSwipe = {this.setItemIndex}
                initIndex = {initialIndex}
            />

    }
}
Random.defaultProps = {anekdots:null};
const mapDispatchToProps = {
    ...actions
}

const mapStateToProps = (state) => ({
    ...randomItemsSelector(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Random)