import { createSignal, Show, createEffect, createMemo } from "solid-js";
import { store, removeCustomer } from "./store";
import CustomerDetails from "./CustomerDetails";
import Badge from "./Badge";
import Icon from "./Icon";
import Button from "./Button";

export default function CustomersList() {
  const [currCustomerId, setCurrCustomerId] = createSignal(null);

  const selectedCustomer = createMemo(() => store.customers.find((c) => c.id === currCustomerId()));

  const isBrandNewUser = (person) =>
    !person.appointments.length && !person.appointmentOffers.length;
  const hasOffers = (person) => person.appointmentOffers.length;
  const haveAppointments = (person) =>
    person.appointments.length && !person.appointmentOffers.length;

  return (
    <div>
      <For each={store.customers}>
        {(person) => (
          <Show when={person.id}>
            <Badge
              success={haveAppointments(person)}
              warn={hasOffers(person)}
              danger={isBrandNewUser(person)}
            />

            <div class="d-flex clickable">
              <p onClick={(e) => setCurrCustomerId(person.id)}>
                {person.name} : {person.email}
              </p>

              <Button
                kind="trash"
                onClick={(e) => {
                  removeCustomer(person.id);
                  setCurrCustomerId(null);
                }}
              />
            </div>
          </Show>
        )}
      </For>

      <Show when={currCustomerId() && selectedCustomer()}>
        <CustomerDetails customer={selectedCustomer()} onClose={() => setCurrCustomerId(null)} />
      </Show>
    </div>
  );
}
