import React, {Component} from 'react'
import {merge} from 'lodash'

import MQTT from './mqtt.js'
import Warehouse from './warehouse.js'

import {Route} from 'react-router-dom'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            beacons: {},
            sortedBeacons: {},
            knownBeacons: [],
            esps: {
                '84:cc:a8:5a:61:8c': {x: 0, y: 0}, // 4 cut
                '3c:61:05:13:de:c0': {x: 0, y: 1000}, // 3 on bard with arduino
                '3c:61:05:13:e4:08': {x: 1530, y: 0}, // 1 loos
                '3c:61:05:13:e2:18': {x: 1530, y: 1000}, // 2 on board with lamps
            },
            visible: false,
            width: 1600,
            height: 1200,
            widthMeters: 1600, // the width of the warehouse 8.5
            orderBeacons: []
        }
    }


    receiver = function (beaconList) {
        this.setState({beacons: beaconList})
        //this.beaconMacList();
        this.updateESPMacList()
        let beacons = this.beaconMacList()
        this.setState({sortedBeacons: beacons})
    }


    beaconMacList = () => {
        let objectList = {}
        let list = []
        let b = this.state.beacons
        if (typeof b === 'undefined' || Object.keys(b).length === 0) {
            return []
        }

        for (let beacon in b) {
            for (let mac in b[beacon]) {
                if (typeof objectList[mac] !== 'undefined') {
                    if (objectList[mac].rssi < b[beacon][mac].rssi) {
                        objectList = merge(objectList, b[beacon])
                    }
                } else {
                    objectList = merge(objectList, b[beacon])
                }
            }
        }

        for (let beacon in objectList) {
            list.push({mac: beacon, rssi: objectList[beacon].rssi, timestamp: objectList[beacon].timestamp})
        }
        return list.sort(function (a, b) {
            return a.rssi - b.rssi
        }).reverse()
    }


    updateESPMacList = () => {
        let b = this.state.beacons
        if (typeof b === 'undefined' || Object.keys(b).length === 0) {
            return []
        }

        let thisESPs = this.state.esps
        for (let beacon in b) {
            for (let esp in b[beacon]) {
                if (typeof thisESPs[esp] === 'undefined') {
                    thisESPs[esp] = {
                        x: Math.floor((Math.random() * 1600) + 1),
                        y: Math.floor((Math.random() * 1200) + 1)
                    }
                    this.setState({esps: thisESPs})
                }
            }
        }
    }

    componentDidMount() {
        // Start MQTT subscription
        new MQTT(this.receiver.bind(this))
        this.updateESPMacList()
    }

    render() {
        return (
            <div className="App">
                <Route path="/:id">
                    <Warehouse beacons={this.state.beacons} esps={this.state.esps}
                               orderBeacons={this.state.orderBeacons} height={this.state.height}
                               width={this.state.width} widthMeters={this.state.widthMeters}/>
                </Route>
            </div>
        )
    }
}

export default App
