import React, {Component} from 'react';
import ESP32 from './ESP32';

import './index.css';

class Product extends Component {
    state = {
        x: this.props.x,
        y: this.props.y,
        mac: this.props.mac
    };

    handleMouseDown = (e) => {
        this.xy = {
            x: e.pageX,
            y: e.pageY
        };
        document.addEventListener('mousemove', this.handleMouseMove);
    };

    handleMouseUp = () => {
        document.removeEventListener('mousemove', this.handleMouseMove);
        this.xy = {};
        this.props.setESPPosiotion({x: this.state.x, y: this.state.y, mac: this.props.mac});
    };

    handleMouseMove = (e) => {
        const xDiff = this.xy.x - e.pageX;
        const yDiff = this.xy.y - e.pageY;

        this.xy.x = e.pageX;
        this.xy.y = e.pageY;

        this.setState({
            x: this.state.x - xDiff,
            y: this.state.y - yDiff
        });
    };

    render() {
        const {x, y, mac} = this.state;
        return (
            <svg className="product-icon"
                 width="60px"
                 height="30px"
                 x={x}
                 y={y}
                 onMouseDown={this.handleMouseDown}
                 onMouseUp={this.handleMouseUp}>
                <ESP32 />
                <text x="0" y="12px">{mac.substr(9, 9)}</text>
            </svg>
        )
    }
}

export default Product;
