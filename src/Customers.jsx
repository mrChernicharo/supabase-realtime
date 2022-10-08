import { Show } from "solid-js";
import { createSignal } from "solid-js";
import { store, addCustomer, removeCustomer } from "./store";
import CustomerDetails from "./CustomerDetails";

export default function Customers() {
  const [currCustomerId, setCurrCustomerId] = createSignal(null);

  const currUser = () => store.customers.find((c) => c.id === currCustomerId());

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
        )}
      </For>

      <Show when={currCustomerId()}>
        <CustomerDetails customer={currUser()} onClose={() => setCurrCustomerId(null)} />
      </Show>
    </div>
  );
}
