import {$authHost, $authHostUpload} from "./index";

export const getById = async (id) => {
    const {data} = await $authHost.get('api/agent/getById/' + id)
    return data
}

export const saveAgentData = async (user_id,
                                    avatar_img,
                                    name,
                                    about,
                                    active_till,
                                    visible_till,
                                    phones,
                                    links,
                                    languages,
) => {
    let formData = new FormData();
    formData = addToFormData(formData,
        user_id,
        avatar_img,
        name,
        about,
        active_till,
        visible_till,
        phones,
        links,
        languages,
    )

    if (!formData) {
        console.log('FormData error...')
        return null
    }

    const {data} = await $authHostUpload.post('api/agent/changeAdmin', formData)
    console.log(data)
    return data
}

const addToFormData = (formData,
                       user_id,
                       avatar_img,
                       name,
                       about,
                       active_till,
                       visible_till,
                       phones,
                       links,
                       languages,
) => {
    try {
        formData.append("user_id", user_id);
        formData.append("name", name);
        formData.append("about", about);
        formData.append("active_till", active_till);
        formData.append("visible_till", visible_till);
        formData.append("phones", phones);
        formData.append("links", links);
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

export const getAllAgents = async () => {
    const {data} = await $authHost.get('api/user/allAgents')
    return data
}

