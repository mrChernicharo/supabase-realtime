import { onMount, For, createMemo } from "solid-js";
import { store, createAppointmentOffers } from "./store";
import { parseWeekday, getProfessionalById } from "./helpers";
import { supabase } from "./supabaseClient";
import { createSignal } from "solid-js";
import { createEffect } from "solid-js";
import { onCleanup } from "solid-js";
import { Show } from "solid-js";

export default function AvailabilityMatches(props) {
  const [customerAppointmentOffers, setCustomerAppointmentOffers] = createSignal(null);
  const [isLoading, setIsLoading] = createSignal(true);

  const getProfessionalSlotId = (block, profId) =>
    getProfessionalById(profId, store.professionals).availability.find((av) => av.id === block.id)
      .id;

  const matchesByProfessional = createMemo(() => {
    const customerAvailObj = {};
    const matchingBlocksByProfessional = {};

    props.customer.availability.forEach(({ day, time }) => {
      if (!(day in customerAvailObj)) customerAvailObj[day] = [];
      customerAvailObj[day].push({ day, time });
    });

    store.professionals.forEach((prof) => {
      const commonProfAvailability = prof.availability.filter(
        (av) =>
          av.status === "1" &&
          av.day in customerAvailObj &&
          customerAvailObj[av.day].find((o) => o.time === av.time)
      );
      matchingBlocksByProfessional[prof.id] = commonProfAvailability;
    });

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

    await createAppointmentOffers(props.customer.id, selectedTimeBlocks);
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
      <p>{props.customer.id}</p>

      <form onSubmit={handleSubmit}>
        <Show when={!isLoading()} fallback={<div>Loading...</div>}>
          <For each={Object.keys(matchesByProfessional())}>
            {(profId, profIdx) => (
              <div>
                <h4>{getProfessionalById(profId, store.professionals).name}</h4>

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
            )}
          </For>
        </Show>

        <button>Send</button>
      </form>
    </div>
  );
}
