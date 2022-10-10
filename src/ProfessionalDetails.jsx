import { createSignal, onMount } from "solid-js";
import { dateToWeekday, getCustomerById, getProfessionalById } from "./helpers";
import EditProfessionalAvailability from "./EditProfessionalAvailability";
import ProfessionalAvailability from "./ProfessionalAvailability";
import { store } from "./store";
import { s } from "./styles";
import Icon from "./Icon";

export default function ProfessionalDetails(props) {
  return (
    <div style={{ border: "1px dashed #ccc" }}>
      <button onClick={props.onClose}>
        <Icon close />
      </button>
      <h2>{props.professional.name}</h2>
      <p>{props.professional.email}</p>

      <ProfessionalAvailability
        availability={props.professional.availability}
        appointments={props.professional.appointments}
      />

      <EditProfessionalAvailability
        professionalId={props.professional.id}
        appointments={props.professional.appointments}
        availability={props.professional.availability}
      />
    </div>
  );
}
