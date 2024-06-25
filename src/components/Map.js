import "./Map.css";
import { useMap } from "react-leaflet";
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  LayersControl,
  ZoomControl,
} from "react-leaflet";
import { useEffect } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { useSelector } from "react-redux";
const Map = (props) => {
  const { beacons, onAddBeacon, onDeleteBeacon } = props;
  const [shouldAddMarker, setShouldAddMarker] = useState(true);
  const [center, setCenter] = useState([55.7504461, 37.6174943]);
  //console.log(center);

  const city = useSelector((state) => state.main.city);
  useEffect(() => {
    const fetchCityCoordinates = async () => {
      const coordinates = await getCityCoordinates(city);
      if (coordinates) {
        setCenter(coordinates);
      }
    };

    fetchCityCoordinates();
  }, [city]);

  function handleMapClick(event) {
    if (shouldAddMarker) {
      const { latlng } = event;

      const newBeacon = {
        position: [latlng.lat, latlng.lng],
      };

      onAddBeacon(newBeacon);
    }
  }
  function handleBeaconDelete(index) {
    setShouldAddMarker(false); // disable adding marker
    onDeleteBeacon(index);
  }

  function handleMapClickAfterDelete(event) {
    setShouldAddMarker(true); // enable adding marker again
    handleMapClick(event);
  }
  // props.OnBeacoms(beacons);
  //console.log(beacons);
  function renderBeacons() {
    if (!beacons) {
      return null;
    }
    return beacons.map((beacon, index) => (
      <Marker key={index} position={beacon.position}>
        <Popup>
          <button onClick={() => handleBeaconDelete(index)}>X</button>
        </Popup>
      </Marker>
    ));
  }

  return (
    <MapContainer className="mymap" zoom={13} center={center}  scrollWheelZoom={false}>
      <MapUpdater center={center}></MapUpdater>
      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Map" checked>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      {renderBeacons()}
      <ZoomControl position="bottomright" />
      <MapClickHandler onClick={handleMapClickAfterDelete} />
    </MapContainer>
  );
};

function MapClickHandler({ onClick }) {
  const map = useMapEvents({
    click(event) {
      onClick(event);
    },
  });
  return null;
}
export default Map;

const getCityCoordinates = async (cityName) => {
  const provider = new OpenStreetMapProvider();
  const results = await provider.search({ query: cityName });

  if (results && results.length > 0) {
    return [results[0].y, results[0].x];
  }

  return null;
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}
