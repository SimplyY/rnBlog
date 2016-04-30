import React, {
    Component,
    StyleSheet,

    View,
    ListView,
    Text
} from 'react-native'

import storage from '../common/storage'
import { ARTICLE_KEY, ARTICLE_IDS_KEY } from '../common/storage'

const FIRST_MAX_ARTICLES_LEN = 10
const LOAD_MORE_LEN_ONCE = 8

const END_REACHED_THRESHOLD = 30

class ArticleList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            articleListInfo: [],
            firstLoaded: false,
        }

        this.dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        })

        this.loadArticlesLen = FIRST_MAX_ARTICLES_LEN
    }

    hasFirstLoad() {
        return this.state.articleListInfo.length !== 0
    }

    componentDidMount() {
        if (!this.hasFirstLoad()) {
            this.loadArticles(this.loadArticlesLen)
        }
    }

    loadArticles(articlesLen) {
        // 获取首屏需要数据，加载 articleList
        return (
            this.fetchData(articlesLen)
                .then(articles => {
                    const articleListInfo = articles.map(article => getArticleInfo(article))
                    this.setState({
                        articleListInfo,
                    })
                })
        )
    }

    loadMoreArticles() {
        this.loadArticlesLen += LOAD_MORE_LEN_ONCE
        this.loadArticles(this.loadArticlesLen)
    }

    fetchData(articlesLen) {
        // 返回 promise（带有文章数据)
        return (
            storage.load({
                key: ARTICLE_IDS_KEY,
            })
            .then(articleIds => {
                articleIds = articleIds.slice(0, articlesLen)
                return storage.getBatchDataWithIds({
                    key: ARTICLE_KEY,
                    ids: articleIds
                })
            })
        )
    }


    render() {
        if (!this.hasFirstLoad()) {
            return this.renderLoadingView()
        }

        this.dataSource = this.dataSource.cloneWithRows(this.state.articleListInfo)

        return (
            <ListView
                dataSource={this.dataSource}
                renderRow={this.renderArticleInfo}
                onEndReached={this.loadMoreArticles.bind(this)}
                onEndReachedThreshold={END_REACHED_THRESHOLD}>
            </ListView>
        )
    }

    renderLoadingView() {
        return (
            <View>
                <Text>
                    is loading from network
                </Text>
            </View>
        )
    }

    renderArticleInfo(articleInfo) {
        return (
            <View>
                <Text>
                    {articleInfo.title}
                </Text>
                <Text>
                    {articleInfo.date}
                </Text>
                <Text>
                    {articleInfo.shareNumber}
                </Text>
                <Text>
                    {articleInfo.loveNumber}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    normal: {
        flex: 1
    },
    loadMoreButton: {
        flex: 1
    }
})

function getArticleInfo(article) {
    return {
        title: article.title,
        date: article.date,
        shareNumber: article.shareNumber,
        loveNumber: article.loveNumber
    }
}

export default ArticleList
