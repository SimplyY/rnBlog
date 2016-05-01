/* global __DEV__, GLOBAL */

import React, {
    Component,
    Navigator
} from 'react-native'

import ArticleList from './container/ArticleList'
import Article from './container/Article'

import { ROUTE_ID } from './common/const'

// dev config
if (__DEV__) {
    // for chrome devtool network could see ajax
    delete GLOBAL.XMLHttpRequest
}

class App extends Component {

    render() {
        return (
            <Navigator
                initialRoute={{id: ROUTE_ID.articleList}}
                renderScene={this.renderScene.bind(this)}
                configureScene={() => Navigator.SceneConfigs.HorizontalSwipeJump}
                />
        )
    }

    renderScene(route, navigator) {
        const routeId = route.id

        switch (routeId) {
            case ROUTE_ID.articleList:
                return <ArticleList navigator={navigator} />
            case ROUTE_ID.article:
                return <Article navigator={navigator} articleId={route.data}/>
            default:
                return <ArticleList navigator={navigator} />
        }
    }
}

export default App
