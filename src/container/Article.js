import React, {
    Component,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Navigator
} from 'react-native'

import HtmlRender from 'react-native-html-render'

import MyToolBar from '../component/MyToolBar'

import storage from '../common/storage'
import { ARTICLE_KEY } from '../common/storage'

import { TITLE } from '../common/const'

class Article extends Component {
    constructor(props) {
        super(props)

        this.state = {
            articleHtml: ''
        }
    }

    componentDidMount() {
        storage.load({
            key: ARTICLE_KEY,
            id: this.props.articleId
        })
        .then(article => {
            this.setState({ articleHtml: article.html })
        })
    }

    _onLinkPress(url) {
        if (/^\/user\/\w*/.test(url)) {
            let authorName = url.replace(/^\/user\//, '')
            routes.toUser(this, {
                userName: authorName
            })
        }

        if (/^https?:\/\/.*/.test(url)) {
            window.link(url)
        }
    }


    _renderNode(node, index, parent, type) {
        var name = node.name
        if (node.type == 'block' && type == 'block') {
            if (name == 'img') {
                var uri = node.attribs.src;
                if (/^\/\/dn-cnode\.qbox\.me\/.*/.test(uri)) {
                    uri = 'http:' + uri
                }
                return (
                    <View
                        key={index}
                        style={styles.imgWrapper}>
                        <Image source={{uri:uri}}
                               style={styles.img}>
                        </Image>
                    </View>
                )
            }
        }
    }


    render() {
        return (
            <Navigator
                renderScene={this.renderScene.bind(this)}
                navigator={this.props.navigator}
                />
        )
    }

    renderScene() {
        const body = this.state.articleHtml === '' ?
            this.renderLoadingView():
            this.renderArticle()

        return (
            <MyToolBar title={TITLE.article}>
                {body}
            </MyToolBar>
        )
    }

    renderArticle() {
        return (
            <ScrollView style={styles.article}>
                <HtmlRender
                    value={this.state.articleHtml}
                    onLinkPress={this._onLinkPress.bind(this)}
                    renderNode={this._renderNode}
                    stylesheet={styles}
                    />
            </ScrollView>
        )
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text>
                    Loading article...
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    article: {
        padding: 20
    }
})

export default Article
