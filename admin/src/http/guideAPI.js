import {$authHost, $authHostUpload} from "./index";

export const getById = async (id) => {
    const {data} = await $authHost.get('api/guide/getById/' + id)
    return data
}

export const saveGuideData = async (user_id,
                                    avatar_img,
                                    name,
                                    about,
                                    religion,
                                    experience,
                                    active_till,
                                    visible_till,
                                    phones,
                                    languages,
) => {
    let formData = new FormData();
    formData = addToFormData(formData,
        user_id,
        avatar_img,
        name,
        about,
        religion,
        experience,
        active_till,
        visible_till,
        phones,
        languages,
    )

    if (!formData) {
        console.log('FormData error...')
        return null
    }

    const {data} = await $authHostUpload.post('api/guide/changeAdmin', formData)
    return data
}

const addToFormData = (formData,
                       user_id,
                       avatar_img,
                       name,
                       about,
                       religion,
                       experience,
                       active_till,
                       visible_till,
                       phones,
                       languages,
) => {
    try {
        formData.append("user_id", user_id);
        formData.append("name", name);
        formData.append("about", about);
        formData.append("religion", religion);
        formData.append("experience", experience);
        formData.append("active_till", active_till);
        formData.append("visible_till", visible_till);
        formData.append("phones", phones);
        formData.append("languages", languages);

        if (avatar_img !== null) {
            if (avatar_img !== undefined) {
                if (avatar_img !== '') {
                    try {
                        formData.append("img", avatar_img, "imageFile");
                    } catch (e) {
                        console.log('File apply error: ', e.message)
                    }
                }
            }
        }

        return formData
    } catch (e) {
        return null
    }
}

export const getAllGuides = async () => {
    const {data} = await $authHost.get('api/user/allGuides')
    return data
}

