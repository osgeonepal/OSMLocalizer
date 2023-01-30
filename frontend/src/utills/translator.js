import { fetchExternalJSONAPI } from './fetch';

export function inputTools(text, to) {
    const url = `https://inputtools.google.com/request?text=${text}&itc=${to}-t-i0-und&num=5`;
    return fetchExternalJSONAPI(url).then((data => data[1][0][1])
    )
}