import { useDispatch } from "react-redux";
import { roomAction, updateRoomData } from "../../../store/room-slice";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegistrationRoom.module.css";
import { useClientData } from "../../../store/hook";
import PhotoLoad from "./PhotoLoad";
import Card from "../../UI/Card";
import Button from "../../UI/Button";

function RegistrationRoom() {
  const { roomId, room } = useClientData();
  const [selectedAnyone, setSelectedAnyone] = useState(
   room?.anyone || null
  );
  const [selectedRepairs, setSelectedRepairs] = useState(room?.repairs || null);
  
  const [selectedPeople, setSelectedPeople] = useState(
    room?.peopleCount || null
  )
  const [selectedRooms, setSelectedRooms] = useState(
    room?.roomsCount || null
  );
  const [selectedStructure, setSelectedStructure] = useState(
   room?.structure || null
  );
  const [isShowCount, setIsShowCount] = useState(
  room?.isShowCount|| false
  );
  const [area, setArea] = useState( room?.area || 0);

  const [isFormValid, setIsFormValid] = useState(false);
  let [count, setCount] = useState(room?.count || 0);
  let [countm, setCountm] = useState(room?.countm || 0);


  // const initialFormState = {
  //   selectedAnyone: null,
  //   selectedRepairs: null,
  //   selectedPeople: null,
  //   selectedRooms: null,
  //   selectedStructure: null,
  //   isShowCount: false,
  //   area: 0,
  //   count: 0,
  //   countm: 0,
  //   isFormValid: false
  // };

  const setFormState = state => {
    setSelectedAnyone(state.selectedAnyone);
    setSelectedRepairs(state.selectedRepairs);
    setSelectedPeople(state.selectedPeople);
    setSelectedRooms(state.selectedRooms);
    setSelectedStructure(state.selectedStructure);
    setIsShowCount(state.isShowCount);
    setArea(state.area);
    setCount(state.count);
    setCountm(state.countm);
    setIsFormValid(state.isFormValid);
  };
  

  useEffect(() => {
    if (room) {
      setFormState({
        selectedAnyone: room?.anyone || null,
        selectedRepairs: room?.repairs || null,
        selectedPeople: room?.peopleCount || null,
        selectedRooms: room?.roomsCount || null,
        selectedStructure: room?.structure || null,
        isShowCount: room?.isShowCount || false,
        area: room?.area || 0,
        count: room?.count || 0,
        countm: room?.countm || 0,
      });
    }
  }, [roomId, room]);
  
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      selectedPeople &&
      selectedRooms &&
      selectedStructure &&
      selectedRepairs &&
      area
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [selectedPeople, selectedRooms, selectedStructure, selectedRepairs, area]);

  function incrementCount() {
    setCount((prevCount) => prevCount + 1);
  }
  
  function decrementCount() {
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  }
  
  function incrementCountm() {
    setCountm((prevCountm) => prevCountm + 1);
  }
  
  function decrementCountm() {
    setCountm((prevCountm) => (prevCountm > 0 ? prevCountm - 1 : 0));
  }

  const data = {
    images: room?.images || [],
    structure: selectedStructure,
    peopleCount: selectedPeople,
    anyone: selectedAnyone,
    count: count,
    countm: countm,
    roomsCount: selectedRooms,
    area: area,
    isShowCount: isShowCount,
    repairs: selectedRepairs,
  };

  const data1 = {
    images: room?.images || [],}

  const handleFormSubmit = (event, direction) => {
    event.preventDefault();
    if (isFormValid) {
      dispatch(updateRoomData(roomId, data));
    }else{
      dispatch(updateRoomData(roomId, data1)); 
    }
    const path = direction === "next" ? "/regroomprice" : "/protected";
    navigate(path);
  };

  const handleChangeAnyone = (event) => {
    setSelectedAnyone(event.target.value);
    if (event.target.value === "tenants") {
      setIsShowCount(true);
    } else {
      setIsShowCount(false);
    }
  };

  const handleChangeRepairs = (event) => {
    setSelectedRepairs(event.target.value);
  };

  const handleChangePeople = (event) => {
    setSelectedPeople(event.target.value);
  };

  const handleChangeRooms = (event) => {
    setSelectedRooms(event.target.value);
  };

  const handleChangeStructure = (event) => {
    setSelectedStructure(event.target.value);
  };

  return (
    <>
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
        photo={
          <PhotoLoad
            id={roomId}
            action={roomAction}
            nameFile={"room"}
            data={room}
          />
        }
      >
        <h2>Main info </h2>

        <form>
          <span className={styles.span}>
            what kind of housing do you rent out?
          </span>
          <div className={styles.container}>
            {["house", "apartment", "room", "bunk-bed"].map((room) => (
              <label className={styles.label} key={room}>
                {room}
                <input
                  type="radio"
                  name="house"
                  id="rooms"
                  value={room}
                  checked={selectedStructure === room}
                  onChange={handleChangeStructure}
                  className={styles.radioInput}
                />
              </label>
            ))}
          </div>
          <div
            className={
              selectedStructure ? styles.separatorgreen : styles.separator
            }
          />
          <span className={styles.span}>
            What kind of housing repairs have been carried out?
          </span>
          <div className={styles.container}>
            {["simple", "improved", "high quality"].map((repairs) => (
              <label className={styles.label} key={repairs}>
                {repairs}
                <input
                  type="radio"
                  name="repairs"
                  id="repairs"
                  value={repairs}
                  checked={selectedRepairs === repairs}
                  onChange={handleChangeRepairs}
                  className={styles.radioInput}
                />
              </label>
            ))}
          </div>
          <div
            className={
              selectedRepairs ? styles.separatorgreen : styles.separator
            }
          />
          <span className={styles.span}>
            How many tenants are you willing to accept?
          </span>
          <div className={styles.container}>
            {["1", "2", "3", "4", "5", "6"].map((peopleCount) => (
              <label className={styles.label} key={peopleCount}>
                {peopleCount}{" "}
                <input
                  type="radio"
                  name="people"
                  id="people"
                  value={peopleCount}
                  checked={selectedPeople === peopleCount}
                  onChange={handleChangePeople}
                  className={styles.radioInput}
                />
              </label>
            ))}
          </div>
          <div
            className={
              selectedPeople ? styles.separatorgreen : styles.separator
            }
          />
          {(selectedStructure === "bunk-bed" ||
            selectedStructure === "room") && (
            <>
              <span className={styles.span}>
                Does anyone already live in the apartment?
              </span>
              <div className={styles.container}>
                {["hosts", "tenants", "nobody"].map((anyone) => (
                  <label className={styles.label} key={anyone}>
                    {anyone}
                    <input
                      type="radio"
                      name="anyone"
                      id="anyone"
                      value={anyone}
                      checked={selectedAnyone === anyone}
                      onChange={handleChangeAnyone}
                      className={styles.radioInput}
                    />
                  </label>
                ))}
              </div>
              {isShowCount && (
                <>
                  <span className={styles.span}>
                    How many residents are already living?
                  </span>
                  <div className={styles.container}>
                    <img
                      src="https://img.icons8.com/external-vitaliy-gorbachev-blue-vitaly-gorbachev/60/null/external-woman-4th-july-vitaliy-gorbachev-blue-vitaly-gorbachev-1.png"
                      alt=""
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        incrementCount();
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        decrementCount();
                      }}
                    >
                      -
                    </button>
                    <div>{count}</div>
                    <img
                      src="https://img.icons8.com/external-vitaliy-gorbachev-blue-vitaly-gorbachev/60/null/external-man-4th-july-vitaliy-gorbachev-blue-vitaly-gorbachev-1.png"
                      alt=""
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        incrementCountm();
                      }}
                    >
                      +
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        decrementCountm();
                      }}
                    >
                      -
                    </button>
                    <div>{countm}</div>
                  </div>
                </>
              )}
              <div
                className={
                  selectedAnyone ? styles.separatorgreen : styles.separator
                }
              />{" "}
            </>
          )}
          <span className={styles.span}>
            How many rooms are there in a house or apartment?
          </span>
          <div className={styles.container}>
            {["1", "2", "3", "4"].map((roomCount) => (
              <label className={styles.label} key={roomCount}>
                {roomCount}{" "}
                <input
                  type="radio"
                  name="roomscount"
                  id="roomscount"
                  value={roomCount}
                  checked={selectedRooms === roomCount}
                  onChange={handleChangeRooms}
                  className={styles.radioInput}
                />
              </label>
            ))}
          </div>
          <span className={styles.span}>
            What is the total area of an apartment or house?
          </span>
          <div className={styles.container}>
            <input
              step="2"
              min="18"
              type="number"
              name="area"
              className={styles.numberInput}
              id="area"
              // required
              autoComplete="off"
              value={Number(area)}
              onChange={(event) => setArea(Number(event.target.value))}
            />
          </div>
          <div
            className={selectedRooms ? styles.separatorgreen : styles.separator}
          />
        </form>
      </Card>
    </>
  );
}

export default RegistrationRoom;
