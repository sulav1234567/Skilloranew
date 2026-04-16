import styles from "./loader.module.css"




const SkeletonLoader=({style={}})=>{
   return  <div className={styles.skeletonloader} style={style}></div>
}

export default SkeletonLoader