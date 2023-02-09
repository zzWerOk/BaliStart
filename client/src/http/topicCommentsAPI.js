import {$authHost, $host} from "./index";

const apiUrl = 'api/topiccomment'

export const getAllByTopicId = async (topicId) => {

    // let tag_search = localStorage.getItem("tag_search_TopicComments")
    // let sort_code = localStorage.getItem("sort_code_TopicComments")
    let sortType = localStorage.getItem("sort_code_Topic" + topicId + "Comments")

    let sort_code = sortType === 'true' ? 'id' : 'reid'

    const params = new URLSearchParams();
    // if (tag_search) {
    //     params.append("tag_search", tag_search);
    // }
    if (sort_code) {
        params.append("sort_code", sort_code);
    }
    params.append("topic_id", topicId);
    const request = {
        params: params
    }

    if (topicId) {
        const {data} = await $authHost.get(apiUrl + '/all', request)
        return data
    }

}

export const shareComment = async (
    text,
    topic_id,
    on_topic_comment_reply_id,
    is_reply = false,
) => {

    const {data} = await $authHost.post(apiUrl + '/add', {
        text,
        topic_id,
        on_topic_comment_reply_id,
        is_reply,
    })

    return data
}

export const editComment = async (
    text,
    topic_id,
    topic_comment_id,
) => {

    const {data} = await $authHost.post(apiUrl + '/edit', {
        text,
        topic_id,
        topic_comment_id,
    })

    return data
}

export const deleteTopicAPI = async (id) => {
    const {data} = await $authHost.delete(apiUrl + '/', {params: {id: id}})
    return data
}
