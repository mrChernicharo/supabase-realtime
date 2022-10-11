import { createEffect, createSignal } from "solid-js";
import { store, addProfessional, addStaff, removeStaff } from "./store";
import Icon from "./Icon";
import Button from "./Button";

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

            <Button
              type="delete"
              onClick={(e) => {
                removeStaff(person.id);
                setSelectedStaffId(null);
              }}
            />
          </div>
        )}
      </For>

      <Show when={selectedStaffId() && currUser()}>
        <Button type="close" onClick={(e) => setSelectedStaffId(null)} />
        <h3>{currUser().name}</h3>
        <p>{currUser().email}</p>
        <Button
          type="light"
          text="Register Professional"
          onClick={(e) => addProfessional(currUser())}
        />
      </Show>
    </div>
  );
}
