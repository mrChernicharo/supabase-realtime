import { createSignal, onMount } from "solid-js";
import { dateToWeekday, getCustomerById, getProfessionalById } from "./helpers";
import EditProfessionalAvailability from "./EditProfessionalAvailability";
import ProfessionalAvailability from "./ProfessionalAvailability";
import { store } from "./store";
import { s } from "./styles";
import Icon from "./Icon";
import { Show } from "solid-js";
import Button from "./Button";
import Appointments from "./Appointments";

export default function ProfessionalDetails(props) {
  const [isEditOpen, setIsEditOpen] = createSignal(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = createSignal(false);
  const [showAvailability, setShowAvailability] = createSignal(false);

  return (
    <div style={{ border: "1px dashed #ccc" }}>
      <Button kind="close" onClick={props.onClose} />

      <h2>{props.professional.name}</h2>
      <p>{props.professional.email}</p>

      <Show
        when={isAvailabilityOpen()}
        fallback={<Button kind="open" onClick={(e) => setIsAvailabilityOpen(true)} />}
      >
        <Button kind="close" onClick={(e) => setIsAvailabilityOpen(false)} />
        <ProfessionalAvailability
          availability={props.professional.availability}
          appointments={props.professional.appointments}
        />
      </Show>

      <Show
        when={showAvailability()}
        fallback={<Button kind="open" onClick={(e) => setShowAvailability(true)} />}
      >
        <div>
          <Button kind="close" onClick={(e) => setShowAvailability(false)} />
          <Appointments appointments={props.professional.appointments} />
        </div>
      </Show>

      <Show
        when={isEditOpen()}
        fallback={<Button kind="open" onClick={(e) => setIsEditOpen(true)} />}
      >
        <Button kind="close" onClick={(e) => setIsEditOpen(false)} />
        <EditProfessionalAvailability
          professionalId={props.professional.id}
          appointments={props.professional.appointments}
          availability={props.professional.availability}
        />
      </Show>
    </div>
  );
}
