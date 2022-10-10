import { createSignal, Show, createEffect, createMemo } from "solid-js";
import { store, addCustomer, removeCustomer } from "./store";
import CustomerDetails from "./CustomerDetails";
import Badge from "./Badge";

export default function Customers() {
  const [currCustomerId, setCurrCustomerId] = createSignal(null);

  const selectedCustomer = createMemo(() => store.customers.find((c) => c.id === currCustomerId()));

  createEffect(() => {});

  const isBrandNewUser = (person) =>
    !person.appointments.length && !person.appointmentOffers.length;
  const hasOffers = (person) => person.appointmentOffers.length;
  const haveAppointments = (person) =>
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
            <Badge
              success={haveAppointments(person)}
              warn={hasOffers(person)}
              danger={isBrandNewUser(person)}
            />

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
