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
    console.log(data)
    return data
}
