function onEachMarker(feature, layer) {

    var icon = getIcon(feature.properties.value);
    layer.setIcon(icon);
    let str = 'Pub Name: ' + feature.properties.pubname + '<br>';
    str += 'Variable: ' + feature.properties.variable + '<br>';
    str += 'Value: ' + feature.properties.value;
    layer.bindPopup(str);

}

var getIcon = function (value) {
    let gi = '<i class="material-icons g-icon-i" style="font-size:16px; color: #ffff00">place</i>'; // yellow
    if (value == 0) {
        gi = '<i class="material-icons g-icon-i" style="font-size:16px; color: #000">place</i>'; // black
    } else if (value == 0.25) {
        gi = '<i class="material-icons g-icon-i" style="font-size:16px; color: #ff0000">place</i>'; // red
    } else if (value == 0.5) {
        gi = '<i class="material-icons g-icon-i" style="font-size:16px; color: #f8884d">place</i>'; // orange
    }

    return GoogleIcon('<span class="g-icon">' + gi + '</span>');
}

