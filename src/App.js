import React, {
    Component
} from 'react-native'

import {Scene, Router, Modal} from 'react-native-router-flux'

import ArticleList from './container/ArticleList'

// dev config
if (__DEV__) {
    // for chrome devtool network could see ajax
    delete GLOBAL.XMLHttpRequest
}

class App extends Component {

    render() {
        return (
            <Router>
                <Scene key="modal" component={Modal} >
                    <Scene key="ArticleList" component={ArticleList} title="ArticleList" initial={true} />
                </Scene>
            </Router>
        )
    }
}

export default App
