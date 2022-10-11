import { createSignal, onMount } from "solid-js";
import { dateToWeekday, getCustomerById, getProfessionalById } from "./helpers";
import EditProfessionalAvailability from "./EditProfessionalAvailability";
import ProfessionalAvailability from "./ProfessionalAvailability";
import { store } from "./store";
import { s } from "./styles";
import Icon from "./Icon";
import { Show } from "solid-js";
import Button from "./Button";

export default function ProfessionalDetails(props) {
  const [isEditOpen, setIsEditOpen] = createSignal(false);

  return (
    <div style={{ border: "1px dashed #ccc" }}>
      <Button type="close" onClick={props.onClose} />

      <h2>{props.professional.name}</h2>
      <p>{props.professional.email}</p>

      <ProfessionalAvailability
        availability={props.professional.availability}
        appointments={props.professional.appointments}
      />

      <Show
        when={isEditOpen()}
        fallback={<Button type="open" onClick={(e) => setIsEditOpen(true)} />}
      >
        <Button type="close" onClick={(e) => setIsEditOpen(false)} />
        <EditProfessionalAvailability
          professionalId={props.professional.id}
          appointments={props.professional.appointments}
          availability={props.professional.availability}
        />
      </Show>
    </div>
  );
}
