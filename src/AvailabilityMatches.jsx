import { onMount, For, createMemo } from "solid-js";
import { store, createAppointmentOffers } from "./store";
import { parseWeekday } from "./helpers";
import { supabase } from "./supabaseClient";
import { createSignal } from "solid-js";
import { createEffect } from "solid-js";
import { onCleanup } from "solid-js";
import { Show } from "solid-js";

export default function AvailabilityMatches(props) {
  const [customerAppointmentOffers, setCustomerAppointmentOffers] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);

  const getProfessional = (id) => store.professionals.find((p) => p.id === id);

  const getProfessionalSlotId = (block, profId) =>
    getProfessional(profId).availability.find((av) => av.id === block.id).id;

  const matchesByProfessional = createMemo(() => {
    const availObj = {};
    props.customer.availability.forEach(({ day, time }) => {
      if (!(day in availObj)) availObj[day] = [];

      availObj[day].push({ day, time });
    });

    const matchingBlocksByProfessional = {};
    store.professionals.forEach((prof) => {
      const commonProfAvailability = prof.availability.filter(
        (av) =>
          av.status === "1" &&
          av.day in availObj &&
          availObj[av.day].find((o) => o.time === av.time)
      );

      matchingBlocksByProfessional[prof.id] = commonProfAvailability;
    });

    // console.log({ matchingBlocksByProfessional, availObj });
    return matchingBlocksByProfessional;
  });

  const isChecked = (block) => {
    return customerAppointmentOffers().find(
      (o) => o.professional_availability_slot_id === block.id
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const selectedCheckboxes = [...e.currentTarget].filter((d) => d.checked);
    const selectedTimeBlocks = selectedCheckboxes.map((d) => ({
      ...d.dataset,
      customer_id: props.customer.id,
    }));

    await createAppointmentOffers(selectedTimeBlocks);
  }

  createEffect(async () => {
    setIsLoading(true);

    // getCustomerAppointmentOffers
    const { data } = await supabase
      .from("appointment_offers")
      .select("*")
      .eq("customer_id", props.customer.id);

    setCustomerAppointmentOffers(data);

    setIsLoading(false);
  });

  // createEffect(() => {
  //   console.log(customerAppointmentOffers());
  // });

  return (
    <div>
      <button onClick={props.onClose}>X</button>

      <h3>{props.customer.name}</h3>
      <p>{props.customer.email}</p>

      <form onSubmit={handleSubmit}>
        <Show when={!isLoading()} fallback={<div>Loading...</div>}>
          <For each={Object.keys(matchesByProfessional())}>
            {(profId, profIdx) => (
              <div>
                <h4>{getProfessional(profId).name}</h4>

                <For each={matchesByProfessional()[profId]}>
                  {(block, i) => (
                    <div>
                      <label>
                        {parseWeekday(block.day)} {block.time} {"  "}
                        <input
                          type="checkbox"
                          checked={isChecked(block)}
                          data-day={block.day}
                          data-time={block.time}
                          data-professional_id={getProfessional(profId).id}
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
            )}
          </For>
        </Show>

        <button>Send</button>
      </form>
    </div>
  );
}
