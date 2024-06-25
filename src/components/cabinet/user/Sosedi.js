import React from "react"; // Import React
import styles from "./Sosedi.module.css";
import Sosed from "./Sosed";
import { useClientData } from "../../../store/hook";

const Sosedi = () => {
  const { chatPerson, usersCity } = useClientData();

  return (
      <div className={styles.box}> 
      <p className={styles.title}>В нашем приложении вы найдете соседей</p>
      <div className={styles.container}>
        {!usersCity.length ? (
          <h2 >Список пуст</h2>
        ) : (
        
            usersCity.map((user) => (
                <Sosed key={user.personId}  user={user} clientId={chatPerson?.personId} />
            ))
        
        )}
      </div>
  </div>
  );
};

export default Sosedi;
