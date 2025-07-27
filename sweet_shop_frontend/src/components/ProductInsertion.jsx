import { Button, Container, Form } from "react-bootstrap";
import ProductInsertionInput from "./ProductInsertionInput";

const ProductInsertion = () => {
  const InputDetails = [
    {
      item: "Product Name",
      typ: "text",
    },
    {
      item: "Old Price",
      typ: "number",
    },
    {
      item: "New Price",
      typ: "number",
    },
    {
      item: "Image Url",
      typ: "file",
    },
  ];
  return (
    <>
      <Container className="border col-lg-4 mt-5 p-4">
        <h2>Product Details</h2>
        <Form>
          {InputDetails.map((product, indx) => (
            <ProductInsertionInput
              key={indx}
              item={product.item}
              typ={product.typ}
            ></ProductInsertionInput>
          ))}
          <Button
            variant="success"
            // onClick={() => InputDetails.push({ item: "Colour", typ: "text" })}
          >
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default ProductInsertion;
