function isBrowser() {
  return typeof window === 'object';
}

export default class MapUser {
  constructor(map = null) {
    this._listeners = [];

    this._map = map;
    this._pos = this._loadPos();
    this._marker = new window.google.maps.Marker({
      position: this._pos,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillOpacity: 1,
        fillColor: '#6666ee',
        strokeOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
        scale: 8, //pixels
      },
    });

    this._fetchPos();
    this._watchPos();
  }
  _loadPos() {
    if (isBrowser()) {
      const HakataStation = {
        lat: 33.5902414,
        lng: 130.4190332,
      };
      return JSON.parse(window.localStorage.getItem('__map_user_position')) || HakataStation;
    }
  }
  _savePos() {
    if (isBrowser()) {
      return window.localStorage.setItem('__map_user_position', JSON.stringify(this._pos));
    }
  }
  fetchPosition() {
    this._fetchPos();
  }
  _fetchPos() {
    if (isBrowser()) {
      window.navigator.geolocation.getCurrentPosition(({coords}) => {
        this._pos = {
          lat: coords.latitude,
          lng: coords.longitude,
        };
        this._savePos();
        this._emit();
      }, () => {}, {
        enableHighAccuracy: false,
      });
    }
  }
  _watchPos() {
    if (isBrowser()) {
      window.navigator.geolocation.watchPosition(({coords}) => {
        this._pos = {
          lat: coords.latitude,
          lng: coords.longitude,
        };
        this._savePos();
        this._emit();
      }, () => {}, {
        enableHighAccuracy: true,
      });
    }
  }
  _emit() {
    this._listeners.forEach(listener => {
      listener.apply(this, [this._pos]);
    });
  }
  addPositionChangeListener(listener) {
    this._listeners.push(listener);
  }
  getPosition() {
    return this._pos;
  }
  setPosition(pos) {
    this._pos = pos;
    this._marker.setPosition(this._pos);
  }
  setMap(map = null) {
    this._map = map;
    this._marker.setMap(this._map);
  }
}
