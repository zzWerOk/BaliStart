import {$authHost, $authHostUpload, $host} from "./index";

export const getAll = async () => {

    let tag_search = localStorage.getItem("tag_search_Topics")
    let sort_code = localStorage.getItem("sort_code_Topics")

    const params = new URLSearchParams();
    if (tag_search) {
        params.append("tag_search", tag_search);
    }
    if (sort_code) {
        params.append("sort_code", sort_code);
    }
    const request = {
        params: params
    }

    const {data} = await $authHost.get('api/topics/adminall', request)
    return data
}

export const getTopicData = async (id) => {
    const {data} = await $host.get('api/topics/data/' + id)
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
    imagesAdd,
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
            imagesAdd,
        )

        if (!formData) {
            console.log('FormData error...')
            return null
        }

        const {data} = await $authHostUpload.post('api/topics/create', formData)
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
    imagesAdd,
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
            imagesAdd,
        )

        if (!formData) {
            console.log('FormData error...')
            return null
        }

        const {data} = await $authHostUpload.post('api/topics/change', formData)

        // console.log(data)

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
                       imagesAdd,
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

        if(imagesAdd){
            let imagesCount = 0
            // let arrCount = 0

            Object.keys(imagesAdd).map(function(key) {
                let currFilesList = imagesAdd[key]
                Object.keys(currFilesList).map(function(itemKey) {
                    let currFile = currFilesList[itemKey]
                    try {
                        if (currFile.name && currFile.size) {
                            formData.append("img" + imagesCount, currFile, currFile.name + ' ' + key);
                            imagesCount++
                        }
                    }catch (e) {}
                });
                // arrCount++
            });
            formData.append("new_images_count", imagesCount);
        }

        return formData
    } catch (e) {
        return null
    }
}

export const setActiveAPI = async (id, active) => {
    const {data} = await $authHost.post('api/topics/active', {id, active})
    return data
}

export const deleteTopicAPI = async (id) => {
    const {data} = await $authHost.delete('api/topics/', {params: {id: id}})
    return data
}
