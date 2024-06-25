import styles from './FraimInfo.module.css'
const FraimInfo =(props)=>{
    return(
        <div className={styles.fraimInfo}  >{props.children}</div>
    )
}
export default FraimInfo