import styles from "./UserInfo.module.css";
// import iconAlk from "../icons/iconNoAlc.png";
// import iconNoSmoke from "../icons/iconNoSmoke.png";
// import iconChat from "../icons/iconChat.png";
// import iconMoney from "../icons/iconMoney.png";
import { useSelector } from "react-redux";
import CarouselPhoto from "./CarouselPhoto";
import FraimInfo from "../../UI/FrameInfo";
import Slider from "react-slick";
import { format } from "date-fns";
const UserInfo = (props) => {
  const myPerson = useSelector((state) =>
    state.user.users.find((user) => user.personId === props.id)
  );

  const userAll = useSelector((state) =>
    state.users.users.find((user) => user.personId === props.id)
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const user = myPerson || userAll;
  if (!user) {
    return null;
  }
console.log(user);
  const roommate = user.roommate && user.roommate.trim();
  const relationship = user.relationship && user.relationship.trim();
  const drink = user.drinking && user.drinking.trim();
  const cook = user.сooking && user.сooking.trim();
  let languages = user.lang && user.lang.join(", ");

  const interestArray = user?.interest
    ? Object.entries(user.interest)
        .filter(([key, value]) => value === true)
        .map(([key, value]) => key)
    : [];

  const interestsObject = user?.interests;

  let interest = interestsObject
    ? Object.keys(interestsObject).map(
        (key) => `${key} ${interestsObject[key]}`
      )
    : [];

  let interests = [...interestArray, ...interest];

  const data = interests.slice(0, 6).map((key, index) => <FraimInfo key={index}>{key}</FraimInfo>);

  const startedDate =
    user.startDate && format(new Date(user.startDate), "yyyy-MM-dd");
  const endedDate =
    user.endDate && format(new Date(user.endDate), "yyyy-MM-dd");

  return (
    <div style={props.style}>
      <div className={styles.container}>
        <div className={styles.column1} onClick={props.onClick}>
          <CarouselPhoto images={user?.images}></CarouselPhoto>
        </div>
        <div className={styles.column2}>
          <div className={styles.userName}>
            {user?.name}, {user?.age}
          </div>
          <div className={styles.userLocation}>{user?.mapLive}</div>
          <p> {user?.work}</p>
          <div className={styles.userDescription}>{user?.aboutme}</div>
          <div className={styles.sliderContainer}>
            <Slider {...settings}>
              {data.length > 0 && (
                <div>
                  <div className={styles.userPreference}>My interests</div>
                  {data}
                </div>
              )}
              <div>
                {roommate === "not" && (
                  <div className={styles.userLocation}>
                    I not looking for a roommate
                  </div>
                )}
                {roommate === "i plan" && (
                  <div className={styles.userLocation}>
                    I plan to find a roommate ( {user?.neighbour}) for{" "}
                    {user.stay} duration from {startedDate} to {endedDate} in
                    area {user.district} in the town {user.map}.
                  </div>
                )}
                {roommate === "room is free" && (
                  <div className={styles.userLocation}>
                    I looking for a roommate({user?.neighbour} ),
                    {user?.roommate} duration from {startedDate} to {endedDate}{" "}
                    in area {user.district} in the town {user.map}
                  </div>
                )}
                {roommate === "yes" && (
                  <div className={styles.userLocation}>
                    I looking for a roommate({user?.neighbour}) duration from{" "}
                    {startedDate} to {endedDate} in area {user.district} in the
                    town {user.map}
                  </div>
                )}
                {relationship === "yes" && (
                  <div className={styles.userLocation}>
                    I have a relationship
                  </div>
                )}
                {relationship === "married" && (
                  <div className={styles.userLocation}>I'm married</div>
                )}{" "}
                {relationship === "not" && user.partners === "yes" && (
                  <div className={styles.userLocation}>
                    I'm not in a relationship I want to get acquainted
                  </div>
                )}
                {relationship === "not" && user.partners === "not" && (
                  <div className={styles.userLocation}>
                    I don't have a relationship, I don't want to get acquainted
                  </div>
                )}
                {user.lang && (
                  <div className={styles.userLocation}>
                    We can chat if you speak in {languages}.
                  </div>
                )}
                {relationship === "not" && user.partners === "not sure" && (
                  <div className={styles.userLocation}>
                    I don 't have a relationship , I 'm not sure I want to get
                    acquainted!
                  </div>
                )}
                {relationship === "broke up or divorced" &&
                  user.partners === "yes" && (
                    <div className={styles.userLocation}>
                      I broke up and I want to get acquainted
                    </div>
                  )}
                {relationship === "broke up or divorced" &&
                  user.partners === "not" && (
                    <div className={styles.userLocation}>
                      I broke up and I don't want to get acquainted
                    </div>
                  )}
                {relationship === "broke up or divorced" &&
                  user.partners === "not sure" && (
                    <div className={styles.userLocation}>
                      I broke up and, I 'm not sure I want to get acquainted.
                    </div>
                  )}
                {(drink === "on weekends" || drink === "on big holidays") && (
                  <div className={styles.userLocation}>I drink on {drink}.</div>
                )}
                {(drink === "rarely" || drink === "often") && (
                  <div className={styles.userLocation}>I drink {drink}.</div>
                )}
                {user.smoking !== "not" && (
                  <div className={styles.userLocation}>
                    I smoking {user.smoking}.
                  </div>
                )}
                {(cook === "semi-finisheds" || cook === "fast food") && (
                  <div className={styles.userLocation}>
                    I rarely cook, I eat {cook}.
                  </div>
                )}
                {cook === "cafes&canteens" && (
                  <div className={styles.userLocation}>
                    I rarely cook, I eat in {cook}.
                  </div>
                )}
                {cook === "often" && (
                  <div className={styles.userLocation}>
                    I often cook my own food.
                  </div>
                )}
                {cook === "the above" && (
                  <div className={styles.userLocation}>
                    I rarely cook, eat fast food, semi-finished products and go,
                    order food in cafes and canteens.
                  </div>
                )}
              </div>
         
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;


