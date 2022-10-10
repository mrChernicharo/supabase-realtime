import { store } from "./store";
import { dateToWeekday, getCustomerById } from "./helpers";
import { s } from "./styles";
import { Show } from "solid-js";
import AppointmentCard from "./AppointmentCard";

export default function ProfessionalAvailability(props) {
  const getCustomerName = (id) => getCustomerById(id, store.customers)?.name;

  const haveSameDateAndTime = (appointment, timeBlock) =>
    appointment.day === timeBlock.day && appointment.time === timeBlock.time;

  const getProfessionalAppointments = (timeBlock) =>
    props.appointments
      .filter((appointment) => haveSameDateAndTime(appointment, timeBlock))
      .map((appointment) => ({
        ...appointment,
        customer_name: appointment.customer_id ? getCustomerName(appointment.customer_id) : "",
      }));

  return (
    <div style={{ border: "1px dashed #ccc" }}>
      <h3>Professional Availability</h3>
      <ul style={s.ul}>
        <For each={props.availability}>
          {(timeBlock) => (
            <li style={{ ...s.li }}>
              <Show
                when={getProfessionalAppointments(timeBlock).length}
                fallback={
                  <>
                    {dateToWeekday(timeBlock.day)} {timeBlock.time}
                  </>
                }
              >
                <AppointmentCard
                  appointment={getProfessionalAppointments(timeBlock)[0]}
                  style={{ "border-bottom": "1px solid #ddd", background: "#eee" }}
                />
              </Show>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
