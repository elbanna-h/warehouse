import React from 'react'
import axios from 'axios'
//background image
import floor_image_file from './images/warehouse.jpg'
import './index.css'
import Pin from './Pin'
import Man from './Man'
import Product from './Product'
import {myPlace} from './XYCalculator.js'

import { withRouter } from "react-router-dom";


class Warehouse extends React.Component {
    constructor(props) {
        super(props)
        this.xys = {}
        const espsData = localStorage.getItem('esps')
        if (typeof espsData === 'undefined') {
            // init
        } else {
            this.state = {
                esps: JSON.parse(espsData),
                orderBeacons: []
            }
        }
        this.updateBeaconPositions()
    };

    componentDidMount() {
        const id = this.props.match.params.id;
        const config = {
            headers: {
                Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjI0MjU5NDM2LCJqdGkiOiJmMDRhOTA2ODNiY2U0NWZmOWZiOTc4YjRiOWExZDAwOSIsInVzZXJfaWQiOjF9.5m4ek7FnhFGtqxHpUypfmxUjVXJezgQ_67MeBua1zNc`
            }
        }
        axios.get(`https://ecom360.herokuapp.com/api/orders/${id}/`, config)
            .then(res => {
                const orderBeaconsData = res.data;
                this.setState({ orderBeacons:  orderBeaconsData.orderItems});
            })
    }

    productPos = function (p) {
        // console.log(p)
        let espsData = this.props.esps
        espsData[p.mac] = {
            x: p.x,
            y: p.y
        }
        this.setState({esps: espsData})
        localStorage.setItem('esps', JSON.stringify(espsData))
    }

    updateBeaconPositions = function () {
        // Beacons
        this.beaconXYs = {}
        if (this.props.beacons) {
            let b = this.props.beacons
            for (let key in b) {
                if (Object.keys(b[key]).length >= 3 && Object.keys(this.props.esps).length >= 3) {
                    // CALCULATE POSITION COORDINATES
                    let xys = myPlace(b[key], this.props.esps, (this.props.width / this.props.widthMeters))

                    if (xys !== null) {
                        this.beaconXYs[key] = xys
                    } else {
                        console.log('Failed to get place:')
                        console.debug(b[key])
                    }
                } else {

                }
            }
        }
    }

    render() {
        let espIcons
        let beaconIcons
        // Products
        let espsData = this.props.esps
        console.log('esps: ' + Object.keys(this.props.esps))
        console.log('Hany Warehouse, num esps: ' + Object.keys(this.props.esps).length)
        if (Object.keys(this.props.esps).length >= 3) {
            espIcons = Object.keys(espsData).map(key =>
                <Product key={key} mac={key} x={espsData[key].x} y={espsData[key].y}
                         setESPPosiotion={this.productPos.bind(this)}></Product>
            )
        }
        // console.log(this.props.esps) //for debug
        // Beacons
        this.updateBeaconPositions()
        if (Object.keys(this.beaconXYs).length > 0) {
            beaconIcons = Object.keys(this.beaconXYs).map(key =>
                key === 'dd:33:16:00:03:4a' ?
                    <Man key={key} mac={key} x={this.beaconXYs[key].x} y={this.beaconXYs[key].y}/>
                    :
                    this.state.orderBeacons.map(orderBeacon => orderBeacon.beacon === key && <Pin key={key} mac={key} x={this.beaconXYs[key].x} y={this.beaconXYs[key].y}></Pin>)
            )
        }
        return (
            <svg className="warehouse" viewBox={'0 0 ' + this.props.width + ' ' + this.props.height}
                 width={this.props.width} height={this.props.height}
                 style={{backgroundImage: 'url(' + floor_image_file + ')'}}>
                {beaconIcons}
                {espIcons}
            </svg>
        )
    }
}

export default withRouter(Warehouse)
