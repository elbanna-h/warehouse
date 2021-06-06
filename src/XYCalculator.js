import trilat from "trilat/index.js";

export const myPlace  = (beacon, esps, px_meter) => {

    function calculateDistance(rssi) {
        let power = -59; //tx power
        let noise = 3; //noise from 2 to 4
        let distance = Math.pow(10, ((power-rssi) / (10*noise)) );
        return distance * px_meter;
    }

    let keysSorted = Object.keys(beacon).sort(function (a, b) {
        return beacon[a].rssi - beacon[b].rssi
    });
    keysSorted.reverse();

    let input = [
        [ parseInt(esps[keysSorted[0]].x, 10), parseInt(esps[keysSorted[0]].y, 10), calculateDistance(beacon[keysSorted[0]].rssi)],
        [ parseInt(esps[keysSorted[1]].x, 10), parseInt(esps[keysSorted[1]].y, 10), calculateDistance(beacon[keysSorted[1]].rssi)],
        [ parseInt(esps[keysSorted[2]].x, 10), parseInt(esps[keysSorted[2]].y, 10), calculateDistance(beacon[keysSorted[2]].rssi)]
    ];

    let output = trilat(input);
    console.log()
    let xys = {
        x: parseInt(output[0], 10),
        y: parseInt(output[1], 10)
    };
    return xys;
};
