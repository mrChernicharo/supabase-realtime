import { For, createMemo, Show, createSignal } from "solid-js";
import { store } from "./store";

import AvailabilityMatches from "./AvailabilityMatches";
import { s } from "./styles";

export default function AppointmentRequests(props) {
  // fetch customers without appointments & display

  const [customerId, setCustomerId] = createSignal(null);
  const idleCustomers = () => store.customers.filter((c) => !c.appointments.length);
  const currCustomer = () => idleCustomers().find((c) => c.id === customerId());

  // appointmentRequest customer matchingProfessionalAvailabilities
  // fetch all professionals availabilities
  // filter matching availabilities

  return (
    <div style={{ border: "1px dashed" }}>
      <Show when={idleCustomers().length}>
        <div style={{ ...s.badge, background: "red" }}></div>
      </Show>
      <h1>Appointment Requests</h1>

      <For each={idleCustomers()}>
        {(customer) => (
          <div onClick={(e) => setCustomerId(customer.id)}>
            <h2>{customer.name}</h2>
          </div>
        )}
      </For>

      {/* <pre>{JSON.stringify(idleCustomers(), null, 2)}</pre> */}

      <Show when={customerId() && currCustomer()}>
        <AvailabilityMatches customer={currCustomer()} onClose={() => setCustomerId(null)} />
      </Show>
    </div>
  );
}
