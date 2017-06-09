function isBrowser() {
  return typeof window === 'object';
}

export default class MapPlace {
  constructor(map = null, place = {}) {
    this._map = map;

    this._id = place.id;
    this._name = place.name;
    this._icon = place.icon;
    this._pos = place.geometry.location;

    this._marker = new window.google.maps.Marker({
      map: this._map,
      position: this._pos,
      label: {
        text: this._name,
        color: '#666',
        fontSize: '14px',
      },
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillOpacity: 1,
        fillColor: '#ee6666',
        strokeOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
        scale: 8, //pixels
      },
    });
  }
  addEventListener(eventType, callback) {
    this._marker.addListener(eventType, callback.bind(this));
  }
  clear() {
    this._marker.setMap(null);
  }
  getId() {
    return this._id;
  }
  getName() {
    return this._name;
  }
}
