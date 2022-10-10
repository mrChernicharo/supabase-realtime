import { createSignal, createEffect } from "solid-js";
import { store, removeProfessional } from "./store";
import ProfessionalDetails from "./ProfessionalDetails";

export default function Professionals() {
  const [currProfessionalId, setCurrProfessionalId] = createSignal(null);

  const currUser = () => store.professionals.find((c) => c.id === currProfessionalId());

  return (
    <div>
      <h2>Professionals</h2>
      <For each={store.professionals}>
        {(person) => (
          <div class="d-flex clickable">
            <p onClick={(e) => setCurrProfessionalId(person.id)}>
              {person.name} : {person.email}
            </p>
            <button
              class="btn btn-danger"
              onClick={(e) => {
                removeProfessional(person.id);
                setCurrProfessionalId(null);
              }}
            >
              X
            </button>
          </div>
        )}
      </For>

      <Show when={currProfessionalId() && currUser()}>
        <ProfessionalDetails
          professional={currUser()}
          onClose={() => setCurrProfessionalId(null)}
        />
      </Show>
    </div>
  );
}
