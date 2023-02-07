import {$authHost, $host} from "./index";

const apiUrl = 'api/topiccomment'

export const getAllByTopicId = async (topicId) => {

    let tag_search = localStorage.getItem("tag_search_TopicComments")
    let sort_code = localStorage.getItem("sort_code_TopicComments")

    const params = new URLSearchParams();
    if(tag_search) {
        params.append("tag_search", tag_search);
    }
    if(sort_code) {
        params.append("sort_code", sort_code);
    }
        params.append("topic_id", topicId);
    const request = {
        params: params
    }

    if(topicId) {
        const {data} = await $host.get(apiUrl + '/all', request)
        return data
    }

}


export const setActiveAPI = async (id, active) => {
    const {data} = await $authHost.post(apiUrl+'/active', {id, active})
    return data
}

export const deleteTopicAPI = async (id) => {
    const {data} = await $authHost.delete(apiUrl+'/', {params: {id: id}})
    return data
}
