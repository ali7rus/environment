// import { useState, useRef } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
//   LayersControl,
//   ZoomControl,
// } from "react-leaflet";

// function Map(props) {
//   const { beacons, onAddBeacon, onDeleteBeacon } = props;
//   const [shouldAddMarker, setShouldAddMarker] = useState(true);
//   const mapRef = useRef(null);

//   function handleMapClick(event) {
//     if (shouldAddMarker) {
//       const { latlng } = event;
//       const newBeacon = {
//         position: [latlng.lat, latlng.lng],
//       };
//       onAddBeacon(newBeacon);
//     }
//   }

//   function handleBeaconDelete(index) {
//     setShouldAddMarker(false); // disable adding marker
//     onDeleteBeacon(index);
//   }

//   function handleMapClickAfterDelete(event) {
//     setShouldAddMarker(true); // enable adding marker again
//     handleMapClick(event);
//   }

//   function renderBeacons() {
//     return beacons.map((beacon, index) => (
//       <Marker key={index} position={beacon.position}>
//         <Popup>
//           <button onClick={() => handleBeaconDelete(index)}>X</button>
//         </Popup>
//       </Marker>
//     ));
//   }

//   return (
//     <MapContainer center={[53.9045419, 27.5615233]} zoom={13} ref={mapRef}>
//       <LayersControl position="topright">
//         <LayersControl.BaseLayer name="OSM" checked>
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         </LayersControl.BaseLayer>
//         <LayersControl.BaseLayer name="Satellite">
//           <TileLayer url="https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=bbh1JnT1TSCAmX9APdmK" />
//         </LayersControl.BaseLayer>
//       </LayersControl>
//       <ZoomControl position="bottomright" />
//       {renderBeacons()}
//       <AddBeaconControl onClick={handleMapClickAfterDelete} />
//     </MapContainer>
//   );
// }

// import "./Map.css";
// import { useState, useRef } from "react";

// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   LayersControl,
//   ZoomControl,
//   MapEvents,
// } from "react-leaflet";

// const Map = (props) => {
//   const { beacons, onAddBeacon, onDeleteBeacon } = props;
//   const [shouldAddMarker, setShouldAddMarker] = useState(true);
//   const mapRef = useRef(null);

//   function handleMapClick(event) {
//     if (shouldAddMarker) {
//       const { latlng } = event;
//       const newBeacon = {
//         // type: "main street",
//         position: [latlng.lat, latlng.lng],
//       };
//       onAddBeacon(newBeacon);
//     }
//   }

//   function handleBeaconDelete(index) {
//     setShouldAddMarker(false); // disable adding marker
//     onDeleteBeacon(index);
//   }

//   function handleMapClickAfterDelete(event) {
//     setShouldAddMarker(true); // enable adding marker again
//     handleMapClick(event);
//   }

//   console.log(beacons);
//   function renderBeacons() {
//     return beacons.map((beacon, index) => (
//       <Marker key={index} position={beacon.position}>
//         <Popup>
//           {/* {beacon.type} <br /> */}
//           <button onClick={() => handleBeaconDelete(index)}>X</button>
//         </Popup>
//       </Marker>
//     ));
//   }

//   return (
//     <MapContainer
//       className="mymap"
//       center={[40.179, 44.499]}
//       zoom={13}
//       whenCreated={(map) => (mapRef.current = map)}
//     >
//       <LayersControl position="topright">
//         <LayersControl.BaseLayer name="Map">
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//         </LayersControl.BaseLayer>
//         <LayersControl.BaseLayer name="Satellite">
//           <TileLayer
//             url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
//             subdomains={["mt0", "mt1", "mt2", "mt3"]}
//           />
//         </LayersControl.BaseLayer>
//       </LayersControl>
//       {renderBeacons()}
//       <ZoomControl position="bottomright" />
//       <MapEvents onClick={handleMapClickAfterDelete} />
//     </MapContainer>
//   );
// };

// export default Map;

// import { OpenStreetMapProvider } from "leaflet-geosearch";




// async function getAddressFromCoordinates(lat, lng) {
//     const provider = new OpenStreetMapProvider();
//     const results = await provider.reverse({ lat, lon: lng });
//     if (results.length > 0) {
//       const address = results[0].label.split(",");
//       const city = address[address.length - 2].trim();
//       const street = address[0].trim();
//       const metro = await getNearestMetro(lat, lng);
//       console.log(`Район: ${city}, Улица: ${street}, Ближайшее метро: ${metro}`);
//       return (
//         <>
//           <span>Район: {city}</span>
//           <br />
//           <span>Улица: {street}</span>
//           <br />
//           <span>Ближайшее метро: {metro}</span>
//         </>
//       );
//     }
//   }
  
//   async function getNearestMetro(lat, lng) {
//     const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
//     const response = await fetch(url);
//     const data = await response.json();
//     if (data.address && data.address.nearest) {
//       return data.address.nearest;
//     }
//     return "не найдено";
//   }

// import React, { useState } from 'react';
// import styles from './YourStylesFile.css'; // Импортируйте файл со стилями, если это необходимо

// function DropdownButton({ dispatchAction, mainActions }) {
//   const [isDropdownVisible, setIsDropdownVisible] = useState(false);

//   const handleButtonClick = (e) => {
//     setIsDropdownVisible(!isDropdownVisible);
//   };

//   const handleOptionClick = (value) => {
//     dispatchAction(mainActions.setCity(value));
//     setIsDropdownVisible(false);
//   };

//   return (
//     <div>
//       <button className="dropbtn" onClick={handleButtonClick}>
//         <img
//           className="disabledImage"
//           src="https://img.icons8.com/color-glass/28/null/city-buildings.png"
//           alt=""
//         />
//       </button>
//       {isDropdownVisible && (
//         <div className={styles.dropdownContent}>
//           <option value="" onClick={() => handleOptionClick("")}></option>
//           <option value="Ереван" onClick={() => handleOptionClick("Ереван")}>
//             Ереван
//           </option>
//           <option value="Москва" onClick={() => handleOptionClick("Москва")}>
//             Москва
//           </option>
//           <option
//             value="Санкт-Петербург"
//             onClick={() => handleOptionClick("Санкт-Петербург")}
//           >
//             Санкт-Петербург
//           </option>
//           <option value="Тбилиси" onClick={() => handleOptionClick("Тбилиси")}>
//             Тбилиси
//           </option>
//           <option value="Стамбул" onClick={() => handleOptionClick("Стамбул")}>
//             Стамбул
//           </option>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DropdownButton;

