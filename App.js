import React from 'react';
import Color from 'color';

import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-material-ui';
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';

import configureStore from './redux/configureStore'
import SourcesScreen from './components/Sources'
import RandomScreen from './components/Random'
const store = configureStore();

const uiTheme = {

    iconSet: 'MaterialIcons',
    fontFamily: 'Roboto',
    palette: {
        primaryColor: COLOR.blue500,
        accentColor: COLOR.red500,
        // text color palette
        primaryTextColor: COLOR.black,

        secondaryTextColor: COLOR.black,

        alternateTextColor: COLOR.white,
        // backgournds and borders
        canvasColor: COLOR.white,
        borderColor: Color.black
    }
};


class HomeScreen extends React.Component {
    render() {
        const {navigation} = this.props
        return (
            <View style={styles.container}>
                <TouchableHighlight style={[styles.button, styles.blue]} onPress={() => {
                    navigation.navigate('Random');
                }}>
                    <View>
                        <View style={styles.icon}>
                            <Icon  color={COLOR.white} size={56} name="casino"/>
                        </View>
                        <Text style={styles.text}>Новые анекдоты</Text>
                    </View>

                </TouchableHighlight>
                <TouchableHighlight style={[styles.button, styles.red]} onPress={() => {
                    navigation.navigate('Certain');
                }}>
                    <View>
                        <View style={styles.icon}>
                            <Icon  color={COLOR.white} size={56} name="list"/>
                        </View>
                        <Text style={styles.text}>Анектод по теме</Text>
                    </View>

                </TouchableHighlight>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        height:'50%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    red:{
        backgroundColor: COLOR.red500
    },
    blue:{
        backgroundColor: COLOR.blue500
    },
    text: {
        fontSize:24,
        color: COLOR.white
    },
    icon: {
        alignSelf: 'center'
    }

});

const toolbarStyle = {
    general:{
        headerTitleStyle: {
            color: COLOR.white,
        },
        headerBackTitleStyle: {
            color: COLOR.white,
        },
        headerTintColor: COLOR.white
    },
    background:{
        red:{
            headerStyle: {
                backgroundColor: COLOR.red500
            }
        },
        blue:{
            headerStyle: {
                backgroundColor: COLOR.blue500
            }
        }
    }


}

const RootNavigator =  StackNavigator({
    Home:{
        screen:HomeScreen,
        navigationOptions: {
            title:'Меню',
            ...toolbarStyle.general,
            ...toolbarStyle.background.blue
        }
    },
    Random:{
        screen:RandomScreen,
        navigationOptions: {
            title:'Случайный анекдот',
            ...toolbarStyle.general,
            ...toolbarStyle.background.blue
        }
    },
    Certain:{
        screen:SourcesScreen,
        navigationOptions: {
            title:'Выберите ресурс',
            ...toolbarStyle.general,
            ...toolbarStyle.background.red
        }
    }

})

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <ThemeContext.Provider value={getTheme(uiTheme)}>
                    <RootNavigator/>
                </ThemeContext.Provider>
            </Provider>

        );
    }
}

export default App
