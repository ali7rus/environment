import { useDispatch } from "react-redux";
import { updateRoomData } from "../../../store/room-slice";
import { useState } from "react";
import styles from "./RegistrationRoom.module.css";
import { useClientData } from "../../../store/hook";
import { useNavigate } from "react-router-dom";
import Card from "../../UI/Card";
import Button from "../../UI/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
function RegistrationRoomAdvants() {
  const { roomId, room } = useClientData();

  const initialState = {
    checkedAir: room?.advant?.conditioner || false,
    checkedInt: room?.advant?.wifi || false,
    checkedWash: room?.advant?.washing_machin || false,
    checkedWave: room?.advant?.microwave || false,
    checkedDish: room?.advant?.dishwasher || false,
    checkedBalc: room?.advant?.balcony || false,
    checkedWindow: room?.advant?.plastic_window || false,
    checkedToilet: room?.advant?.two_toilets || false,
    checkedTv: room?.advant?.lcd_tv || false,
    checkedVault: room?.advant?.vault || false,
    checkedDrying: room?.advant?.drying_machine || false,
    radioBath: "douche",
    radioStove: "gas",
    radioVacuum: "cleaner",
    valueDesk: room?.advants?.desk || false,
    valueBed: room?.advants?.double_bed || false,
    valueSingleBed: room?.advants?.single_bed || false,
  };

  const [formState, setFormState] = useState(initialState);
  const handleInputChange = ({ name, value }) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // const resetForm = () => {
  //   setFormState(initialState);
  // };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const radiosBath = [
    { name: "Douche", value: "douche" },
    { name: "Bathtub", value: "bathtub" },
  ];
  const radiosStove = [
    { name: "Gas stove", value: "gas" },
    { name: "Electric stove", value: "electric" },
  ];
  const radiosVacuum = [
    { name: "vacuum cleaner", value: "cleaner" },
    { name: "robot ", value: "robot" },
  ];

  let advant = {
    conditioner: formState.checkedAir,
    washing_machine: formState.checkedWash,
    microwave: formState.checkedWave,
    wifi: formState.checkedInt,
    drying_machine: formState.checkedDrying,
    vault: formState.checkedVault,
    balcony: formState.checkedBalc,
    plastic_window: formState.checkedWindow,

    lcd_tv: formState.checkedTv,
    dishwasher: formState.checkedDish,
    two_toilets: formState.checkedToilet,
  };
  if (formState.radioBath === "douche") {
    advant.douche = true;
  } else if (formState.radioBath === "bathtub") {
    advant.bathtub = true;
  }
  if (formState.radioStove === "gas") {
    advant.gas_stove = true;
  } else if (formState.radioStove === "electric") {
    advant.electric_stove = true;
  }
  if (formState.radioVacuum === "cleaner") {
    advant.vacuum_cleaner = true;
  } else if (formState.radioVacuum === "robot") {
    advant.robot = true;
  }

  const advants = {
    desk: formState.valueDesk,
    single_bed: formState.valueSingleBed,
    double_bed: formState.valueBed,
  };

  const data = {
    advant: advant,
    advants: advants,
  };

  const handleFormSubmit = async (event, direction) => {
    event.preventDefault();
    if (direction === "reset") {
      setFormState(initialState);
      return;
    }
    if (direction === "next") {
      await dispatch(updateRoomData(roomId, data));
    }
    navigate("/protected");
  };

  return (
    <Card
      buttons={
        <>
          <Button
            type="button"
            onClick={(event) => handleFormSubmit(event, "previous")}
          />
          <Button
            className={styles.prevButton}
            type="reset"
            onClick={(event) => handleFormSubmit(event, "reset")}
          />
          <Button
            className={styles.prevButton}
            type="submit"
            onClick={(event) => handleFormSubmit(event, "next")}
          />
        </>
      }
    >
      <h2>necessary furniture, household appliances and features of housing for living</h2>
      <form>
        <br />
        <ButtonGroup style={{ marginRight: "10px" }}>
          {radiosBath.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${radio.name}`}
              type="radio"
              variant={idx % 2 ? "outline-light" : "outline-light"}
              className="mb-4"
              value={radio.value}
              checked={formState.radioBath === radio.value}
              onChange={() =>
                handleInputChange({ name: "radioBath", value: radio.value })
              }
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <ButtonGroup>
          {radiosStove.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${radio.name}`}
              type="radio"
              variant={idx % 2 ? "outline-light" : "outline-light"}
              className="mb-4"
              value={radio.value}
              checked={formState.radioStove === radio.value}
              onChange={() =>
                handleInputChange({ name: "radioStove", value: radio.value })
              }
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <br />
        <ButtonGroup>
          {radiosVacuum.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant={idx % 2 ? "outline-light" : "outline-light"}
              className="mb-4"
              value={radio.value}
              checked={formState.radioVacuum === radio.value}
              onChange={() =>
                handleInputChange({ name: "radioVacuum", value: radio.value })
              }
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
        <br />
        <ToggleButtonGroup
          type="radio"
          className="mb-4"
          name="desk"
          value={formState.valueDesk}
          onChange={(val) =>
            handleInputChange({ name: "valueDesk", value: val })
          }
        >
          <ToggleButton id="1 desk" value={"1"} variant="outline-light">
            1 desk
          </ToggleButton>
          <ToggleButton id="2 desk" value={"2"} variant="outline-light">
            2 desk
          </ToggleButton>
          <ToggleButton id="3 desk" value={"3"} variant="outline-light">
            3 desk
          </ToggleButton>
        </ToggleButtonGroup>
        <br />
        <ToggleButtonGroup
          type="radio"
          className="mb-4"
          name="double bad"
          value={formState.valueBed}
          onChange={(val) =>
            handleInputChange({ name: "valueBed", value: val })
          }
        >
          <ToggleButton id="1 dbed" value={"1"} variant="outline-light">
            1 double bed
          </ToggleButton>
          <ToggleButton id="2 dbed" value={"2"} variant="outline-light">
            2 double bed
          </ToggleButton>
          <ToggleButton id="3 dbed" value={"3"} variant="outline-light">
            3 double bed
          </ToggleButton>
        </ToggleButtonGroup>
        <br />
        <ToggleButtonGroup
          type="radio"
          className="mb-4"
          name="single bad"
          value={formState.valueSingleBed}
          onChange={(val) =>
            handleInputChange({ name: "valueSingleBed", value: val })
          }
        >
          <ToggleButton id="1 sbed" value={"1"} variant="outline-light">
            1 single bed
          </ToggleButton>
          <ToggleButton id="2 sbed" value={"2"} variant="outline-light">
            2 single bed
          </ToggleButton>
          <ToggleButton id="3 sbed" value={"3"} variant="outline-light">
            3 single bed
          </ToggleButton>
          <ToggleButton id="4 sbed" value={"4"} variant="outline-light">
            4 single bed
          </ToggleButton>
        </ToggleButtonGroup>
        <br />
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check10"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedToilet}
          onChange={(e) =>
            handleInputChange({
              name: "checkedToilet",
              value: e.target.checked,
            })
          }
        >
          2 toilets
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check9"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedWindow}
          onChange={(e) =>
            handleInputChange({
              name: "checkedWindow",
              value: e.target.checked,
            })
          }
        >
          Plastic window
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check8"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedTv}
          onChange={(e) =>
            handleInputChange({ name: "checkedTv", value: e.target.checked })
          }
        >
          LCD TV
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check7"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedBalc}
          value="7"
          onChange={(e) =>
            handleInputChange({ name: "checkedBalc", value: e.target.checked })
          }
        >
          Balcony
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check6"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedVault}
          value="6"
          onChange={(e) =>
            handleInputChange({ name: "checkedVault", value: e.target.checked })
          }
        >
          Vault
        </ToggleButton>
        <br />
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check5"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedDrying}
          value="5"
          onChange={(e) =>
            handleInputChange({
              name: "checkedDrying",
              value: e.target.checked,
            })
          }
        >
          Drying machine
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check4"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedInt}
          value="4"
          onChange={(e) =>
            handleInputChange({ name: "checkedInt", value: e.target.checked })
          }
        >
          Internet
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check3"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedWash}
          value="3"
          onChange={(e) =>
            handleInputChange({ name: "checkedWash", value: e.target.checked })
          }
        >
          Washer machine
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check2"
          type="checkbox"
          variant="outline-info"
          checked={formState.checkedAir}
          value="2"
          onChange={(e) =>
            handleInputChange({ name: "checkedAir", value: e.target.checked })
          }
        >
          Conditioner
        </ToggleButton>
        <br />
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check1"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedWave}
          value="1"
          onChange={(e) =>
            handleInputChange({ name: "checkedWave", value: e.target.checked })
          }
        >
          Microwave
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check0"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedDish}
          value="0"
          onChange={(e) =>
            handleInputChange({ name: "checkedDish", value: e.target.checked })
          }
        >
          Dishwasher
        </ToggleButton>
      </form>
    </Card>
  );
}

export default RegistrationRoomAdvants;
