import bbox from "@turf/bbox";

import { MAX_FILE_SIZE } from "../config";

const getBBOXFromGeojson = (files) => {
  const file = files[0];
  const format = file.name.split(".").pop();
  if (["geojson", "json"].includes(format)) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      if (isValidGeojson(data)) {
        const bboxpol = bbox(data);
        return bboxpol;
      } else {
        console.log("Invalid GeoJSON");
        return null;
      }
    };
    reader.readAsText(file);
  } else {
    console.log("Invalid file format");
    return null;
  }
};

export const checkFileSize = (file) => {
  const error =
    "File size exceeds the limit. Please upload a file less than 1MB.";
  if (file.size > MAX_FILE_SIZE) {
    alert(error);
    throw new Error(error);
  }
};

export const isValidGeojson = (data, supportedGeometry) => {
  return supportedGeometry.includes(data.type);
};

export const convertToFeatureCollection = (data) => {
  if (data.type === "FeatureCollection") {
    return data;
  } else if (data.type === "Feature") {
    return { type: "FeatureCollection", features: [data] };
  } else if (data.type === "Polygon" || data.type === "MultiPolygon") {
    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: data }],
    };
  }
};

export default getBBOXFromGeojson;
