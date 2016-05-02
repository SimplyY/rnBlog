import React, {
    Component,
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    Navigator,
    Dimensions,
    Linking
} from 'react-native'

import reactMixin from 'react-mixin'
import TimerMixin from 'react-timer-mixin'

import HtmlRender from '../hackedLibs/react-native-html-render'

import MyToolBar from '../component/MyToolBar'

import storage from '../common/storage'
import { ARTICLE_KEY } from '../common/storage'

import { TITLE } from '../common/const'

const LAZY_LOAD_DELAY = 370

class Article extends Component {
    constructor(props) {
        super(props)

        this.state = {
            articleHtml: ''
        }
    }

    componentDidMount() {
        const that = this
        storage.load({
            key: ARTICLE_KEY,
            id: this.props.articleId
        })
        .then(article => {
            const setTimeout = typeof setTimeout === 'function' ?
                setTimeout:
                this.setTimeout

            setTimeout(() => {
                that.setState({ articleHtml: article.html })
            }, LAZY_LOAD_DELAY)
        })
    }

    _onLinkPress(uri) {
        Linking.openURL(uri)
    }

    _renderNode(node, index, parent, type) {
        var name = node.name
        if (name === 'a') {
            if (node.attribs.class === 'iconfont article-anchor') {
                return (
                    <Text key={index}>
                    </Text>
                )
            }
        }

        if (node.type === 'block' && type === 'block') {
            if (name === 'img') {
                const thumbnailQureyStr = '?imageMogr2/thumbnail/440x'
                const uri = node.attribs.src + thumbnailQureyStr;
                return (
                    <View key={index}>
                        <Image
                            source={{uri:uri}}
                            style={styles.img}
                            />
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
                    stylesheet={styles}
                    renderNode={this._renderNode}
                    />
            </ScrollView>
        )
    }

    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>
                    Loading article...
                </Text>
            </View>
        )
    }
}

const {height,width} = Dimensions.get('window')

const styles = StyleSheet.create({
    loadingText: {
        fontSize: 20,
        marginTop: 20,
        marginLeft: 10
    },

    img: {
        width: width - 30,
        height: height * 2/5,
        resizeMode: Image.resizeMode.contain,
    },
    article: {
        paddingHorizontal: 20,
    },

})

export default Article

reactMixin(Article.prototype, TimerMixin)
