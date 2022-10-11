import { createEffect, createSignal } from "solid-js";
import { store, addProfessional, addStaff, removeStaff } from "./store";
import Icon from "./Icon";

export default function Staff() {
  const [selectedStaffId, setSelectedStaffId] = createSignal(null);
  const currUser = () => store.staff.find((p) => p.id === selectedStaffId());

  return (
    <div>
      <label>Staff Email</label>
      <input
        type="email"
        onChange={(e) => {
          if (!e.currentTarget.validity.valid) {
            console.log("invalid email!");
            return;
          }
          const newStaff = {
            name: e.currentTarget.value.split("@")[0],
            email: e.currentTarget.value,
          };
          addStaff(newStaff);
        }}
      />
      <For each={store.staff.map((o) => ({ ...o }))}>
        {(person) => (
          <div class="d-flex clickable">
            <p onClick={(e) => setSelectedStaffId(person.id)}>
              {person.name} : {person.email}
            </p>
            <button
              class="btn btn-danger"
              onClick={(e) => {
                removeStaff(person.id);
                setSelectedStaffId(null);
              }}
            >
              <Icon close />
            </button>
          </div>
        )}
      </For>

      <Show when={selectedStaffId() && currUser()}>
        <button onClick={(e) => setSelectedStaffId(null)}>
          <Icon close />
        </button>
        <h3>{currUser().name}</h3>
        <p>{currUser().email}</p>
        <button onClick={(e) => addProfessional(currUser())}>Register Professional</button>
      </Show>
    </div>
  );
}
