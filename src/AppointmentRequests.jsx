import { For, createMemo, Show, createSignal } from "solid-js";
import { store } from "./store";

import AvailabilityMatches from "./AvailabilityMatches";
import { s } from "./styles";
import Badge from "./Badge";

export default function AppointmentRequests(props) {
  const [customerId, setCustomerId] = createSignal(null);

  const customersWithoutAppointments = () => {
    // if (store.customers.find((c) => !c.appointments)) return;
    return store.customers.filter((c) => !c?.appointments?.length);
  };

  const haveUnattendedCustomer = () =>
    customersWithoutAppointments().find((c) => !c?.appointmentOffers?.length);

  const currCustomer = () => customersWithoutAppointments().find((c) => c.id === customerId());

  return (
    <Show when={store.customers.length}>
      <div style={{ border: "1px dashed #ddd" }}>
        <Show when={haveUnattendedCustomer()}>
          <Badge danger />
        </Show>

        <h1>Appointment Requests</h1>

        <For each={customersWithoutAppointments()}>
          {(customer) => (
            <div class="clickable" onClick={(e) => setCustomerId(customer.id)}>
              <div>
                <div>{customer.name}</div>
              </div>
            </div>
          )}
        </For>

        <Show when={customerId() && currCustomer()}>
          <AvailabilityMatches customer={currCustomer()} onClose={() => setCustomerId(null)} />
        </Show>

        {/* <pre>{JSON.stringify(customersWithoutAppointments(), null, 2)}</pre> */}
      </div>
    </Show>
  );
}
