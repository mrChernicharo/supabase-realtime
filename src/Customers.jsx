import { Show } from "solid-js";
import { createSignal } from "solid-js";
import { store, addCustomer, removeCustomer } from "./store";

export default function Customers() {
  const [currCustomerId, setCurrCustomerId] = createSignal(null);

  const currUser = () => customers.find((c) => c.id === currCustomerId());

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
        <button onClick={(e) => setCurrCustomerId(null)}>X</button>
        <h3>{currUser().name}</h3>
        <p>{currUser().email}</p>
      </Show>
    </div>
  );
}
