import Carousel from "react-bootstrap/Carousel";
import styles from "./CarouselPhoto.module.css";

const CarouselPhoto = (props) => {
 const images = props.images || ["https://w.forfun.com/fetch/5d/5d88363dc1d7420d433f4ce42d738ec1.jpeg?h=450&r=0.5"];

 const validImages = images.filter(image => image !== null);
// prevIcon={null} nextIcon={null}
  return (
    <Carousel fade   className={styles.myCarousel} >
      {validImages.map((img, index) => (
        <Carousel.Item key={index} className={styles.myCarousel}>
          <img
            className={`${styles.myCarouselImage} d-block w-100`}
            src={img}
            alt={`Slide ${index}`}
          />
          <Carousel.Caption className={styles.myCarousel}>
            {/* <h3>Slide {index} label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p> */}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselPhoto;