import { onMount } from "solid-js";
import { For, Show } from "solid-js";
import { getProfessionalById, parseWeekday, getDiffFromNextSameWeekday } from "./helpers";
import { store, confirmOffer } from "./store";

export default function CustomerAppointmentOffers(props) {
  let selectRef;
  const getPossibleDates = (day) => {
    const diff = getDiffFromNextSameWeekday(day);
    const daysFromFirstAppointment = diff < 2 ? diff + 7 : diff;
    const today = new Date().setHours(0, 0, 0);
    const closestPossibleDateTimestamp = today + daysFromFirstAppointment * 24 * 60 * 60 * 1000;

    const closestPossibleDate = new Date(closestPossibleDateTimestamp);
    const closestPossibleDates = Array(4)
      .fill("")
      // 1005 gambiarra javascript enquanto não escolhemos uma lib para datas
      .map((_, i) => new Date(closestPossibleDateTimestamp + (i + 1) * 7 * 24 * 60 * 60 * 1005));

    console.log(parseWeekday(day), {
      day,
      today: new Date().getDay(),
      daysFromFirstAppointment,
      closestPossibleDate,
      closestPossibleDates,
      today,
    });

    return closestPossibleDates;
  };

  onMount(() => {});

  return (
    <div>
      <h3>Appointment Offers</h3>

      {/* <pre>{JSON.stringify(props.offers, null, 2)}</pre> */}
      <Show when={!props.offers.length}>waiting admin offers...</Show>
      <For each={props.offers}>
        {(offer) => (
          <div>
            <span>
              {getProfessionalById(offer.professional_id, store.professionals).name.toUpperCase()}{" "}
              {parseWeekday(offer.day)} {offer.time}
            </span>
            <details>
              <summary></summary>
              <label>start date</label>
              <select
                ref={selectRef}
                value={getPossibleDates(offer.day)[0].toLocaleDateString("en")}
              >
                <For each={getPossibleDates(offer.day)}>
                  {(date) => <option>{date.toLocaleDateString("en")}</option>}
                </For>
              </select>
              <button
                class="btn btn-success"
                onClick={(e) => {
                  confirmOffer(props.customerId, {
                    ...offer,
                    selectedDate: selectRef.value,
                  });
                }}
              >
                ✔ confirm
              </button>
            </details>
          </div>
        )}
      </For>
    </div>
  );
}
