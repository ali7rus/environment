import { useDispatch } from "react-redux";
import { updatePersonData } from "../../../store/user-slice";
import { useEffect } from "react";
import { useState } from "react";
import { useClientData } from "../../../store/hook";
import { useNavigate } from "react-router-dom";
import Button from "../../UI/Button";
import Card from "../../UI/Card";
import styles from "../room/RegistrationRoom.module.css";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { addMonths, parseISO } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

function RegistrationUserSundry() {
  const { personId, person } = useClientData();
  const [startDate, setStartDate] = useState(
    person?.startDate ? parseISO(person?.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    person?.endDate ? parseISO(person?.endDate) : addMonths(new Date(), 1)
  );

  const [selectedRoom, setSelectedRoom] = useState(
    person?.roommate || null
  );

  const [selectedNeighbour, setSelectedNeighbour] = useState(
    person?.neighbour || null
  );

  const [selectedMap, setSelectedMap] = useState(person?.map || null);

  const [selectedMeet, setSelectedMeet] = useState(person?.meet || null);

  const [selectedDistrict, setSelectedDistrict] = useState(
    person?.district || ""
  );

  const [selectedAmount, setSelectedAmount] = useState(person?.amount || 0);

  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      selectedRoom &&
      selectedNeighbour &&
      startDate &&
      endDate &&
      selectedAmount
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [selectedRoom, selectedNeighbour, startDate, endDate, selectedAmount]);

  const data = {
    amount: selectedAmount,
    neighbour: selectedNeighbour,
    meet: selectedMeet,
    startDate: startDate,
    endDate: endDate,
    room: selectedRoom,
    status: "finished",
  };

  const handleChangeRoom = (event) => {
    setSelectedRoom(event.target.value);
  };

  const handleChangeNeighbour = (event) => {
    setSelectedNeighbour(event.target.value);
  };

  const handleChangeMap = (event) => {
    setSelectedMap(event.target.value);
  };

  const handleChangeMeet = (event) => {
    setSelectedMeet(event.target.value);
  };

  const handleFormSubmit = async (event, direction) => {
    event.preventDefault();
    await dispatch(updatePersonData(personId, data));
    if (direction === "next") {
      navigate("/protected");
    } else if (direction === "plus") {
      navigate("/reguseradvants");
    } else {
      navigate("/regusermain");
    }
  };

  return (
    <Card
      buttons={
        <>
          <Button
            type="button"
            onClick={(event) => handleFormSubmit(event, "previous")}
          />{" "}
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
      <h2>Personal information</h2>
      <form>
       
        <span className={styles.span}>
          Do you have an apartment?
        </span>
        <div className={styles.container}>
          {["yes", "not", "i plan"].map((room) => (
            <label className={styles.label} key={room}>
              {room}
              <input
                type="radio"
                name="room"
                id="room"
                value={room}
                checked={selectedRoom === room}
                onChange={handleChangeRoom}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>
        <div
          className={
            selectedRoom ? styles.separatorgreen : styles.separator
          }
        />

        <span className={styles.span}>
          Who would you like to rent a apartment with?
        </span>
        <div className={styles.container}>
          {["male", "female", "male or female"].map((neighbour) => (
            <label className={styles.label} key={neighbour}>
              {neighbour}
              <input
                type="radio"
                name="neighbour"
                id="neighbour"
                value={neighbour}
                checked={selectedNeighbour === neighbour}
                onChange={handleChangeNeighbour}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>
        <div
          className={
            selectedNeighbour ? styles.separatorgreen : styles.separator
          }
        />

        <Form.Group controlId="mapSelector">
          <Form.Label>Where do you plan to live?</Form.Label>
          <Form.Select  style={{ 
            backgroundColor: "#333", 
            color: "#fff", 
            fontSize: "1.2em",
            border: "none" 
        }} onChange={handleChangeMap} value={selectedMap}>
            <option value="Yerevan">Yerevan</option>
            <option value="Tbilisi">Tbilisi</option>
            <option value="Istanbul">Istanbul</option>
            <option value="Moscow">Moscow</option>
            <option value="Saint-Petersburg">Saint-Petersburg</option>
            <option value="Astana">Astana</option>
          </Form.Select>
        </Form.Group>
        <div
          className={selectedMap ? styles.separatorgreen : styles.separator}
        />

        <span className={styles.span}>
          In which area or on which street would you like to live or already
          live in the town {selectedMap}?
        </span>
        <div className={styles.container}>
          <input
            type="text"
            name="district"
            className={styles.textInput}
            id="dstrict"
            required
            autoComplete="off"
            value={selectedDistrict}
            onChange={(event) => setSelectedDistrict(event.target.value)}
          />
        </div>
        <div
          className={
            selectedDistrict ? styles.separatorgreen : styles.separator
          }
        />

        <span className={styles.span}>
          What is the maximum amount in dollars you are willing to pay for
          renting an apartment or room?
        </span>
        <div className={styles.container}>
          <input
            type="number"
            name="amount"
            className={styles.numberInput}
            id="amount"
            required
            autoComplete="off"
            value={selectedAmount}
            onChange={(event) => setSelectedAmount(event.target.value)}
          />
        </div>
        <div
          className={selectedAmount ? styles.separatorgreen : styles.separator}
        />

        <span className={styles.span}> Duration of stay?</span>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
        />
        <div
          className={
            endDate && startDate ? styles.separatorgreen : styles.separator
          }
        />

<span className={styles.span}>Convenient time for a meeting?</span>
        <div className={styles.container}>
          {["any day", "weekend", "certain time"].map((meet) => (
            <label className={styles.label} key={meet}>
              {meet}
              <input
                type="radio"
                name="meet"
                id="meet"
                value={meet}
                checked={selectedMeet === meet}
                onChange={handleChangeMeet}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>
        <div
          className={selectedMeet ? styles.separatorgreen : styles.separator}
        />
      </form>
    </Card>
  );
}

export default RegistrationUserSundry;
