import React from 'react';
import MapMarker from './MapMarker';

class Pin extends React.Component {

    render() {
        let width = this.props.width || 40;
        let height = this.props.height || 40;
        return (
            <svg
                id={this.props.mac}
                viewBox={"0 0 " + width + " " + height}
                width={width}
                height={height}
                x={this.props.x}
                y={this.props.y}
            >
                <MapMarker preserveAspectRatio="xMaxYMax meet"/>
            </svg>
        );
    }
}

export default Pin;
