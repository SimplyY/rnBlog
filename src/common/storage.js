/* global fetch */
import Storage from 'react-native-storage'

import { isArray } from '../util/judge'
import { ARTICLES_API } from './api'

export const ARTICLE_KEY = 'article'
export const ARTICLE_IDS_KEY = 'articleIds'

const storage = new Storage({
    // maximum capacity, default 1000
    size: 1000,

    // expire time, default 1 day(1000 * 3600 * 24 secs)
    defaultExpires: 1000 * 3600 * 24,

    // cache data in the memory. default is true.
    enableCache: true,

    // if data was not found in storage or expired,
    // the corresponding sync method will be invoked and return
    // the latest data.
    sync: {
        articleIds({ resolve, reject }) {
            const theArticleApi = ARTICLES_API + '?select=_id&sort=-date'

            fetch(theArticleApi)
                .then(response => response.json())
                .then(ids => {
                    ids = ids.map(item => item._id)
                    storage.save({
                        key: ARTICLE_IDS_KEY,
                        rawData: ids
                    })
                    resolve(ids)
                })
                .catch(err => {
                    reject(err)
                })
        },

        // id may be ids
        article({ id, resolve, reject }) {
            const theArticleApi = isArray(id) ?
                ARTICLES_API + '?_id__in=' + id.join(',') :
                ARTICLES_API + id

            fetch(theArticleApi)
                .then(response => response.json())
                .then(articles => {
                    if (isArray(id)) {
                        // 当id 为数组ids，同步多个 article
                        articles.forEach(article => {
                            storage.save({
                                id: article._id,
                                key: ARTICLE_KEY,
                                rawData: article
                            })
                        })
                    } else {
                        // 否则同步一个 article
                        const article = articles
                        storage.save({
                            id,
                            key: ARTICLE_KEY,
                            rawData: article
                        })
                    }
                    resolve(articles)
                })
                .catch(err => {
                    reject(err)
                })
        }
    }
})


export default storage
