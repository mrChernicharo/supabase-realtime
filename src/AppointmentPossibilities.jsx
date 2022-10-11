import { createEffect, createSignal, For, createMemo } from "solid-js";
import { store, createAppointmentOffers } from "./store";
import { dateToWeekday, getProfessionalById } from "./helpers";
import { supabase } from "./supabaseClient";
import { Show } from "solid-js";
import Button from "./Button";

export default function AppointmentPossibilities(props) {
  // console.log(props.possibilities);

  const getProfessionalSlotId = (block, profId) =>
    getProfessionalById(profId, store.professionals).availability.find((av) => av.id === block.id)
      .id;

  const isChecked = (block) => {
    return props.appointmentOffers?.find((o) => o.professional_availability_slot_id === block.id);
  };

  return (
    <>
      <form onSubmit={props.onSubmit}>
        <h5>appointment possibilities</h5>
        <For each={Object.keys(props.possibilities)}>
          {(profId, profIdx) => (
            <Show when={props.possibilities[profId].length}>
              <div style={{ border: "1px dashed #eee" }}>
                <h4>{getProfessionalById(profId, store.professionals).name}</h4>

                <For each={props.possibilities[profId]}>
                  {(block, i) => (
                    <div>
                      <label>
                        {dateToWeekday(block.day)} {block.time} {"  "}
                        <input
                          type="checkbox"
                          checked={isChecked(block)}
                          data-day={block.day}
                          data-time={block.time}
                          data-professional_id={getProfessionalById(profId, store.professionals).id}
                          data-professional_availability_slot_id={getProfessionalSlotId(
                            block,
                            profId
                          )}
                        />
                      </label>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          )}
        </For>

        <Button kind="CTA" text="Send" />
      </form>
    </>
  );
}
