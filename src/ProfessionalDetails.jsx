import { createSignal, onMount } from "solid-js";
import { dateToWeekday, getCustomerById, getProfessionalById } from "./helpers";
import ProfessionalAvailabilityEdit from "./ProfessionalAvailabilityEdit";
import ProfessionalAvailability from "./ProfessionalAvailability";
import CollapseBox from "./CollapseBox";
import { store } from "./store";
import { s } from "./styles";
import Icon from "./Icon";
import { Show } from "solid-js";
import Button from "./Button";
import Appointments from "./Appointments";

export default function ProfessionalDetails(props) {
  return (
    <div style={{ border: "1px dashed #ccc" }}>
      <Button kind="close" onClick={props.onClose} />

      <h2>{props.professional.name}</h2>
      <p>{props.professional.email}</p>

      <CollapseBox>
        <ProfessionalAvailability
          availability={props.professional.availability}
          appointments={props.professional.appointments}
        />
      </CollapseBox>

      <CollapseBox>
        <Appointments appointments={props.professional.appointments} />
      </CollapseBox>

      <CollapseBox>
        <ProfessionalAvailabilityEdit
          professionalId={props.professional.id}
          appointments={props.professional.appointments}
          availability={props.professional.availability}
        />
      </CollapseBox>
    </div>
  );
}
