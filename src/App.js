import React, {Component} from 'react';
import './App.css';
import Map from './Map.js'
import SideBar from "./SideBar.js";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            markers: [
                {
                  name: 'Bau House Dog Cafe',
                  address: '64 Yanghwa-ro, Seogyo-dong, Mapo-gu',
                  lat: 37.5503331,
                  long: 126.9157927
                },
                {
                  name: 'Hoho Myoll Cafe',
                  address: '93-44 Sangsu-dong, Mapo-gu',
                  lat: 37.5487998,
                  long: 126.9232059
                },
                {
                  name: 'Thanks Nature Cafe',
                  address: ' 486 Seogyo-dong, Mapo-gu, Seoul',
                  lat: 37.553716,
                  long: 126.9236241
                },
                {
                  name: 'Cafe the Bridge',
                  address: '37-3 Daehyeon-dong, Seodaemun-gu',
                  lat: 37.5587907,
                  long: 126.9438878,
                },
                {
                  name: 'Namusairo Coffee',
                  address: '21 Sajik-ro 8-gil, Sajik-dong, Jongno-gu',
                  lat: 37.5745951,
                  long: 126.9709533,
                },
                {
                  name: 'CoffeeLibre',
                  address: '74 Myeongdong-gil, Myeongdong 2(i)-ga, Jung-gu',
                  lat: 37.563177,
                  long: 126.9873604,
                },
                {
                  name: 'Cafe Gondry',
                  address: '140-23, Gye-dong, Jongno-gu',
                  lat: 37.5797836,
                  long: 126.9868237,
                }
              ],
            map: '',
            info: '',
            virtualMarkers: []
        };


        this.initMap = this.initMap.bind(this);
        this.generateMarkers = this.generateMarkers.bind(this);
        this.openMarker = this.openMarker.bind(this);
    }


    componentDidMount() {
        window.initMap = this.initMap;
        createMapLink('https://maps.googleapis.com/maps/api/js?key=AIzaSyB2pb9hqpcZGAW9q1n2qu1xsHtaeN5sapI&callback=initMap');
    }

    initMap() {
        let map;
        map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: {lat:  37.566535, lng: 126.9779692}
        });

        const infowindow = new window.google.maps.InfoWindow({});

        this.setState({map: map, info: infowindow});
        this.generateMarkers(map);
    }

    generateMarkers(map) {
        let self = this;

        this.state.markers.forEach(marker => {
            const loc = {lat: marker.lat, lng: marker.long}

            let mark = new window.google.maps.Marker({
                position: loc,
                map: map,
                title: marker.name
            });


            mark.addListener('click', function () {
                self.openMarker(mark);
            });

            let virtMarker = this.state.virtualMarkers;
            virtMarker.push(mark);

            this.setState({virtualMarkers: virtMarker});
        });
    }

    openMarker(marker = '') {
        const clientId = "BFVIQP0EGAAIUI11CBX1YTN1GO0T3HCHFI4ON112KK5FA4N1";
        const clientSecret = "2R1AMF1VTZ5IVA3DMJGH12MVUEA4QTGHH42ECOQNK2JIVT12";
        const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";

        // eslint-disable-next-line

        if (this.state.info.marker !== marker) {
            this.state.info.marker = marker;
            this.state.info.open(this.state.map, marker);
            marker.setAnimation(window.google.maps.Animation.DROP);


            this.state.info.addListener('closeClick', function () {
                this.state.info.setMarker(null);
            });

            this.markerInfo(url);
        }
    }

    markerInfo(url) {
        let self = this.state.info;
        let place;
        fetch(url)
            .then (function (resp) {
                if (resp.status !== 200) {
                    const err = "Sorry, data can't be loaded.";
                    this.setState({info: err});
                }

                resp.json().then(function (data) {
                    const place = data.response.venues[0];

                    var info =
                        "<div id='marker'>" +
                            "<h2>" + self.marker.title + "</h2>" +
                            "<p><b>Address:</b> " + place.location.address + "</p>" +
                        "</div>";
                    self.setContent(info);
                });

                console.log(place);
            })
            .catch(function (err) {
                const error = "Sorry, data can't be loaded.";
                self.setContent(error);
            });

    }


    render() {
        return (
            <div>
                <header>
                    <SideBar
                        infoWindow={this.state.info}
                        openInfo={this.openMarker}
                        virtualMarker={this.state.virtualMarkers}
                    >

                    </SideBar>
                    <h1 id="title">Coffee Shops in Seoul</h1>
                </header>
                <Map markers={this.state.markers}></Map>
            </div>
        );
    }
}

function createMapLink(url) {
    let tag = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');
    script.src = url;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded, please refresh the page.");
    };
    tag.parentNode.insertBefore(script, tag);
}
export default App;
