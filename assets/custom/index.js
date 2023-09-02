
const fetchText = async (url) => {
    const response = await fetch(url);
    return await response.text();
}
const csvUrl = 'assets/data/data.csv';

// --------------------------------------------------------------------
let markers;
var map = L.map('map', {
    center: [0, 51],
    zoom: 16,
    layers: [basemapCarto]
});

map.options.maxZoom = 19;

titleControl = L.control({ position: 'topright' });
titleControl.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'map-title');
    div.innerHTML = '<h3>Sundial brings you Sunboozy</h3>';
    L.DomEvent.disableClickPropagation(div);
    return div;
};
titleControl.addTo(map);

var baseLayers = {
    'Carto': basemapCarto,
    'OSM': OpenStreetMap_Mapnik,
    'Dark': darkStamenLayer,
    'Google': googleTerrain,
};
L.control.layers(baseLayers).addTo(map);

let uniqVariables;
var marker_geojson = { "type": "FeatureCollection" }

fetchText(csvUrl).then(text => {
    let pois = d3.csvParse(text);
    let features = [];

    for (i = 0; i < pois.length; i++) {

        let latlng = [pois[i].longitude, pois[i].latitude];
        let feature = {
            "type": "Feature",
            "properties": {
                "pubname": pois[i].pubname,
                "variable": pois[i].variable,
                "value": pois[i].value,
            },
            "geometry": { "type": "Point", "coordinates": latlng }
        };
        features.push(feature);
    }
    marker_geojson.features = features;

    uniqVariables = [...new Set(pois.map(item => item.variable))];
    updateMap(uniqVariables[0]);
    if (markers) {
        map.fitBounds(markers.getBounds());
    }


    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('sliderValue');

    // slider.value = uniqVariables[0];
    // slider.min=uniqVariables[0];
    slider.max = uniqVariables.length - 1;
    sliderValue.textContent = uniqVariables[0];

    slider.addEventListener('input', function () {
        const position = slider.value;
        sliderValue.textContent = uniqVariables[position];
        updateMap(uniqVariables[position]);
    });

});

var updateMap = function (variable) {

    const filteredFeatures = marker_geojson.features.filter(feature => {
        return feature.properties.variable === variable;
    });

    if (markers) {
        map.removeLayer(markers);
    }
    markers = L.geoJson(filteredFeatures, {
        onEachFeature: onEachMarker,
    }).addTo(map);

}

L.easyButton('<i class="material-icons" style="font-size:18px; margin-top: 5px">home</i>', function () {
    if (markers) {
        map.flyToBounds(markers.getBounds());
    }
}).addTo(map);

var locateControl = L.control.locate({
    flyTo: true,
    locateOptions: {
        enableHighAccuracy: true,
    },
}).addTo(map);