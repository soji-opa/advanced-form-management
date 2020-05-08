import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
// props from Formik => values, errors, touched, status
// these are prefixed props sent from Formik into AnimalForm because AnimalForm is wrapped by withFormik HOC
// values => state of inputs & updates with change in input
// errors => any errors from Yup validation
// touched => when an input has be entered and moved away from by user
// status => when chagne from API has updated via setStatus
const AnimalForm = ({ values, errors, touched, status }) => {
  console.log("values", values);
  console.log("touched", touched);
  console.log("errors", errors);
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    console.log("status has changed", status);
    status && setAnimals(animals => [...animals, status]);
  }, [status]);
  return (
    <div className="animal-form">
      <Form>
        <label>
          Species:
          <Field
            type="text"
            name="species"
            placeholder="species"
            value={values.species}
          />
          {touched.species && errors.species && (
            <p className="errors">{errors.species}</p>
          )}
        </label>
        <label>
          Size:
          <Field
            type="text"
            name="size"
            placeholder="size"
            value={values.size}
          />
          {touched.size && errors.size && (
            <p className="errors">{errors.size}</p>
          )}
        </label>
        <Field as="select" name="diet" className="food-select">
          <option disabled>Pick an Option</option>
          <option value="Carnivore">Carnivore</option>
          <option value="Omnivore">Omnivore</option>
          <option value="Herbivore">Herbivore</option>
        </Field>
        <Field
          as="textarea"
          type="text"
          name="body"
          placeholder="Enter Content"
          value={values.body}
        />
        <label className="checkbox-container">Vaccination</label>
        <Field
          type="checkbox"
          name="vaccinations"
          checked={values.vaccinations}
        />
        <span className="checkmark" />
        <button type="submit">Submit!</button>
      </Form>
      {animals.map(animal => {
        return (
          <ul key={animal.id}>
            <li>Speices: {animal.species}</li>
            <li>Size: {animal.size}</li>
          </ul>
        );
      })}
    </div>
  );
};

const FormikAnimalForm = withFormik({
  mapPropsToValues(props) {
    return {
      species: props.species || "",
      diet: props.diet || "",
      size: props.size || "",
      body: props.body || "",
      vaccinations: props.vaccinations || false
    };
  },
  validationSchema: Yup.object().shape({
    species: Yup.string().required("This is required guy"),
    size: Yup.string().required("Size is required")
  }),
  handleSubmit(values, { setStatus, resetForm }) {
    console.log("I am submitting", values);
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        console.log("success", res);
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.log(err.response));
  }
})(AnimalForm);
export default FormikAnimalForm;
