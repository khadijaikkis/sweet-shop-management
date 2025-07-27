import styles from "./Product.module.css";

const ProductCard = (prop) => {
  return (
    <>
      <div
        id={styles.container}
        style={{ backgroundImage: prop.imageUrl }}
        className={`${styles.cont} mx-3 my-3 ml-5`}
      >
        <div className={styles.overlay}>
          <div className={styles.items}></div>
          <div className={`${styles.items} ${styles.head}`}>
            <p>{prop.imageName}</p>
            <hr />
          </div>
          <div className={`${styles.items} ${styles.price}`}>
            <p className={styles.old}>&#8377; {prop.oldPrice}</p>
            <p className={styles.new}>&#8377; {prop.newPrice}</p>
          </div>
          <div className={`${styles.items} ${styles.cart}`}>
            <i className="fa fa-shopping-cart"></i>
            <span>ADD TO CART</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
