import React from 'react';
import StreetView from './StreetView';

class Man extends React.Component {

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
                <StreetView preserveAspectRatio="xMaxYMax meet"/>
            </svg>
        );
    }
}

export default Man;
