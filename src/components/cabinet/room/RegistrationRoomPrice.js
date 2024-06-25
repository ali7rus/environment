import { useDispatch } from "react-redux";
import { updateRoomData } from "../../../store/room-slice";
import { useEffect } from "react";
import { useState } from "react";
import styles from "./RegistrationRoom.module.css";
import { useClientData } from "../../../store/hook";
import { useNavigate } from "react-router-dom";
import Card from "../../UI/Card";
import Button from "../../UI/Button";

function RegistrationRoom() {
  const { roomId, room } = useClientData();
  console.log("room prise", room);
  console.log("roomId prise", roomId);
  console.log('selectedDeposit prise',room.deposit);
  const [selectedDeposit, setSelectedDeposit] = useState(
   room?.deposit || null
  );
  const [bills, setBills] = useState(room?.bills|| 0);
  const [isChecked, setIsChecked] = useState( room?.isChecked || false);
  const [selectedTime, setSelectedTime] = useState(room?.time|| null);
  const [isShowTime, setIsShowTime] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [minMonths, setMinMonths] = useState(room?.minMonths || "");
  const [maxMonths, setMaxMonths] = useState(room?.maxMonths || "");
  const [price, setPrice] = useState(room?.price || 0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();



  useEffect(() => {
    if (selectedDeposit && selectedTime && price ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [selectedDeposit, selectedTime, price, bills]);

  const handleChangePriseAll = (event) => {
    setIsChecked(event.target.checked);
  };

  const data = {
    time: selectedTime,
    deposit: selectedDeposit,
    bills: bills,
    isChecked: isChecked,
    minMonths: minMonths,
    maxMonths: maxMonths,
    price: price,
  };

  const handleFormSubmit = (event, direction) => {
    event.preventDefault();
    dispatch(updateRoomData(roomId, data));

    const path = direction === "next" ? "/regroomlocation" : "/regroommain";
    navigate(path);
  };

  const handleChangeDeposit = (event) => {
    setSelectedDeposit(event.target.value);
  };

  const handleChangeTime = (event) => {
    setSelectedTime(event.target.value);
    if (event.target.value === "specific deadline") {
      setIsShowTime(true);
    } else {
      setIsShowTime(false);
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
              type="submit"
              onClick={(event) => handleFormSubmit(event, "next")}
            />
          )}
        </>
      }
    >
      <h2>Term and price of rent</h2>
      <form>
        <span className={styles.span}>
          How long do you want to rent out your property?
        </span>
        <div className={styles.container}>
          {["daily", "for a long time", "specific deadline"].map((time) => (
            <label className={styles.label} key={time}>
              {time}
              <input
                type="radio"
                name="time"
                id="time"
                value={time}
                checked={selectedTime === time}
                onChange={handleChangeTime}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>

        {isShowTime && (
          <div>
            <label htmlFor="minMonths">
              <span className={styles.span}>Minimum months: </span>{" "}
            </label>
            <input
              className={styles.numberInput}
              type="number"
              name="minMonths"
              id="minMonths"
              value={minMonths}
              onChange={(e) => setMinMonths(e.target.value)}
            />

            <label htmlFor="maxMonths">
              <span className={styles.span}>Maximum months: </span>
            </label>
            <input
              className={styles.numberInput}
              type="number"
              name="maxMonths"
              id="maxMonths"
              value={maxMonths}
              onChange={(e) => setMaxMonths(e.target.value)}
            />
          </div>
        )}

        <div
          className={selectedTime ? styles.separatorgreen : styles.separator}
        />
        <span className={styles.span}>
          What is the rental price in US dollars?
        </span>
        <div className={styles.container}>
          <input
            className={styles.numberInput}
            type="number"
            name="price"
            id="price"
            step="1"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
        <div className={price ? styles.separatorgreen : styles.separator} />
        <span className={styles.span}>Do you take a deposit?</span>
        <div className={styles.container}>
          {["Not", "For half a month", "for a whole month"].map((deposit) => (
            <label className={styles.label} key={deposit}>
              {deposit}
              <input
                type="radio"
                name="deposit"
                id="deposit"
                value={deposit}
                checked={selectedDeposit === deposit}
                onChange={handleChangeDeposit}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>
        <div
          className={selectedDeposit ? styles.separatorgreen : styles.separator}
        />
        {room?.structure !== "bunk-bed" && (
          <>
            <label htmlFor="bills">
              <span className={styles.span}>
                How much will utility bills in US dollars cost on average for a
                tenant?
              </span>
            </label>
            <div className={styles.container}>
              <input
                type="number"
                name="bills"
                className={styles.numberInput}
                id="bills"
                required
                autoComplete="off"
                value={bills}
                onChange={(event) => setBills(event.target.value)}
              />
            </div>
            <div className={bills ? styles.separatorgreen : styles.separator} />
            <div className={styles.container}>
              <label className={styles.label}>
                <span className={styles.span}>
                  Included in the rental price
                </span>
                <input
                  type="checkbox"
                  name="priceIncluded"
                  id="includePrice"
                  checked={isChecked}
                  onChange={handleChangePriseAll}
                  className={styles.radioInput}
                />
              </label>
            </div>
          </>
        )}
      </form>
    </Card>
  );
}

export default RegistrationRoom;
