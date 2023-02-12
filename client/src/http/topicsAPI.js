import {$authHost, $authHostUpload, $host} from "./index";

const apiUrl = 'api/topics'

export const getAll = async (tag_search) => {

    // let tag_search = localStorage.getItem("tag_search_Topics")
    let sort_code = localStorage.getItem("sort_code_Topics")

    const params = new URLSearchParams();
    if(tag_search) {
        params.append("tag_search", tag_search);
    }
    if(sort_code) {
        params.append("sort_code", sort_code);
    }
    const request = {
        params: params
    }

    const {data} = await $host.get(apiUrl+'/all', request)
    return data
}

export const getTopicData = async (id, user_id = -1) => {
    const {data} = await $host.get(apiUrl+'/topicdata', {params: {id, user_id}}).catch((e) => {
        console.log('error ', e.response.data.message)
    })
    return data
}

export const saveTopicAPI = async (
    name,
    description,
    tag,
    image_logo,
    images,
    videos,
    google_map_url,
    active,
    created_by_user_id,
    created_date,
    deleted_by_user_id,
    deleted_date,
    dataText,
    image_logo_file,
) => {

    try {
        let formData = new FormData();
        formData = addToFormData(formData,
            name,
            description,
            tag,
            image_logo_file,
            images,
            videos,
            google_map_url,
            active,
            created_by_user_id,
            created_date,
            deleted_by_user_id,
            deleted_date,
            dataText,
        )

        if(!formData){
            console.log('FormData error...')
            return null
        }

        const {data} = await $authHostUpload.post(apiUrl+'/create', formData)
        return data
    } catch (e) {
        console.log('data error', e.message)
    }

}

export const changeTopicAPI = async (
    id,
    name,
    description,
    tag,
    image_logo,
    images,
    videos,
    google_map_url,
    active,
    created_by_user_id,
    created_date,
    deleted_by_user_id,
    deleted_date,
    dataText,
    image_logo_file,
) => {
    try {

        let formData = new FormData();

        formData.append("id", id);
        formData = addToFormData(formData,
            name,
            description,
            tag,
            image_logo_file,
            images,
            videos,
            google_map_url,
            active,
            created_by_user_id,
            created_date,
            deleted_by_user_id,
            deleted_date,
            dataText,
        )

        if(!formData){
            console.log('FormData error...')
            return null
        }

        const {data} = await $authHostUpload.post(apiUrl+'/change', formData)
        return data
    } catch (e) {
        console.log('data error', e.message)
    }

}

const addToFormData = (formData,
                       name,
                       description,
                       tag,
                       image_logo,
                       images,
                       videos,
                       google_map_url,
                       active,
                       created_by_user_id,
                       created_date,
                       deleted_by_user_id,
                       deleted_date,
                       dataText,
) => {
    try {
        formData.append("name", name);
        formData.append("description", description);
        formData.append("tag", tag);
        formData.append("image_logo", image_logo);
        formData.append("images", images);
        formData.append("videos", videos);
        formData.append("google_map_url", google_map_url);
        formData.append("active", active);
        formData.append("created_by_user_id", created_by_user_id);
        formData.append("created_date", created_date);
        formData.append("deleted_by_user_id", deleted_by_user_id);
        formData.append("deleted_date", deleted_date);
        formData.append("dataText", dataText);

        if (image_logo !== '') {
        if (image_logo !== undefined) {
            try {
                formData.append("img", image_logo, "imageFile");
            } catch (e) {
                console.log('File apply error: ', e.message)
            }
        }
        }

        return formData
    } catch (e) {
        return null
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
