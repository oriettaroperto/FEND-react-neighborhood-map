import React, {Component} from 'react';

class SideBar extends Component {

    constructor() {
        super();

        this.state = {
            info: '',
            markers: [],
            query: ''
        };
    }

    componentDidMount() {
        this.setState({markers: this.props.virtualMarker});
    }

    open = () => {
        const sideBar = document.querySelector('.sideBar');

        sideBar.style.display === 'none' ? sideBar.style.display = 'block' : sideBar.style.display = 'none';
    }

    search = (event) => {
        const query = event.target.value.toLowerCase();
        const markers = this.props.virtualMarker;
        const newMarkers = [];

        markers.forEach(function (marker) {
            if (marker.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                marker.setVisible(true);
                newMarkers.push(marker);
            } else {
                marker.setVisible(false);
            }
        });

        this.setState({markers: newMarkers});
    }


    openMarker(marker) {
        console.log(marker);
        this.props.openInfo(marker);
    }

    render() {

        return (
            <div>
                <div className="hamburgerIcon" onClick={this.open}>
                    <div className="hamburger"></div>
                    <div className="hamburger"></div>
                    <div className="hamburger"></div>
                </div>
                <div className="sideBar">
                    <div className="form" role="form">
                        <input type="text"
                               aria-labelledby="filter" placeholder="Filter by Name..."
                               className="input" role="search"
                               onChange={this.search}/>
                    </div>
                    <ul>
                        {this.state.markers && this.state.markers.length && this.state.markers.map((marker, i) =>
                            <li key={i}>
                            <button onKeyPress={this.props.openInfo.bind(this, marker)}
                               onClick={this.props.openInfo.bind(this, marker)}
                               tabIndex="0">{marker.title}</button>
                            </li>
                        )}

                    </ul>
                </div>
            </div>
        );
    }
}

export default SideBar;
