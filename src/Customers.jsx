import { Show } from "solid-js";
import { createSignal } from "solid-js";
import { store, addCustomer, removeCustomer } from "./store";
import CustomerDetails from "./CustomerDetails";
import { createMemo } from "solid-js";
import { createEffect } from "solid-js";

const s = {
  badge: {
    width: "12px",
    height: "12px",
    position: "absolute",
    background: "red",
    "border-radius": "50%",
  },
};

export default function Customers() {
  const [currCustomerId, setCurrCustomerId] = createSignal(null);
  const [hasOffers, setHasOffers] = createSignal(false);

  const currUser = createMemo(() => store.customers.find((c) => c.id === currCustomerId()));
  const currCustomerOffers = createMemo(() =>
    store.customers.find((c) => c.id === currCustomerId())
  );

  createEffect(() => {
    if (currCustomerOffers()) {
      console.log({ currCustomerOffers: currCustomerOffers().appointmentOffers });
      setHasOffers(currCustomerOffers().appointmentOffers.length);
    }
  });

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
            <Show when={person.id === currCustomerId() && hasOffers()}>
              <div style={s.badge}></div>
            </Show>
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
