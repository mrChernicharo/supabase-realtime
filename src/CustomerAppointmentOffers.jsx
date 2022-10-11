import { onMount } from "solid-js";
import { createSignal } from "solid-js";
import { For, Show } from "solid-js";
import {
  timeStrToMinutes,
  getProfessionalById,
  dateToWeekday,
  getDiffFromNextSameWeekday,
} from "./helpers";
import Button from "./Button";
import { store, confirmOffer } from "./store";

export default function CustomerAppointmentOffers(props) {
  const getPossibleDates = (day) => {
    const diff = getDiffFromNextSameWeekday(day);
    const daysFromFirstAppointment = diff < 2 ? diff + 7 : diff;
    const today = new Date().setHours(0, 0, 0);
    const closestPossibleDateTimestamp = today + daysFromFirstAppointment * 24 * 60 * 60 * 1000;

    const closestPossibleDates = Array(4)
      .fill("")
      // 1005 gambiarra javascript enquanto não escolhemos uma lib para datas
      .map((_, i) => new Date(closestPossibleDateTimestamp + (i + 1) * 7 * 24 * 60 * 60 * 1005));

    return closestPossibleDates;
  };

  return (
    <div>
      <h3>Appointment Offers</h3>

      {/* <pre>{JSON.stringify(props.offers, null, 2)}</pre> */}
      <Show when={!props.offers.length}>waiting admin offers...</Show>

      <For each={props.offers}>
        {(offer) => {
          const [selectRef, setSelectRef] = createSignal(null);
          return (
            <div>
              <span>
                {getProfessionalById(offer.professional_id, store.professionals).name.toUpperCase()}{" "}
                {dateToWeekday(offer.day)} {offer.time}
              </span>
              <details>
                <summary></summary>
                <label>start treatment at</label>

                <select
                  ref={setSelectRef}
                  value={getPossibleDates(offer.day)[0].toDateString()}
                  // onChange={(e) => {
                  //   console.log(new Date(selectRef().value));

                  //   console.log(selectRef().value);
                  // }}
                >
                  <For each={getPossibleDates(offer.day)}>
                    {(date) => <option>{date.toDateString()}</option>}
                  </For>
                </select>

                <Button
                  text="confirm appointment"
                  type="CTA"
                  onClick={(e) => {
                    const dateStr = selectRef().value;

                    const ISODateStrFromDateAndTime = (dateStr, time) => {
                      return new Date(
                        new Date(dateStr).getTime() +
                          timeStrToMinutes(time) * 60 * 1000 -
                          new Date(dateStr).getTimezoneOffset() * 60 * 1000
                      ).toISOString();
                    };

                    confirmOffer(props.customerId, {
                      ...offer,
                      selectedDate: dateStr,
                      ISODate: ISODateStrFromDateAndTime(dateStr, offer.time),
                    });
                  }}
                />
              </details>
            </div>
          );
        }}
      </For>
    </div>
  );
}
