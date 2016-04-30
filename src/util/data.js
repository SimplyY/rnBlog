export function formatArticleDate(date){
    return new Date(date).toISOString().substring(0, 10)
}
