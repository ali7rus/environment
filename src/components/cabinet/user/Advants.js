import styles from '../user/Advant.module.css';
import iconBar from "../images2/iconBar.png";
import iconClub from "../images2/iconClub.png";
import iconChild from "../images2/iconChild.png";
import iconFootball from "../images2/iconFootball.png";
import iconPc from "../images2/iconPc.png";
import iconPlants from "../images2/iconPlants.png"
import iconTable from "../images2/iconTable.png"
import iconSerials from "../images2/iconSerials.png"
import iconVr from "../images2/iconVr.png"
// import iconTv from "../images2/iconsTv.png"
// import iconToilet from "../images2/iconToilet.png"
// import iconRobot from "../images2/iconRobot.png"
// import iconWifi from "../images2/iconWifi.png"
// import iconVacuum from "../images2/iconVacuum.png"
// import iconWindow from "../images2/iconWindow.png"
// import iconVault from "../images2/iconVault.png"
// import iconElectro from "../images2/iconElectro.png"
import iconVolleyball from '../images2/iconVolleyball.png'

export default function Advants({ name }) {
  return (
    <div className={styles.advant}>
      <div className={styles.iconBlock}>
      {name==="bar_kitchen" && <img  src={iconBar} alt=''/>}
      {name==="children" && <img  src={iconChild} alt=''/>}
      {name==="night_clubs" && <img  src={iconClub} alt=''/>}
      {name==="football" && <img  src={iconFootball} alt=''/>}
      {name==="volleyball" && <img  src={iconVolleyball} alt=''/>}
      {/* {name==="" && <img  src={iconGas} alt=''/>} */}
      {name==="vr_game" && <img  src={iconVr} alt=''/>}
      {name==="serials" && <img  src={iconSerials} alt=''/>}
      {name==="indoor_plants" && <img  src={iconPlants} alt=''/>}
      {name==="table_game" && <img  src={iconTable} alt=''/>}
      {name==="pc_game" && <img  src={iconPc} alt=''/>}
       {/*{name==="electric_stove" && <img  src={iconElectro} alt=''/>}
      {name==="robot" && <img  src={iconRobot} alt=''/>}
      {name==="douche" && <img  src={iconDouche} alt=''/>}
      {name==="lcd_tv" && <img  src={iconTv} alt=''/>}
      {name==="dishwasher" && <img  src={iconDish} alt=''/>}
      {name==="two_toilets" && <><img  src={iconToilet} alt=''/>2</>} */}
      </div>
    </div>
  );
}
