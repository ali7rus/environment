import { useDispatch } from "react-redux";
import { updatePersonData } from "../../../store/user-slice";
import { useState,  } from "react";
import styles from "../room/RegistrationRoom.module.css";
import { useClientData } from "../../../store/hook";
import { useNavigate } from "react-router-dom";
import Card from "../../UI/Card";
import Button from "../../UI/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";

function RegistrationUserAdvants() {
  const { personId, person } = useClientData();

  const resetState = {
    checkedBar: false,
    checkedClubs: false,
    checkedPlants:  false,
    checkedVolleyball: false,
    checkedTable: false,
    checkedPc:  false,
    checkedSerials:  false,
    checkedVr: false,
    checkedFootball:  false,
    checkedChildren:  false,
    valuePets:  false,
    valueWakeUp:  false,
  };

  const initialState = {
    checkedBar: person?.interest?.bar_kitchen || false,
    checkedClubs: person?.interest?.night_clubs || false,
    checkedPlants: person?.interest?.indoor_plants || false,
    checkedVolleyball: person?.interest?.volleyball || false,
    checkedTable: person?.interest?.table_game || false,
    checkedPc: person?.interest?.pc_game || false,
    checkedSerials: person?.interest?.serials || false,
    checkedVr: person?.interest?.vr_game || false,
    checkedFootball: person?.interest?.football || false,
    checkedChildren: person?.interest?.children || false,
    valuePets: person?.interests?.pets || false,
    valueWakeUp: person?.interests?.wake_up || false,
  };

  const [formState, setFormState] = useState(initialState);
  const [checkedCount, setCheckedCount] = useState(person?.interest?.checkedCount || 0);
  
  const handleInputChange = ({ name, value }) => {
    setFormState({
      ...formState,
      [name]: value,
    });
      // Update the checked count
  setCheckedCount(value ? checkedCount + 1 : checkedCount - 1);
  };

  console.log(" checkedCount addddddddd",checkedCount);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let interest = {
    children: formState.checkedChildren,
    bar_kitchen: formState.checkedBar,
    indoor_plants: formState.checkedPlants,
    football: formState.checkedFootball,
    vr_game: formState.checkedVr,
    pc_game: formState.checkedPc,
    volleyball: formState.checkedVolleyball,
    night_clubs: formState.checkedClubs,
    serials: formState.checkedSerials,
    table_game: formState.checkedTable,
    checkedCount: checkedCount,
  };

  const interests = {
    wake_up: formState.valueWakeUp,
    pets: formState.valuePets,
  };

  const data = {
    interests: interests,
    interest: interest,
  };

  const handleFormSubmit = async (event, direction) => {
    event.preventDefault();
    if (direction === "reset") {
      setFormState(resetState);
      setCheckedCount(0);
      return;
    }
    if (direction === "next") {
      if (checkedCount < 5) {
        alert('Please select at least 5 interests');
        return;
      }
      await dispatch(updatePersonData(personId, data));
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
      <h3>Tell us more about your intentions</h3>
      <form>
        <br />
        <span className={styles.span}>availability of pets</span>
        <ToggleButtonGroup
          type="radio"
          className="mb-4"
          name="pets"
          value={formState.valuePets}
          onChange={(val) =>
            handleInputChange({ name: "valuePets", value: val })
          }
        >
          <ToggleButton id="have" value={"have"} variant="outline-light">
            have
          </ToggleButton>
          <ToggleButton id="want" value={"want"} variant="outline-light">
            want
          </ToggleButton>
          <ToggleButton id="allergy" value={"allergy"} variant="outline-light">
            allergy
          </ToggleButton>
          <ToggleButton id="not" value={"not"} variant="outline-light">
           not
          </ToggleButton>
        </ToggleButtonGroup>
        <br />
        <span className={styles.span}>what time do you wake up?</span>
        <ToggleButtonGroup
          type="radio"
          className="mb-4"
          name="timeUp"
          value={formState.valueWakeUp}
          onChange={(val) =>
            handleInputChange({ name: "valueWakeUp", value: val })
          }
        >
          <ToggleButton id="morning" value={"morning"} variant="outline-light">
            morning
          </ToggleButton>
          <ToggleButton
            id="afternoon"
            value={"afternoon"}
            variant="outline-light"
          >
            in the afternoon
          </ToggleButton>
          <ToggleButton id="evening" value={"evening"} variant="outline-light">
            in the evening
          </ToggleButton>
        </ToggleButtonGroup>
        <br />
        <span className={styles.span}>my interests</span>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check10"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedSerials}
          onChange={(e) =>
            handleInputChange({
              name: "checkedSerials",
              value: e.target.checked,
            })
          }
        >
          serials
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check9"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedPc}
          onChange={(e) =>
            handleInputChange({
              name: "checkedPc",
              value: e.target.checked,
            })
          }
        >
          pc games
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check8"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedTable}
          onChange={(e) =>
            handleInputChange({ name: "checkedTable", value: e.target.checked })
          }
        >
          table games
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check7"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedVr}
          value="7"
          onChange={(e) =>
            handleInputChange({ name: "checkedVr", value: e.target.checked })
          }
        >
          vr games
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check6"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedFootball}
          value="6"
          onChange={(e) =>
            handleInputChange({
              name: "checkedFootball",
              value: e.target.checked,
            })
          }
        >
          football
        </ToggleButton>
        <br />
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check5"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedVolleyball}
          value="5"
          onChange={(e) =>
            handleInputChange({
              name: "checkedVolleyball",
              value: e.target.checked,
            })
          }
        >
          volleyball
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check4"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedChildren}
          value="4"
          onChange={(e) =>
            handleInputChange({
              name: "checkedChildren",
              value: e.target.checked,
            })
          }
        >
          raising children
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check3"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedClubs}
          value="3"
          onChange={(e) =>
            handleInputChange({ name: "checkedClubs", value: e.target.checked })
          }
        >
          night clubs
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check1"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedBar}
          value="1"
          onChange={(e) =>
            handleInputChange({ name: "checkedBar", value: e.target.checked })
          }
        >
          bar and kitchen
        </ToggleButton>
        <ToggleButton
          className="mb-4"
          style={{ marginRight: "10px" }}
          id="toggle-check0"
          type="checkbox"
          variant="outline-light"
          checked={formState.checkedPlants}
          value="0"
          onChange={(e) =>
            handleInputChange({
              name: "checkedPlants",
              value: e.target.checked,
            })
          }
        >
          indoor plants
        </ToggleButton>
      </form>
    </Card>
  );
}

export default RegistrationUserAdvants;
