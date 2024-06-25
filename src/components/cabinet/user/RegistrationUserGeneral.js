import { useDispatch } from "react-redux";
import { useClientData } from "../../../store/hook";
import { useState, useEffect } from "react";
import { userAction, updatePersonData } from "../../../store/user-slice";
import { useNavigate } from "react-router-dom";
import PhotoLoad from "../room/PhotoLoad";
import Card from "../../UI/Card";
import Button from "../../UI/Button";
import styles from "../room/RegistrationRoom.module.css";
import { Form } from "react-bootstrap";

function RegistrationUserGeneral(props) {
  const { personId, person } = useClientData();
  console.log("person general pppppppppppp", person);
  const [name, setName] = useState(person?.name || "");
  const [age, setAge] = useState(person?.age || "18");
  const [work, setWork] = useState(person?.work || "");
  const [language, setLanguage] = useState([]);
console.log("language gggggggg ", language);


  const [aboutme, setMessage] = useState(person?.aboutme || "");
  const [selectedGender, setSelectedGender] = useState(person?.gender || null);
  const [mapLive, setMapLive] = useState(person?.mapLive || "");
  const [isFormValid, setIsFormValid] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialFormState = {
    name: "",
    aboutme: "",
    age: "18",
    work: "",
    map: "",
    mapLive: "",
    gender: null,
    language: [],
  };

  const setFormState = (state) => {
    setName(state.name);
    setAge(state.age);
    setWork(state.work);
    setMessage(state.aboutme);
    setMapLive(state.mapLive);
    setSelectedGender(state.gender);
    setLanguage(state.language);
  };

  useEffect(() => {
    if (person) {
      setFormState({
        name: person.name || "",
        aboutme: person.aboutme || "",
        age: person.age || "18",
        work: person.work || "",
        nikName: person.nikName || "",
        mapLive: person.mapLive || "",
        gender: person.gender || null,
        language: language || [],
      });
    } else {
      setFormState(initialFormState);
    }
  }, [person, personId,language]);

  useEffect(() => {
    if (name && age && work && mapLive && selectedGender && language) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, age, work, mapLive, selectedGender,language]);

  const data = {
    images: person?.images || [],
    name: name,
    aboutme: aboutme,
    age: age,
    work: work,
    lang: language,
    gender: selectedGender,
    mapLive: mapLive,
  };
  const data1 = {
    images: person?.images || [],
  };

  const handleFormSubmit = async (event, direction) => {
    event.preventDefault();

    if (isFormValid) {
      dispatch(updatePersonData(personId, data));
    } else {
      dispatch(updatePersonData(personId, data1));
    }
    const path = direction === "next" ? "/regusermain" : "/protected";
    navigate(path);
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
      photo={
        <PhotoLoad
          id={personId}
          action={userAction}
          nameFile={"user"}
          data={person}
        />
      }
    >
      <h2>General information</h2>

      <form>
        <span className={styles.span}>What's your name?</span>
        <div className={styles.container}>
          <input
            type="text"
            name="name"
            className={styles.textInput}
            id="nme"
            required
            autoComplete="off"
            value={name}
            onChange={(event) => setSelectedGender(event.target.value)}
          />
        </div>
        <div className={name ? styles.separatorgreen : styles.separator} />

        <span className={styles.span}>Gender of a person</span>
        <div className={styles.container}>
          {["male", "female", "no matter"].map((gender) => (
            <label className={styles.label} key={gender}>
              {gender}
              <input
                type="radio"
                name="gender"
                id="gender"
                value={gender}
                checked={selectedGender === gender}
                onChange={(event) => setSelectedGender(event.target.value)}
                className={styles.radioInput}
              />
            </label>
          ))}
        </div>
        <div
          className={selectedGender ? styles.separatorgreen : styles.separator}
        />
        <Form.Group controlId="mapSelector">
          <Form.Label>Where do you live?</Form.Label>
          <Form.Select
            style={{
              backgroundColor: "#333",
              color: "#fff",
              fontSize: "1.2em",
              border: "none",
            }}
            onChange={(event) => setMapLive(event.target.value)}
            value={mapLive}
          >
            <option value="Yerevan">Yerevan</option>
            <option value="Tbilisi">Tbilisi</option>
            <option value="Istanbul">Istanbul</option>
            <option value="Moscow">Moscow</option>
            <option value="Saint-Petersburg">Saint-Petersburg</option>
            <option value="Astana">Astana</option>
          </Form.Select>
        </Form.Group>
        <div className={mapLive ? styles.separatorgreen : styles.separator} />
        <span className={styles.span}>How old are you?</span>
        <div className={styles.container}>
          <input
            type="number"
            name="age"
            className={styles.numberInput}
            id="age"
            required
            autoComplete="off"
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>
        <div className={age ? styles.separatorgreen : styles.separator} />
        <span className={styles.span}>Type of your activity</span>
        <div className={styles.container}>
          <input
            type="text"
            name="work"
            className={styles.textInput}
            id="work"
            required
            autoComplete="off"
            value={work}
            onChange={(event) => setWork(event.target.value)}
          />
        </div>
        <div className={work ? styles.separatorgreen : styles.separator} />

        <Form.Group controlId="languageSelector">
          <Form.Label>Languages for communication</Form.Label>
          <Form.Control
            as="select"
            multiple
            style={{
              backgroundColor: "#333",
              color: "#fff",
              fontSize: "1.2em",
              border: "none",
            }}
            onChange={(event) => {
              // получаем массив выбранных значений
              const selected = Array.from(
                event.target.selectedOptions,
                (option) => option.value
              );
              console.log("selected ggggggg", selected);
              setLanguage((prevState) => {
                // Фильтрация выбранных языков, чтобы оставить только те, которые еще не были добавлены
                const newSelected = selected.filter((lang) => !prevState.includes(lang));
                
                // Объединение старого состояния с новыми выбранными языками
                return [...prevState, ...newSelected];
              });
            }}
            value={language}
          >
            <option value="local">Local</option>
            <option value="english">English</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="spanish">Spanish</option>
            <option value="italian">Italian</option>
            <option value="russian">Russian</option>
            <option value="chinese">Chinese</option>
          </Form.Control>
        </Form.Group>
        <div className={language ? styles.separatorgreen : styles.separator} />
        <span className={styles.span}>About me?</span>
        <div className={styles.container}>
          <textarea
            name="aboutme"
            rows="2"
            className={styles.textInput}
            id="msg"
            required
            autoComplete="off"
            value={aboutme}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
        <div className={aboutme ? styles.separatorgreen : styles.separator} />
      </form>
    </Card>
  );
}

export default RegistrationUserGeneral;
