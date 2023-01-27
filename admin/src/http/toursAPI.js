import {$authHost, $authHostUpload, $host} from "./index";

const apiUrl = 'api/tours'

export const getAll = async () => {

    let tag_search = localStorage.getItem("tag_search_Tours")
    let sort_code = localStorage.getItem("sort_code_Tours")

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

    const {data} = await $host.get(apiUrl+'/getAll', request)
    return data
}

// export const getTourData = async (id) => {
//     const {data} = await $host.get(apiUrl+'/data/' + id)
//     return data
// }

export const deleteTourAPI = async (id) => {
    const {data} = await $authHost.delete(apiUrl+'/', {params: {id: id}})
    return data
}

export const saveTourAPI = async (
    name,
    description,
    image_logo,
    created_by_user_id,
    created_date,
    active,
    tour_category,
    tour_type,
    duration,
    activity_level,
    languages,
    image_logo_file,
) => {

    try {
        let formData = new FormData();
        formData = addToFormData(formData,
            name,
            description,
            image_logo,
            created_by_user_id,
            created_date,
            active,
            tour_category,
            tour_type,
            duration,
            activity_level,
            languages,
            image_logo_file
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

export const changeTourAPI = async (
    id,
    name,
    description,
    image_logo,
    created_by_user_id,
    created_date,
    active,
    tour_category,
    tour_type,
    duration,
    activity_level,
    languages,
    image_logo_file,

) => {
    try {

        let formData = new FormData();

        formData.append("id", id);
        formData = addToFormData(formData,
            name,
            description,
            image_logo,
            created_by_user_id,
            created_date,
            active,
            tour_category,
            tour_type,
            duration,
            activity_level,
            languages,
            image_logo_file
        )

        if(!formData){
            console.log('FormData error...')
            return null
        }

        const {data} = await $authHostUpload.post(apiUrl+'/change', formData)
        console.log(data)
        return data
    } catch (e) {
        console.log('data error', e.message)
    }

}

const addToFormData = (formData,
                       name,
                       description,
                       image_logo,
                       created_by_user_id,
                       created_date,
                       active,
                       tour_category,
                       tour_type,
                       duration,
                       activity_level,
                       languages,
                       image_logo_file
) => {
    try {
        formData.append("name", name);
        formData.append("description", description);
        formData.append("image_logo", image_logo);
        formData.append("created_by_user_id", created_by_user_id);
        formData.append("created_date", created_date);
        formData.append("active", active);

        formData.append("tour_category", tour_category);
        formData.append("tour_type", tour_type);
        formData.append("duration", duration);
        formData.append("activity_level", activity_level);
        formData.append("languages", languages);

        if (image_logo_file !== '') {
            if (image_logo_file !== undefined) {
                try {
                    formData.append("img", image_logo_file, "imageFile");
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

