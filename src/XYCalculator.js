import trilat from "trilat/index.js";

export const myPlace  = (beacon, esps, px_meter) => {
    // px_meter // How many pixels on the map presents real 1 meter in the warehouse
    function calculateDistance(rssi) {
        let power = -59; // -59 tx power
        let noise = 4; // 3 noise from 2 to 4
        let distance = Math.pow(10, ((power-rssi) / (10*noise)) );
        return distance * px_meter;
    }

    // sort all 4 or more ESP32 results by RSSI to get the top 3
    let sortedKeys = Object.keys(esps).sort(function (a, b) {
        return esps[a].sort - esps[b].sort
    });
    sortedKeys.reverse();

    console.log(calculateDistance(beacon[sortedKeys[0]].rssi))
    console.log(calculateDistance(beacon[sortedKeys[1]].rssi))
    console.log(calculateDistance(beacon[sortedKeys[2]].rssi))


    let input = [
        [ parseInt(esps[sortedKeys[0]].x, 10), parseInt(esps[sortedKeys[0]].y, 10), calculateDistance(beacon[sortedKeys[0]].rssi)],
        [ parseInt(esps[sortedKeys[1]].x, 10), parseInt(esps[sortedKeys[1]].y, 10), calculateDistance(beacon[sortedKeys[1]].rssi)],
        [ parseInt(esps[sortedKeys[2]].x, 10), parseInt(esps[sortedKeys[2]].y, 10), calculateDistance(beacon[sortedKeys[2]].rssi)]

    ];

    console.log(trilat(input))

    let output = trilat(input);

    let xys = {
        x: parseInt(output[0], 10),
        y: parseInt(output[1], 10)
    };
    return xys;
};
