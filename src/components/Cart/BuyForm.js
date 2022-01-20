import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import {Formik} from "formik";
import * as yup from "yup";

const styles = {
  BuyButton: {
    fontSize: "1.3rem",
    margin: "20px",
  },
  CancelButton: {
    fontSize: "0.8rem",
    margin: "10px",
  },
};

const schema = yup.object().shape({
  phone: yup
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .required("Teléfono es un campo requerido"),
  address: yup
    .string()
    .min(12, "La dirección debe tener al menos 12 caracteres")
    .max(250)
    .required("Dirección es un campo requerido"),
  comments: yup.string().max(250),
});

export default function BuyForm({
  handleSubmitForm,
  handleCancel,
  handleReturn,
  disable,
  user,
}) {
  return (
    <Container style={{maxWidth: "800px"}}>
      <h2>Datos del comprador</h2>
      <Formik
        validationSchema={schema}
        onSubmit={values => handleSubmitForm(values)}
        initialValues={{
          name: user.name,
          phone: "",
          email: user.email,
          address: "",
          comments: "",
        }}>
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          dirty,
          values,
          touched,
          isValid,
          errors,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control
                type="text"
                minLength="4"
                maxLength="80"
                name="name"
                value={values.name}
                readOnly
              />
            </Form.Group>

            <Form.Group controlId="phone">
              <Form.Label>Teléfono (requerido)</Form.Label>
              <Form.Control
                type="text"
                placeholder="11-4444-4444"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                name="phone"
                className={touched.phone && errors.phone ? "error" : null}
              />
              {touched.phone && errors.phone ? (
                <div className="errorMessage">{errors.phone}</div>
              ) : null}
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={values.email}
                readOnly
              />
              <Form.Text className="text-muted">
                Te enviaremos la información de la compra a esta dirección.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Dirección para la entrega. (requerido)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Av. Rivadavia 4532 6°E, CABA"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                name="address"
                className={touched.address && errors.address ? "error" : null}
              />
              <Form.Text className="text-muted">
                Indicar calle, número, piso, localidad y provincia.
              </Form.Text>
              {touched.address && errors.address ? (
                <div className="errorMessage">{errors.address}</div>
              ) : null}
              <Form.Control.Feedback type="invalid">
                "TEST"
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="comments">
              <Form.Label>Observaciones (opcional)</Form.Label>
                            <Form.Text className="text-muted">
                Indicá en este campo si tenés alguna observación para el pedido.
              </Form.Text>
              <Form.Control
                type="text"
                placeholder="Entregar envuelto para regalo."
                value={values.comments}
                onChange={handleChange}
                onBlur={handleBlur}
                name="comments"
              />

            </Form.Group>

            <Button
              disabled={!(isValid && dirty) || disable}
              style={styles.BuyButton}
              variant="primary"
              type="submit">
              Confirmar Compra
            </Button>
            <hr />
            <div className="d-flex justify-content-end">
              <Button
                disabled={disable}
                onClick={handleReturn}
                style={styles.CancelButton}
                variant="secondary">
                Volver al listado de productos
              </Button>
              <Button
                disabled={disable}
                onClick={handleCancel}
                style={styles.CancelButton}
                variant="secondary">
                Me arrepentí, cancelar compra
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
