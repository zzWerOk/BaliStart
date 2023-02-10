import {$authHost} from "./index";

const apiUrl = 'api/topiccomment'

export const getAllByTopicId = async (topicId) => {
    let sortType = localStorage.getItem("sort_code_Topic" + topicId + "Comments")
    let sort_code = sortType === 'true' ? 'id' : 'reid'
    const params = new URLSearchParams();
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

export const deleteCommentTopicAPI = async (topic_id,id) => {
    const {data} = await $authHost.delete(apiUrl + '/', {params: {topic_id , id}})
    return data
}
