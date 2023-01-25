import {$authHost, $authHostUpload, $host} from "./index";

const apiUrl = 'api/mappoint'

export const getAll = async () => {
    const {data} = await $host.get(apiUrl+'/getAll')
    return data
}

export const getMapPointData = async (id) => {
    const {data} = await $host.get(apiUrl+'/data/' + id)
    return data
}

export const saveMapPointAPI = async (
    name,
    description,
    google_map_url,
    topics,
    active,
    created_by_user_id,
    created_date,
    data_text,
    image_logo_file,
) => {

    try {
        let formData = new FormData();
        formData = addToFormData(formData,
            name,
            description,
            image_logo_file,
            google_map_url,
            topics,
            active,
            created_by_user_id,
            created_date,
            data_text,
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

export const changeMapPointAPI = async (
    id,
    name,
    description,
    google_map_url,
    topics,
    active,
    created_by_user_id,
    created_date,
    data_text,
    image_logo_file,
) => {

    try {

        let formData = new FormData();

        formData.append("id", id);
        formData = addToFormData(formData,
            name,
            description,
            image_logo_file,
            google_map_url,
            topics,
            active,
            created_by_user_id,
            created_date,
            data_text,
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
                       image_logo,
                       google_map_url,
                       topics,
                       active,
                       created_by_user_id,
                       created_date,
                       data_text,
) => {
    try {
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image_logo", image_logo);
        formData.append("google_map_url", google_map_url);
        formData.append("topics", topics);
        formData.append("active", active);
        formData.append("created_by_user_id", created_by_user_id);
        formData.append("created_date", created_date);
        formData.append("data_text", data_text);

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


export const deleteMapPointAPI = async (id) => {
    const {data} = await $authHost.delete(apiUrl+'/', {params: {id: id}})
    return data
}
