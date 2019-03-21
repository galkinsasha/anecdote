import React from 'react';
import { StyleSheet, Text, View, Button, ListView } from 'react-native';
class Sources extends React.Component {
    static navigationOptions = {
        title: 'Выберите Ресурс',
    };
    constructor(props) {
        super(props);
        this.state = {
            data: [{name:{first:'alex', last:'galkin'}},{name:{first:'alex', last:'galkin'}}]
        };
    }
    render() {
        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1.id !== r2.id
        });
        return (
            <ListView
                dataSource={dataSource.cloneWithRows(this.state.data)}
                renderRow={(data) => <Row {...data} />}
                renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            />
        );
    }
}

const Row = (props) => (
    <View style={styles.container}>
        <Text style={styles.text}>
            {`${props.name.first} ${props.name.last}`}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 12,
        fontSize: 16,
    },
    photo: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E'
    },
});
export default Sources