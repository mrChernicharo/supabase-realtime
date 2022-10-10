import { createSignal, onMount } from "solid-js";
import { dateToWeekday, getCustomerById } from "./helpers";
import EditProfessionalAvailability from "./EditProfessionalAvailability";
import ProfessionalAvailability from "./ProfessionalAvailability";
import { store } from "./store";
import { s } from "./styles";

export default function ProfessionalDetails(props) {
  return (
    <div style={{ border: "1px dashed #ccc" }}>
      <button onClick={props.onClose}>X</button>
      <h2>{props.professional.name}</h2>
      <p>{props.professional.email}</p>

      <ProfessionalAvailability
        availability={props.professional.availability}
        appointments={props.professional.appointments}
      />

      <EditProfessionalAvailability availability={props.professional.availability} />
    </div>
  );
}
