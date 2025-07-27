import { Form } from "react-bootstrap";

const ProductInsertionInput = (props) => {
  return (
    <>
      <Form.Floating className="mb-3">
        <Form.Control
          id="floatingInputCustom"
          type={props.typ}
          placeholder="name@example.com"
        />
        <label htmlFor="floatingInputCustom">{props.item}</label>
      </Form.Floating>
    </>
  );
};

export default ProductInsertionInput;
