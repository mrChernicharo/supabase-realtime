import { createEffect, createSignal, For, createMemo } from "solid-js";
import { store, createAppointmentOffers } from "./store";
import { dateToWeekday, getProfessionalById } from "./helpers";
import { supabase } from "./supabaseClient";
import { Show } from "solid-js";
import Button from "./Button";
import AppointmentPossibilities from "./AppointmentPossibilities";

export default function AvailabilityMatches(props) {
  const [isLoading, setIsLoading] = createSignal(true);
  const [customerAppointmentOffers, setCustomerAppointmentOffers] = createSignal(null);

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
  return (
    <div>
      <Button kind="close" onClick={props.onClose} />

      <h3>{props.customer.name}</h3>
      <p>{props.customer.email}</p>
      <p>{props.customer.id}</p>

      <Show when={!isLoading()} fallback={<div>Loading...</div>}>
        <Show
          when={Object.keys(matchesByProfessional()).length}
          fallback={<div>No available professionals!</div>}
        >
          <AppointmentPossibilities
            possibilities={matchesByProfessional()}
            onSubmit={handleSubmit}
            appointmentOffers={customerAppointmentOffers()}
          />
        </Show>
      </Show>
    </div>
  );
}
