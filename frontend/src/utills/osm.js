import { osmAuth } from 'osm-auth';

const options = {
    url: "https://www.openstreetmap.org",
    client_id: "le8PJibm6rDWcU3C3Umt5hbw3UuCoZwrMn0-IDRQzz0",
    client_secret: "jPgImmptsMUodIsmPI27elvk9Qn16-Vn4PEDwPhHkxw",
    redirect_uri: "http//127.0.0.1/authorized",
    access_token: "",

}

var auth = osmAuth(options);

export function userDetails() {
    auth.xhr({
        method: 'GET',
        path: '/api/0.6/user/details.json'
    }, function (err, details) {
        if (err) {
            console.log(err);
        }
        return details;
    }
    );
};

export function createChangeset(comment, hashtags) {
    const changeset = createChnagesetJSON(comment, hashtags);
    auth.xhr({
        method: 'PUT',
        path: '/api/0.6/changeset/create',
        options: { header: { 'Content-Type': 'text/xml' } },
        content: changeset
    }, function (err, changesetId) {
        if (err) {
            console.log(err);
        }
        console.log(changesetId);
        return changesetId;
    });
};

export function uploadChanges(changes, changesetId) {
    const changeXML = createChangeXML(changes);
    auth.xhr({
        method: 'POST',
        path: '/api/0.6/changeset/' + changesetId + '/upload',
        options: { header: { 'Content-Type': 'text/xml' } },
        content: changeXML
    }, function (err, changesetId) {
        if (err) {
            console.log(err);
        }
        console.log(changesetId);
        return changesetId;
    });
};


export function closeChangeset(changesetId) {
    auth.xhr({
        method: 'PUT',
        path: '/api/0.6/changeset/' + changesetId + '/close',
        options: { header: { 'Content-Type': 'text/xml' } },
        content: ''
    }, function (err, changesetId) {
        if (err) {
            console.log(err);
        }
        console.log(changesetId);
        return changesetId;
    });
};

// export function uploadToOSM(changes, comment, hashtags) {
//     async () => {
//         await createChangeset(comment, hashtags).then(
            
//             uploadChanges(changes, changesetId)
//         ).then(
//             closeChangeset(changesetId)
//         )
//     };
// };

export function createChnagesetJSON(comment, hashtags) {
    // create osm changeset xml string
    const changeset = `
    <osm>
        <changeset>
            <tag k="created_by" v="OSMLocalizer"/>
            <tag k="comment" v="${comment}"/>
            <tag k="hashtags" v="${hashtags}"/>
        </changeset>
    </osm>
    `;
    return changeset;
};

export function createChangeXML(elements) {
    // TODO: Add changeset id
    let changeXML = '<osmChange version="0.6" generator="OSMLocalizer"><create/>';
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(elements)) {
        changeXML += `<modify>
            <${value.type} id="${value.id}" lon="${value.lon}" lat="${value.lat}" version="${value.version}">`;
        for (const [tag_key, tag_value] of Object.entries(value.tags)) {
            changeXML += `<tag k="${tag_key}" v="${tag_value}"/>`;
        }
        changeXML += `</${value.type}>
        </modify>`;
    }
    changeXML += '<delete if-unused="true"/></osmChange>';
    return changeXML;
}
