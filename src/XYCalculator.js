import trilat from "trilat/index.js";

export const myPlace  = (beacon, esps, px_meter) => {

    function calculateDistance(rssi) {
        let power = -59; //tx power
        let noise = 3; //noise from 2 to 4
        let distance = Math.pow(10, ((power-rssi) / (10*noise)) );
        // return distance * px_meter;
        return distance;
    }

    let sortedKeys = Object.keys(esps).sort(function (a, b) {
        return esps[a].sort - esps[b].sort
    });
    sortedKeys.reverse();

    // console.log(beacon[sortedKeys[0]].rssi)
    // console.log(esps)
    // console.log('XXX', beacon[sortedKeys[0]].rssi)
    console.log(calculateDistance(beacon[sortedKeys[0]].rssi))
    console.log(calculateDistance(beacon[sortedKeys[1]].rssi))
    console.log(calculateDistance(beacon[sortedKeys[2]].rssi))


    let input = [
        // [ parseInt(esps[sortedKeys[0]].x, 10), parseInt(esps[sortedKeys[0]].y, 10), calculateDistance(beacon[sortedKeys[0]].rssi)],
        // [ parseInt(esps[sortedKeys[1]].x, 10), parseInt(esps[sortedKeys[1]].y, 10), calculateDistance(beacon[sortedKeys[1]].rssi)],
        // [ parseInt(esps[sortedKeys[2]].x, 10), parseInt(esps[sortedKeys[2]].y, 10), calculateDistance(beacon[sortedKeys[2]].rssi)]

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
