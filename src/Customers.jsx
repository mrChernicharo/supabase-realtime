import { Show } from "solid-js";
import { createSignal } from "solid-js";
import { store, addCustomer, removeCustomer } from "./store";
import CustomerDetails from "./CustomerDetails";
import { createMemo } from "solid-js";
import { createEffect } from "solid-js";
import { s } from "./styles";

export default function Customers() {
  const [currCustomerId, setCurrCustomerId] = createSignal(null);

  const selectedCustomer = createMemo(() => store.customers.find((c) => c.id === currCustomerId()));

  createEffect(() => {});

  const brandNewUser = (person) => !person.appointments.length && !person.appointmentOffers.length;
  const withOffersUser = (person) => person.appointmentOffers.length;
  const withAppointmentsUser = (person) =>
    person.appointments.length && !person.appointmentOffers.length;

  return (
    <div>
      <label>Customer Email</label>
      <input
        type="email"
        onChange={(e) => {
          if (!e.currentTarget.validity.valid) {
            console.log("invalid email!");
            return;
          }
          const newCustomer = {
            name: e.currentTarget.value.split("@")[0],
            email: e.currentTarget.value,
          };
          addCustomer(newCustomer);
        }}
      />

      <For each={store.customers}>
        {(person) => (
          <Show when={person.id}>
            <Show when={brandNewUser(person)}>
              <div style={{ ...s.badge, background: "#ea2020" }}></div>
            </Show>
            <Show when={withOffersUser(person)}>
              <div style={{ ...s.badge, background: "#ffc506" }}></div>
            </Show>
            <Show when={withAppointmentsUser(person)}>
              <div style={{ ...s.badge, background: "#1eecb5" }}></div>
            </Show>

            <div className="d-flex">
              <p onClick={(e) => setCurrCustomerId(person.id)}>
                {person.name} : {person.email}
              </p>
              <button
                class="btn btn-danger"
                onClick={(e) => {
                  removeCustomer(person.id);
                  setCurrCustomerId(null);
                }}
              >
                X
              </button>
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
