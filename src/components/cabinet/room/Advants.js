import styles from '../room/Advant.module.css';
import iconAir from "../images/iconAir.png";
import iconGas from "../images/iconGas.png";
import iconDouche from "../images/iconDouche.png";
import iconBathtube from "../images/iconBathtube.png";
import iconWave from "../images/iconWave.png";
import iconBalc from "../images/iconBalc.png"
import iconDish from "../images/iconDish.png"
import iconDrying from "../images/iconDrying.png"
import iconWash from "../images/iconsWash.png"
import iconTv from "../images/iconsTv.png"
import iconToilet from "../images/iconToilet.png"
import iconRobot from "../images/iconRobot.png"
import iconWifi from "../images/iconWifi.png"
import iconVacuum from "../images/iconVacuum.png"
import iconWindow from "../images/iconWindow.png"
import iconVault from "../images/iconVault.png"
import iconElectro from "../images/iconElectro.png"


export default function Advants({ name }) {
  return (
    <div className={styles.advant}>
      <div className={styles.iconBlock}>
      {name==="conditioner" && <img  src={iconAir} alt=''/>}
      {name==="drying_machine" && <img  src={iconDrying} alt=''/>}
      {name==="balcony" && <img  src={iconBalc} alt=''/>}
      {name==="plastic_window" && <img  src={iconWindow} alt=''/>}
      {name==="bathtub" && <img  src={iconBathtube} alt=''/>}
      {name==="gas_stove" && <img  src={iconGas} alt=''/>}
      {name==="vacuum_cleaner" && <img  src={iconVacuum} alt=''/>}
      {name==="washing_machine" && <img  src={iconWash} alt=''/>}
      {name==="microwave" && <img  src={iconWave} alt=''/>}
      {name==="wifi" && <img  src={iconWifi} alt=''/>}
      {name==="vault" && <img  src={iconVault} alt=''/>}
      {name==="electric_stove" && <img  src={iconElectro} alt=''/>}
      {name==="robot" && <img  src={iconRobot} alt=''/>}
      {name==="douche" && <img  src={iconDouche} alt=''/>}
      {name==="lcd_tv" && <img  src={iconTv} alt=''/>}
      {name==="dishwasher" && <img  src={iconDish} alt=''/>}
      {name==="two_toilets" && <><img  src={iconToilet} alt=''/>2</>}
      </div>
    </div>
  );
}
