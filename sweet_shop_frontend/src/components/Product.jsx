import styles from "./Product.module.css";
import ProductCard from "./ProductCard";
import { Carousel, Row, Col } from "react-bootstrap";

const Product = ({ productDescription, productName }) => {
  function chunkArray(arr, chunkSize) {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  const slicedData = chunkArray(productDescription, 5);

  return (
    <section className="mt-5" id={styles.port}>
      <h3 className="mx-5 mt-5" id={styles.heading}>
        <u>{productName}</u>
      </h3>
      <Carousel
        fade
        className="d-flex mx-4 carousel-dark"
        interval={null}
        controls
      >
        {slicedData.map((group, index) => (
          <Carousel.Item key={index} className="d-flex">
            <Row className="justify-content-center">
              {group.map((item, idx) => (
                <Col
                  key={idx}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={2}
                  className="mx-4 mb-3"
                >
                  <ProductCard
                    key={index}
                    imageUrl={item.imageUrl}
                    imageName={item.imageName}
                    oldPrice={item.oldPrice}
                    newPrice={item.newPrice}
                  ></ProductCard>
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
};

export default Product;
