import React from 'react';

import {Link} from '../../libs/web-storyboard/components';

import {Place} from '../../repositories';

import Container from '../container';
import MapView from '../../components/map-view';

function isBrowser() {
  return typeof window === 'object';
}

export default class MainStoryboard extends Container {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, this.state, {
      mapCenter: {
        lat: 0,
        lng: 0,
      },
      places: [],
      keyword: '',
    });

    this.handleChangeInput = this._handleChangeInput.bind(this);
    this.handleLoadMap = this._handleLoadMap.bind(this);
    this.handleDragEndMap = this._handleDragEndMap.bind(this);
  }
  componentWillMount() {
    super.componentWillMount();

    if (isBrowser()) {
      window.navigator.geolocation.getCurrentPosition(({coords}) => {
      }, () => {}, {
        enableHighAccuracy: false,
      });
    }
  }
  _handleChangeInput(event) {
    this.setState({
      keyword: event.currentTarget.value.trim(),
    });
    this._fetchPlace();
  }
  _handleLoadMap(mapCenter) {
    this.setState({
      mapCenter: mapCenter,
    });
    this._fetchPlace();
  }
  _handleDragEndMap(mapCenter) {
    this.setState({
      mapCenter: mapCenter,
    });
    this._fetchPlace();
  }
  _fetchPlace() {
    if (this.state.keyword) {
      const query = {
        location: this.state.mapCenter,
        query: this.state.keyword,
        radius: 1200,
      };
      Place.textSearch(query).then(({results}) => {
        // console.log(results);
        // console.log(results[0]);
        // results.forEach(result => {
        //   console.log(result);
        // });
        this.setState({
          places: results,
        });
      });
    } else {
      this.setState({
        places: [],
      });
    }
  }
  render() {
    return (
      <section className="storyboard main-storyboard">
        <header className="main-storyboard--header">
          <div className="main-storyboard--header--left">
            <div className="main-storyboard--header--profile-link">
              <Link href="/profile">P</Link>
            </div>
          </div>
          <div className="main-storyboard--header--center">
            <h1>Stroll</h1>
          </div>
          <div className="main-storyboard--header--right">
            <div className="main-storyboard--header--search-button">
              <Link href="/profile">S</Link>
            </div>
          </div>
        </header>
        <section className="main-storyboard--content">
          <section className="main-storyboard--search-view">
            <input value={this.state.value} onChange={this.handleChangeInput}/>
            <ul>{this.state.places.map(place => <li key={place.id}>{place.name}</li>)}</ul>
          </section>
          <MapView
            className="main-storyboard--map-view"
            places={this.state.places || []}
            onLoad={this.handleLoadMap}
            onDragEnd={this.handleDragEndMap}
          />
        </section>
      </section>
    );
  }
}
MainStoryboard.propTypes = {
};
