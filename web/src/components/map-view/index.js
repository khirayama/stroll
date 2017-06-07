import React, {Component} from 'react';

import MapUser from './map-user';
import MapPlace from './map-place';

export default class MapView extends Component {
  constructor() {
    super();

    this._map = null;
    this._user = null;
    this._places = [];

    this.setRef = this._setRef.bind(this);
  }
  componentDidMount() {
    const intervalId = setInterval(() => {
      if (window.google) {
        this._initialize();
        clearInterval(intervalId);
      }
    }, 50);
  }
  _setRef(el) {
    this._el = el;
  }
  _initialize() {
    this._user = new MapUser();
    this._map = new window.google.maps.Map(this._el, {
      zoom: 15,
      center: this._user.getPosition(),
    });

    this._user.setMap(this._map);
    this._user.addPositionChangeListener((pos) => {
      this._user.setPosition(pos);
    });

    this._map.addListener('dragend', () => {
      const center = this._map.getCenter();
      const position = {
        lat: center.lat(),
        lng: center.lng(),
      };
      this.props.onDragEnd(position);
    });

    const center = this._map.getCenter();
    const position = {
      lat: center.lat(),
      lng: center.lng(),
    };
    this.props.onLoad(position);
  }
  componentDidUpdate() {
    console.log(this.props.places);
    this._clearPlaces();
    this.props.places.forEach(place => {
      this._places.push(new MapPlace(this._map, place));
    });
  }
  _clearPlaces() {
    this._places.forEach((place, index) => {
      place.clear();
    });
    this._places = [];
  }
  render() {
    return (
      <section className="map-view">
        <div onClick={() => {
          this._user.fetchPosition();
          this._map.panTo(this._user.getPosition());
        }}>current</div>
        <section className="map-view--map" ref={this.setRef}></section>
      </section>
    );
  }
}

