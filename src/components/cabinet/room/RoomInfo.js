import { useSelector,useDispatch } from "react-redux";
import styles from "./RoomInfo.module.css";
import CarouselPhoto from "../user/CarouselPhoto";
import FraimInfo from "../../UI/FrameInfo";
import Slider from "react-slick";
import { Button } from "react-bootstrap";
import ChatComponent from "../ChatComponent";
import { useState } from "react";
import { useClientData } from "../../../store/hook";
import { addRoomLike } from "../../../store/likes-slice";
const RoomInfo = (props) => {
const [chatAgent, setChatAgent] = useState(false);
const {chatPerson}=useClientData();
const dispatch = useDispatch();

const myRoom = useSelector((state) =>
state.room.rooms.find((room) => room.personId === props.id)
);

  const roomAll = useSelector((state) =>
    state.rooms.rooms.find((room) => room.personId === props.id)
  );

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const room = myRoom || roomAll;

  if (!room) {
    return null;
  }

  const advantArray =room.advant ? Object.entries(room.advant)
  .filter(([key, value]) => value === true)
  .map(([key, value]) => key):[];
  const advantsObject = room.advants;
  let advant1 = advantsObject
    ? Object.keys(advantsObject).map((key) => `${key} ${advantsObject[key]}`)
    : [];
  let advants = [...advantArray, ...advant1];
  // const groupedData = chunk(advants, 3);

  const data = advants.map((key) => <FraimInfo key={key}>{key}</FraimInfo>);

  const chatAgentHandler=()=>{ 
setChatAgent(true)
if (room.personId && chatPerson.personId) {
  dispatch(addRoomLike(chatPerson.personId,room.personId));
}
  }

  const dislikeHandler = () => {
    setChatAgent(false);
  };

  return (
    <>
  {chatAgent ? ( <ChatComponent partner={room} personId={chatPerson.personId} onDislike={dislikeHandler} clientId={chatPerson.userId} ></ChatComponent> ):(
      <div className={styles.container}>
        <div className={styles.column1} onClick={props.onClick}>
          <CarouselPhoto images={room.images}></CarouselPhoto>
        </div>
        <div className={styles.column2}>
          {room.structure === ("apartment" || "house") ? (
            <div className={styles.roomStreet}>
              {` ${room.roomsCount} room ${room.structure} ${room.time} of ${room.minMonths} months for rent in the ${room?.locatHouse} district `}
            </div>
          ) : (
            <div className={styles.roomStreet}>
              {`${room.structure} ${room.time} for rent in the ${room?.locatHouse} district `}
            </div>
          )}
          <div className={styles.userLocation}>
            {` ${room.name}. ${room.map} `}
          </div>

          <div className={styles.sliderContainer}>
            <Slider {...settings}>
              {data.length>0 && (
                <div>
                  <div className={styles.userPreference}>
                    Amenities for a comfortable stay
                  </div>
                  {data}
                </div>
              )}
              <div className={styles.userDescription}>
                {room.aboutApartment}
              </div>
              <div className={styles.userWork}>
                <p>{`Apartment renovation: ${room.repairs}`}</p>
                <p>{`Living area: ${room.area} м2`}</p>
                <p>{`Floor: ${room.floor} `}</p>
                {!room.isCheked && <p>{`Utility bills: ${room.bills} $`}</p>}
                <p>{`Deposi: ${room.deposit} `}</p>
                {room.anyone !== "nobody" && room.anyone !== null && (
                  <p>{`The apartment is inhabited by ${room.anyone} `}</p>
                )}
                {room.count !== 0 && room.anyone !== "nobody" && (
                  <p>{`Women: ${room.count} people `}</p>
                )}
                {room.countm !== 0 && room.anyone !== "nobody" && (
                  <p>{`Men: ${room.countm} people `}</p>
                )}
                <p>{`${room.peopleCount} tenant(s) that we are ready to accept `}</p>
              </div>
              <div>
                <a
                  href="https://yandex.ru/maps/?rtext=59.967870,30.242658~59.898495,30.299559&rtt=mt"
                  target="blank"
                >
                  Как добраться
                </a>
              </div>
            </Slider>
            <Button variant="secondary"  onClick={chatAgentHandler} >Написать</Button>
          </div>
        </div>
      </div>)}
    </>
  );
};
export default RoomInfo;
