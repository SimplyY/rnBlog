import React, {
    Component,
    StyleSheet,
    View,
    TouchableOpacity,
    ListView,
    Text,
    Navigator
} from 'react-native'

import { Card } from 'react-native-material-design'

import Icon from 'react-native-vector-icons/FontAwesome'

import MyToolBar from '../component/MyToolBar'

import storage from '../common/storage'
import { ARTICLE_KEY, ARTICLE_IDS_KEY } from '../common/storage'

import { COLOR, ROUTE_ID, TITLE } from '../common/const'

const FIRST_MAX_ARTICLES_LEN = 10
const LOAD_MORE_LEN_ONCE = 5

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

    gotoArticlePage(rowID) {
        if (typeof rowID === 'string') {
            rowID = parseInt(rowID)
        }
        const theArticleId = this.state.articleListInfo[rowID].id

        this.props.navigator.push({
            id: ROUTE_ID.article,
            data: theArticleId,
        })
    }

    render() {
        return (
            <Navigator
                navigator={this.props.navigator}
                renderScene={this.renderScene.bind(this)}
                />
        )
    }

    renderScene() {
        const body = this.hasFirstLoad() ?
            this.renderArticleList():
            this.renderLoadingView()

        return (
            <MyToolBar title={TITLE.articleList}>
                {body}
            </MyToolBar>
        )
    }

    renderLoadingView() {
        const LOADING_TIP = 'article list is loading'

        return (
            <Card>
                <Card.Body>
                    <Text>
                        {LOADING_TIP}
                    </Text>
                </Card.Body>
            </Card>
        )
    }

    renderArticleList() {
        this.dataSource = this.dataSource.cloneWithRows(this.state.articleListInfo)

        return (
            <ListView
                style={styles.listView}
                dataSource={this.dataSource}
                renderRow={this.renderArticleInfo.bind(this)}
                onEndReached={this.loadMoreArticles.bind(this)}
                onEndReachedThreshold={END_REACHED_THRESHOLD}>
            </ListView>
        )
    }

    renderArticleInfo(articleInfo, sectionId, rowID) {
        return (
            <TouchableOpacity onPress={() => this.gotoArticlePage(rowID)}>
                <Card elevation={3}>
                    <Card.Body>
                        <Text style={styles.itemTitle}>
                           {articleInfo.title}
                        </Text>

                        <View style={styles.ItemIconWrapper}>
                            <View style={styles.loveShareIcon}>
                                <Icon
                                    name="heart"
                                    color={COLOR.grey}
                                    style={styles.itemIcon} />
                                <Text style={styles.iconText}>
                                    {articleInfo.loveNumber}
                                </Text>
                                <Icon
                                    size={13.5}
                                    name="share-alt"
                                    color={COLOR.grey} style={styles.itemIcon} />
                                <Text style={styles.iconText}>
                                    {articleInfo.shareNumber}
                                </Text>
                            </View>

                            <Icon color={COLOR.deepGrey} name="calendar" style={styles.itemIcon} />
                            <Text style={styles.iconText}>
                                {articleInfo.date}
                            </Text>
                       </View>
                   </Card.Body>
               </Card>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    listView: {
        flex: 1,
        padding: 10,
    },

    itemTitle: {
        fontSize: 18,
        padding: 6,
        color: COLOR.lightBlack
    },

    ItemIconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loveShareIcon: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemIcon: {
        marginHorizontal: 2,
        paddingHorizontal: 2,
        flexDirection: 'row',
    },
    iconText: {
        paddingHorizontal: 4,
        color: COLOR.grey,
    }

})

function getArticleInfo(article) {
    return {
        id: article._id,
        title: article.title,
        date: article.date,
        shareNumber: article.shareNumber,
        loveNumber: article.loveNumber
    }
}

export default ArticleList
