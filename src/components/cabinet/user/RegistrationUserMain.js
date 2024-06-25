import { useDispatch } from "react-redux";
import { updatePersonData } from "../../../store/user-slice";
import { useEffect } from "react";
import { useState } from "react";
import { useClientData } from "../../../store/hook";
import { useNavigate } from "react-router-dom";
import Button from "../../UI/Button";
import Card from "../../UI/Card";
import styles from "../room/RegistrationRoom.module.css";
function RegistrationUserMain() {
  const { personId, person } = useClientData();

  const [selectedRelationship, setSelectedRelationship] = useState(
    person?.relationship || null
  );

  const [selectedMate, setSelectedMate] = useState(person?.partners || null);

  const [selectedMeet, setSelectedMeet] = useState(person?.convenient || null);

  const [selectedCook, setSelectedCooking] = useState(person?.сooking || null);

  const [selectedAlcohol, setSelectedAlcohol] = useState(
    person?.drinking || null
  );
  const [selectedSmoke, setSelectedSmoke] = useState(person?.smoking || null);

  const [selectedRoommate, setSelectedRoommate] = useState(
    person?.roommate || null
  );

  const [isChecked, setIsChecked] = useState(person?.isChecked || false);

  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      selectedRelationship &&
      selectedCook &&
      selectedAlcohol &&
      isChecked &&
      selectedRoommate &&
      selectedSmoke
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    isChecked,
    selectedRelationship,
    selectedCook,
    selectedAlcohol,
    selectedSmoke,
    selectedRoommate,
  ]);

  const handleChangeRelationship = (event) => {
    setSelectedRelationship(event.target.value);
  };

  const handleChangeMate = (event) => {
    setSelectedMate(event.target.value);
  };

  const handleChangeMeet = (event) => {
    setSelectedMeet(event.target.value);
  };

  const handleChangeCooking = (event) => {
    setSelectedCooking(event.target.value);
  };

  const handleChangeAlcohol = (event) => {
    setSelectedAlcohol(event.target.value);
  };

  const handleChangeSmoke = (event) => {
    setSelectedSmoke(event.target.value);
  };

  const handleChangeRoommate = (event) => {
    setSelectedRoommate(event.target.value);
  };

  const handleChangeRestrictions = (event) => {
    setIsChecked(event.target.checked);
  };

  let data;

  if (setSelectedRoommate === "not") {
    data = {
      amount: false,
      neighbour: false,
      meet: false,
      startDate: false,
      endDate: false,
      room: false,
      relationship: selectedRelationship,
      partners: selectedMate,
      convenient: selectedMeet,
      сooking: selectedCook,
      drinking: selectedAlcohol,
      smoking: selectedSmoke,
      roommate: selectedRoommate,
      isChecked: isChecked,
      status: "finished",
    };
  } else {
    data = {
      relationship: selectedRelationship,
      partners: selectedMate,
      convenient: selectedMeet,
      сooking: selectedCook,
      drinking: selectedAlcohol,
      smoking: selectedSmoke,
      roommate: selectedRoommate,
      isChecked: isChecked,
    };
  }

  if (selectedMeet === "not") {
    data.convenient = false;
  }

  const handleFormSubmit = async (event, direction) => {
    event.preventDefault();
    await dispatch(updatePersonData(personId, data));
    if (direction === "next" && selectedRoommate === "not") {
      navigate("/protected");
    } else if (direction === "next") {
      navigate("/regusersundry");
    } else if (direction === "plus") {
      navigate("/reguseradvants");
    } else {
      navigate("/regusergeneral");
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
          {isFormValid && selectedRoommate === "not" && (
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
        <span className={styles.span}>Are you in a relationship?</span>
        <div className={styles.container}>
          {["yes", "not", "married", "broke up or divorced"].map(
            (relationship) => (
              <label className={styles.label} key={relationship}>
                {relationship}
                <input
                  type="radio"
                  name="ralationship"
                  id="ralationship"
                  value={relationship}
                  checked={selectedRelationship === relationship}
                  onChange={handleChangeRelationship}
                  className={styles.radioInput}
                />
              </label>
            )
          )}
        </div>
        <div
          className={
            selectedRelationship ? styles.separatorgreen : styles.separator
          }
        />

        <span className={styles.span}>Are you looking for a partner?</span>
        <div className={styles.container}>
          {["yes", "not", "not sure"].map((mate) => (
            <label className={styles.label} key={mate}>
              {mate}
              <input
                type="radio"
                name="mate"
                id="mate"
                value={mate}
                checked={selectedMate === mate}
                onChange={handleChangeMate}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>
        <div
          className={selectedMate ? styles.separatorgreen : styles.separator}
        />

        {selectedMate !== "not" && (
          <>
            <span className={styles.span}>A convenient time for a date?</span>
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
              className={
                selectedMeet ? styles.separatorgreen : styles.separator
              }
            />
          </>
        )}

        <span className={styles.span}>
          You rarely cook, if so, what do you eat?
        </span>
        <div className={styles.container}>
          {[
            "often",
            "semi-finisheds",
            "fast food",
            "cafes&canteens",
            "the above",
          ].map((cook) => (
            <label className={styles.label} key={cook}>
              {cook}
              <input
                type="radio"
                name="cook"
                id="cook"
                value={cook}
                checked={selectedCook === cook}
                onChange={handleChangeCooking}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>
        <div
          className={selectedCook ? styles.separatorgreen : styles.separator}
        />

        <span className={styles.span}>How often do you drink?</span>
        <div className={styles.container}>
          {["rarely", "on  weekends", "often", " on big holidays", "never"].map(
            (alcohol) => (
              <label className={styles.label} key={alcohol}>
                {alcohol}
                <input
                  type="radio"
                  name="gender"
                  id="gender"
                  value={alcohol}
                  checked={selectedAlcohol === alcohol}
                  onChange={handleChangeAlcohol}
                  className={styles.radioInput}
                />
              </label>
            )
          )}
        </div>
        <div
          className={selectedAlcohol ? styles.separatorgreen : styles.separator}
        />

        <span className={styles.span}>Do you smoke?</span>
        <div className={styles.container}>
          {["cigarettes", "vape", "icos", "not"].map((smoke) => (
            <label className={styles.label} key={smoke}>
              {smoke}
              <input
                type="radio"
                name="smoke"
                id="smoke"
                value={smoke}
                checked={selectedSmoke === smoke}
                onChange={handleChangeSmoke}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>
        <div
          className={selectedSmoke ? styles.separatorgreen : styles.separator}
        />

        <span className={styles.span}>Are you looking for a roommate?</span>
        <div className={styles.container}>
          {["yes", "not", "i plan"].map((mate) => (
            <label className={styles.label} key={mate}>
              {mate}
              <input
                type="radio"
                name="roommate"
                id="roommate"
                value={mate}
                checked={selectedRoommate === mate}
                onChange={handleChangeRoommate}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>
        <div
          className={
            selectedRoommate ? styles.separatorgreen : styles.separator
          }
        />

        <label className={styles.label}>
          I certify that I am over 18 years old
          <input
            type="checkbox"
            name="price"
            id="price"
            checked={isChecked}
            onChange={handleChangeRestrictions}
            className={styles.radioInput}
          />
        </label>
      </form>
    </Card>
  );
}

export default RegistrationUserMain;
