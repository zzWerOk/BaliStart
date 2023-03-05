import {$authHost, $authHostUpload, $host} from "./index";

const apiUrl = 'api/topics'

export const getAll = async (categoryId, tagSearch, sortCode) => {

    // let sort_code = localStorage.getItem("sort_code_Topics")

    const params = new URLSearchParams();
    if (categoryId) {
        params.append("category_id", categoryId);
    }
    if (tagSearch !== null) {
        params.append("tag_search", tagSearch);
    }
    if (sortCode) {
        params.append("sort_code", sortCode);
    }
    const request = {
        params: params
    }

    const {data} = await $host.get(apiUrl + '/all', request)
    return data
}

export const getTopicData = async (id, user_id = -1) => {
    const {data} = await $host.get(apiUrl + '/topicdata', {params: {id, user_id}}).catch((e) => {
        console.log('error ', e.response.data)
    })
    return data
}

export const saveTopicAPI = async (
    name,
    description,
    tag,
    image_logo,
    created_by_user_id,
    created_date,
    dataText,
    image_logo_file,
    imagesAdd,
) => {

    try {

        if(!name || !description || !tag || !dataText || JSON.parse(dataText).length === 0){
            return {status: 'error'}
        }

        let formData = new FormData();
        formData = addToFormData(formData,
            name,
            description,
            tag,
            image_logo_file,
            created_by_user_id,
            created_date,
            dataText,
            imagesAdd,
        )

        if (!formData) {
            console.log('FormData error...')
            return null
        }

        const {data} = await $authHostUpload.post(apiUrl + '/create', formData)
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
    created_by_user_id,
    created_date,
    dataText,
    image_logo_file,
    imagesAdd,
) => {
    try {
        if(!name || !description || !tag || !dataText || JSON.parse(dataText).length === 0){
            return {status: 'error'}
        }

        let formData = new FormData();

        formData.append("id", id);
        formData = addToFormData(formData,
            name,
            description,
            tag,
            image_logo_file,
            created_by_user_id,
            created_date,
            dataText,
            imagesAdd,
        )

        if (!formData) {
            console.log('FormData error...')
            return null
        }

        const {data} = await $authHostUpload.post(apiUrl + '/change', formData)
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
                       created_by_user_id,
                       created_date,
                       dataText,
                       imagesAdd,
) => {
    try {
        formData.append("name", name);
        formData.append("description", description);
        formData.append("tag", tag);
        formData.append("image_logo", image_logo);
        formData.append("images", '[]');
        formData.append("videos", '[]');
        formData.append("google_map_url", '');
        formData.append("active", true);
        formData.append("created_by_user_id", created_by_user_id);
        formData.append("created_date", created_date);
        formData.append("deleted_by_user_id", -1);
        formData.append("deleted_date", 0);

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
            /** Удаление ссылок на локальные адреса изображений **/
            let newDataJSON = JSON.parse(dataText)
            for(let i = 0;i < newDataJSON.length;i++){
                const currItem = newDataJSON[i]
                if(currItem.type === 'images'){
                    const imagesItems = JSON.parse(currItem.items)
                    let newImagesItems = []
                    imagesItems.map(item => {
                        if (item.indexOf('blob:http://') === -1) {
                            console.log(item)
                            newImagesItems.push(item)
                        }
                    })
                    currItem.items = JSON.stringify(newImagesItems)
                }
            }
            dataText = JSON.stringify(newDataJSON)

            let imagesCount = 0
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
            });
            formData.append("new_images_count", imagesCount);
        }

        formData.append("dataText", dataText);

        return formData
    } catch (e) {
        return null
    }
}

export const setActiveAPI = async (id, active) => {
    const {data} = await $authHost.post(apiUrl + '/active', {id, active})
    return data
}

export const deleteTopicAPI = async (id) => {
    const {data} = await $authHost.delete(apiUrl + '/', {params: {id: id}})
    return data
}
