import { For } from "solid-js";
import { getProfessionalById, parseWeekday, getDiffFromNextSameWeekday } from "./helpers";
import { store, confirmOffer } from "./store";

export default function CustomerAppointmentOffers(props) {
  const getPossibleDates = (day) => {
    const diff = getDiffFromNextSameWeekday(day);
    const daysFromFirstAppointment = diff < 2 ? diff + 7 : diff;
    const today = new Date().setHours(0, 0, 0);
    const closestPossibleDateTimestamp = today + daysFromFirstAppointment * 24 * 60 * 60 * 1000;

    const closestPossibleDate = new Date(closestPossibleDateTimestamp);
    const closestPossibleDates = Array(4)
      .fill("")
      .map((_, i) => new Date(closestPossibleDateTimestamp + (i + 1) * 7 * 24 * 60 * 60 * 1000));

    console.log(parseWeekday(day), {
      day,
      today: new Date().getDay(),
      daysFromFirstAppointment,
      closestPossibleDate,
      closestPossibleDates,
      today,
    });

    // const nextSameWeekdayDate =
  };

  return (
    <div>
      <h3>Appointment Offers</h3>

      {/* <pre>{JSON.stringify(props.offers, null, 2)}</pre> */}
      <For each={props.offers}>
        {(offer) => (
          <div>
            <span>
              {getProfessionalById(offer.professional_id, store.professionals).name.toUpperCase()}{" "}
              {parseWeekday(offer.day)} {offer.time}
            </span>
            <details>
              <summary>confirm</summary>
              <select></select>
              <button
                class="btn btn-success"
                onClick={(e) => {
                  getPossibleDates(offer.day);
                  confirmOffer(props.customerId, offer);
                }}
              >
                ✔
              </button>
            </details>
          </div>
        )}
      </For>
    </div>
  );
}
