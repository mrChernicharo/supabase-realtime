import { createEffect, createSignal } from "solid-js";
import { store, addProfessional, addStaff, removeStaff } from "./store";

export default function Staff() {
  const [selectedStaffId, setSelectedStaffId] = createSignal(null);
  const currUser = () => store.staff.find((p) => p.id === selectedStaffId());

  createEffect(() => {
    console.log(selectedStaffId());
  });

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
          <div className="d-flex">
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
              X
            </button>
          </div>
        )}
      </For>

      <Show when={selectedStaffId() && currUser()}>
        <button onClick={(e) => setSelectedStaffId(null)}>X</button>
        <h3>{currUser().name}</h3>
        <p>{currUser().email}</p>
        <button onClick={(e) => addProfessional(currUser())}>Create Professional</button>
      </Show>
    </div>
  );
}
