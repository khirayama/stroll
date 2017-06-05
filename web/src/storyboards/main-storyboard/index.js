import React, {Component} from 'react';

import {Link} from '../../libs/web-storyboard/components';

import Container from '../container';

import {Place} from '../../repositories';

const styles = {
  container: {
    width: '100%',
    height: '100%',
  },
};

class User {
  constructor() {
    this._pos = {
      lat: 0,
      lng: 0,
    };
  }
  fetchPosition(fast) {
    return new Promise(resolve => {
      window.navigator.geolocation.getCurrentPosition(({coords}) => {
        const position = {
          lat: coords.latitude,
          lng: coords.longitude,
        };
        resolve(position);
      });
    });
  }
  getPosition() {
    return this._pos;
  }
}

// class Place {
//   constructor() {
//     this._pos = {};
//   }
// }

class MapView extends Component {
  constructor() {
    super();

    this.state = {
      pos: {
        lat: -25.363,
        lng: 131.044,
      },
    };
    this._map = null;
    this.setRef = this._setRef.bind(this);
  }
  componentWillMount() {
    if (typeof window === 'object') {
      window.navigator.geolocation.getCurrentPosition(({coords}) => {
        console.log(coords);
        Place.nearBy({
          location: {
            lat: coords.latitude,
            lng: coords.longitude,
          },
          keyword: 'カフェ',
          radius: 300,
        }).then(res => {
          console.log(res);
        });
      }, () => {}, {
        enableHighAccuracy: false,
      });
    }
  }
  componentDidMount() {
    const intervalId = setInterval(() => {
      if (window.google) {
        this._renderMap();
        clearInterval(intervalId);
      } else {
        console.log('waiting');
      }
    }, 50);
  }
  _setRef(el) {
    this._el = el;
  }
  _renderMap() {
    this._map = new window.google.maps.Map(this._el, {
      zoom: 4,
      center: this.state.pos,
    });
    // const marker = new window.google.maps.Marker({
    //   position: uluru,
    //   map: map
    // });
  }
  render() {
    return <section ref={this.setRef} style={styles.container}></section>;
  }
}

export default class MainStoryboard extends Container {
  render() {
    return (
      <section style={styles.container}>
        <h1>Main</h1>
        <ul>
          <li><Link href="/profile">Profile</Link></li>
        </ul>
        <MapView />
      </section>
    );
  }
}
MainStoryboard.propTypes = {
};
