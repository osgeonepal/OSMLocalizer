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

  for (const value of Object.values(elements)) {
    if (value.type === "node") {
      changeXML += `<${value.type} id="${value.id}" changeset="${changesetId}" lon="${value.lon}" lat="${value.lat}" version="${value.version}">`;
    } else if (value.type === "way") {
      changeXML += `<${value.type} id="${value.id}" changeset="${changesetId}" version="${value.version}">`;
      for (const node_value of Object.values(value.nodes)) {
        changeXML += `<nd ref="${node_value}"/>`;
      }
    } else if (value.type === "relation") {
      changeXML += `<${value.type} id="${value.id}" changeset="${changesetId}" version="${value.version}">`;
      for (const member_value of Object.values(value.members)) {
        changeXML += `<member type="${member_value.type}" ref="${member_value.ref}" role="${member_value.role}"/>`;
      }
    }
    // add tags to the element xml
    for (const [tag_key, tag_value] of Object.entries(value.tags)) {
      changeXML += `<tag k="${escapeXML(tag_key)}" v="${escapeXML(
        tag_value
      )}"/>`;
    }
    changeXML += `</${value.type}>`;
  }
  changeXML += "</modify><delete if-unused='true'/></osmChange>";
  return changeXML;
}
