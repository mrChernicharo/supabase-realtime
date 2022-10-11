import { createSignal, onMount } from "solid-js";
import { dateToWeekday, getCustomerById, getProfessionalById } from "./helpers";
import EditProfessionalAvailability from "./EditProfessionalAvailability";
import ProfessionalAvailability from "./ProfessionalAvailability";
import { store } from "./store";
import { s } from "./styles";
import Icon from "./Icon";
import { Show } from "solid-js";

export default function ProfessionalDetails(props) {
  const [isEditOpen, setIsEditOpen] = createSignal(false);

  const openBtn = () => (
    <button onClick={() => setIsEditOpen(true)}>
      <Icon chevronDown />
    </button>
  );

  const closeBtn = () => (
    <button onClick={() => setIsEditOpen(false)}>
      <Icon close />
    </button>
  );

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

      <Show when={isEditOpen()} fallback={openBtn()}>
        {closeBtn()}
        <EditProfessionalAvailability
          professionalId={props.professional.id}
          appointments={props.professional.appointments}
          availability={props.professional.availability}
        />
      </Show>
    </div>
  );
}
