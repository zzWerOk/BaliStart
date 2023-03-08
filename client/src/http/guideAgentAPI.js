import {$authHost, $authHostUpload} from "./index";

export const getGuideById = async () => {
    const {data} = await $authHost.get('api/guide/getGuideById')
    return data
}

export const getAgentById = async () => {
    const {data} = await $authHost.get('api/agent/getAgentById')
    return data
}


export const saveGuideData = async (
    name,
    about,
    religion,
    experience,
    languages,
    phones,
    links,
    new_img,
) => {
    let formData = new FormData();
    formData = addToGuideFormData(formData,
        name,
        about,
        religion,
        experience,
        languages,
        phones,
        links,
        new_img,
    )

    if (!formData) {
        console.log('FormData error...')
        return null
    }

    const {data} = await $authHostUpload.post('api/guide/change', formData)
    return data
}

const addToGuideFormData = (formData,
                            name,
                            about,
                            religion,
                            experience,
                            languages,
                            phones,
                            links,
                            new_img,
) => {
    try {
        formData.append("name", name);
        formData.append("about", about);
        formData.append("religion", religion);
        formData.append("experience", experience);
        formData.append("languages", languages);
        formData.append("phones", phones);
        formData.append("links", links);

        if (new_img !== null) {
            if (new_img !== undefined) {
                if (new_img !== '') {
                    try {
                        formData.append("img", new_img, "imageFile");
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

export const saveAgentData = async (
    name,
    about,
    languages,
    phones,
    links,
    new_img,
) => {
    let formData = new FormData();
    formData = addToAgentFormData(formData,
        name,
        about,
        languages,
        phones,
        links,
        new_img,
    )

    if (!formData) {
        console.log('FormData error...')
        return null
    }

    const {data} = await $authHostUpload.post('api/agent/change', formData)
    console.log(data)
    return data
}

const addToAgentFormData = (formData,
                            name,
                            about,
                            languages,
                            phones,
                            links,
                            new_img,
) => {
    try {
        formData.append("name", name);
        formData.append("about", about);
        formData.append("phones", phones);
        formData.append("links", links);
        formData.append("languages", languages);

        if (new_img !== null) {
            if (new_img !== undefined) {
                if (new_img !== '') {
                    try {
                        formData.append("img", new_img, "imageFile");
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
