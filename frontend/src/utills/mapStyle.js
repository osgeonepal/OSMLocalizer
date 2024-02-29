import { MAPTILER_API_TOKEN } from "../config";

export const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        'Map tiles by <a target="_top" rel="noopener" href="https://tile.openstreetmap.org/">OpenStreetMap tile servers</a>,' +
        'under the <a target="_top" rel="noopener" href="https://operations.osmfoundation.org/policies/tiles/">tile usage policy</a>.' +
        'Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

export const MAPTILER_OSM_STYLE = `https://api.maptiler.com/maps/openstreetmap/style.json?key=${MAPTILER_API_TOKEN}`
