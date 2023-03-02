// import { osmAuth } from 'osm-auth';
// import { OSM_ACCESS_TOKEN, OAUTH_CLIENT_SECRET, OAUTH_CLIENT_ID } from '../config';

// const options = {
//     url: "https://www.openstreetmap.org",
//     client_id: OAUTH_CLIENT_ID,
//     client_secret: OAUTH_CLIENT_SECRET,
//     redirect_uri: "http//127.0.0.1/authorized",
//     access_token: OSM_ACCESS_TOKEN,

// }

// create a function to return user details from osm
export function getUserDetails(auth) {
  var options = {
    method: "GET",
    path: "/api/0.6/user/details.json",
  };
  return new Promise((resolve, reject) => {
    auth.xhr(options, function (err, response) {
      if (err) reject(err);

      if (response) {
        resolve(response);
      } else {
        throw new Error("No response!");
      }
    });
  });
}

export function createChangeset(auth, comment, reviewEdits) {
  const changeset = createChnagesetJSON(comment, reviewEdits);
  return new Promise((resolve, reject) => {
    auth.xhr(
      {
        method: "PUT",
        path: "/api/0.6/changeset/create",
        options: { header: { "Content-Type": "text/xml" } },
        content: changeset,
      },
      function (err, response) {
        if (err) reject(err);

        if (response) {
          resolve(response);
        } else {
          throw new Error("No response!");
        }
      }
    );
  });
}

export function uploadChanges(auth, changes, changesetId) {
  const changeXML = createChangeXML(changes, changesetId);
  return new Promise((resolve, reject) => {
    auth.xhr(
      {
        method: "POST",
        path: "/api/0.6/changeset/" + changesetId + "/upload",
        options: { header: { "Content-Type": "text/xml" } },
        content: changeXML,
      },
      function (err, response) {
        if (err) reject(err);

        if (response) {
          resolve(response);
        } else {
          throw new Error("No response!");
        }
      }
    );
  });
}

export function closeChangeset(auth, changesetId) {
  return new Promise((resolve, reject) => {
    auth.xhr(
      {
        method: "PUT",
        path: "/api/0.6/changeset/" + changesetId + "/close",
        options: { header: { "Content-Type": "text/xml" } },
        content: "",
      },
      function (err, response) {
        if (err) reject(err);
        else {
          resolve(response);
        }
      }
    );
  });
}

export async function uploadToOSM(auth, changes, comment, reviewEdits) {
  createChangeset(auth, comment, reviewEdits).then((changesetId) => {
    uploadChanges(auth, changes, changesetId).then(() => {
      closeChangeset(auth, changesetId);
    });
  });
}

export function createChnagesetJSON(comment, reviewEdits) {
  // create osm changeset xml string
  const hashtags = comment
    ?.split(" ")
    .filter((word) => word.startsWith("#"))
    .join(";");
  const changeset = `
    <osm>
        <changeset>
            <tag k="created_by" v="OSMLocalizer"/>
            <tag k="comment" v="${comment}"/>
            ${hashtags ? `<tag k="hashtags" v="${hashtags}"/>` : ""}
            ${reviewEdits ? `<tag k="review_edits" v="yes"/>` : ""}
        </changeset>
    </osm>
    `;
  return changeset;
}

const escapeXML = (str) => {
  const replaceMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  };
  return str.replace(/[&<>"']/g, (char) => replaceMap[char]);
};

export function createChangeXML(elements, changesetId) {
  let changeXML =
    '<osmChange version="0.6" generator="OSMLocalizer"><create/> <modify>';
  // eslint-disable-next-line
  for (const [key, value] of Object.entries(elements)) {
    changeXML += `<${value.type} id="${value.id}" changeset="${changesetId}" lon="${value.lon}" lat="${value.lat}" version="${value.version}">`;
    for (const [tag_key, tag_value] of Object.entries(value.tags)) {
      changeXML += `<tag k="${tag_key}" v="${escapeXML(tag_value)}"/>`;
    }
    changeXML += `</${value.type}>`;
  }
  changeXML += '</modify><delete if-unused="true"/></osmChange>';
  return changeXML;
}
