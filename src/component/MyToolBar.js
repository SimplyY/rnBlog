import React, {
    Component,
    StyleSheet,
    View,
    ToolbarAndroid
} from 'react-native'

import { COLOR } from '../common/const'

class MyToolBar extends Component {
    render() {
        return (
            <View style={styles.pageContainer}>
                <ToolbarAndroid
                    style={styles.toolbar}
                    title={this.props.title}
                    titleColor={'white'}
                    />
                {this.props.children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    toolbar: {
        height: 50,
        backgroundColor: COLOR.lightBlack,
        elevation: 4,
    }

})

export default MyToolBar
