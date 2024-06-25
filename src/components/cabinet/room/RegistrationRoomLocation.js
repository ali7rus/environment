import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateRoomData } from "../../../store/room-slice";
import { useClientData } from "../../../store/hook";
import Card from "../../UI/Card";
import styles from "./RegistrationRoom.module.css";
import Button from "../../UI/Button";

function RegistrationRoomLocation() {
  const { roomId, room } = useClientData();
  const [locatHouse, setLocatHouse] = useState(room?.locatHouse || "");
  const [floor, setFloor] = useState(room?.floor || "");
  const [aboutApartment, setMessage] = useState(room?.aboutApartment || "");
  const [map, setMap] = useState(room?.map || "");
  const [street, setStreet] = useState(room?.name || "");
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (map && street && locatHouse && floor && aboutApartment) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [map, street, locatHouse, floor, aboutApartment]);


  const data = {
    status: "finished",
    map: map,
    name: street,
    locatHouse: locatHouse,
    floor: floor,
    aboutApartment: aboutApartment,
  };


  const handleFormSubmit = async (event, direction) => {
    event.preventDefault();
    await dispatch(updateRoomData(roomId, data));
    if (direction === "next") {
      // await dispatch(roomAction.setRoom(roomId));
      navigate("/protected");
    } else if (direction === "plus") {
      navigate("/regroomadvants");
    } else {
      navigate("/regroomprice");
    }
  };

  return (
    <Card
      buttons={
        <>
          <Button
            type="button"
            onClick={(event) => handleFormSubmit(event, "previous")}
          />
          {isFormValid && (
            <Button
              className={styles.prevButton}
              type="button1"
              onClick={(event) => handleFormSubmit(event, "plus")}
            />
          )}
          {isFormValid && (
            <Button
              className={styles.prevButton}
              type="submit"
              onClick={(event) => handleFormSubmit(event, "next")}
            />
          )}
        </>
      }
    >
      <h2>Location</h2>
      <form>
        <span className={styles.span}>In what city?</span>
        <select
          name="map"
          className={styles.textInput}
          id="selectItem"
          value={map}
          onChange={(event) => setMap(event.target.value)}
          required
        >
          <option value=""></option>
          <option value="Ереван">Ереван</option>
          <option value="Москва">Москва</option>
          <option value="Санкт-Петербург">Санкт-Петербург</option>
          <option value="Тбилиси">Тбилиси</option>
          <option value="Стамбул">Стамбул</option>
        </select>
        <div className={map ? styles.separatorgreen : styles.separator} />
        <span className={styles.span}>
          What is the name of the street and the house number?
        </span>
        <div className={styles.container}>
          <input
            type="text"
            name="str"
            className={styles.textInput}
            id="str"
            required
            autoComplete="off"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
          />
        </div>
        <div className={street ? styles.separatorgreen : styles.separator} />
        <label htmlFor="locat">
          <span className={styles.span}>
            In what area of the city is housing located?
          </span>
        </label>
        <div className={styles.container}>
          <input
            type="text"
            name="locat"
            className={styles.textInput}
            id="locat"
            required
            autoComplete="off"
            value={locatHouse}
            onChange={(event) => setLocatHouse(event.target.value)}
          />
        </div>
        <div
          className={locatHouse ? styles.separatorgreen : styles.separator}
        />
        <label htmlFor="floor">
          <span className={styles.span}>
            On which floor is the accommodation located?
          </span>
        </label>
        <div className={styles.container}>
          <input
            type="number"
            name="floor"
            className={styles.textInput}
            id="floor"
            required
            autoComplete="off"
            value={floor}
            onChange={(event) => setFloor(event.target.value)}
          />
        </div>
        <div className={floor ? styles.separatorgreen : styles.separator} />
        <label htmlFor="msg">
          <span className={styles.span}>
            Tell us about your apartment and the tenants you would like to move
            there.
          </span>
        </label>
        <div className={styles.container}>
          <textarea
            name="aboutme"
            rows="2"
            className={styles.textInput}
            id="msg"
            required
            autoComplete="off"
            value={aboutApartment}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
        <div
          className={aboutApartment ? styles.separatorgreen : styles.separator}
        />
      </form>
    </Card>
  );
}

export default RegistrationRoomLocation;


