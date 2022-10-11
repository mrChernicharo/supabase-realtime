import { store } from "./store";
import { dateToWeekday, getProfessionalById } from "./helpers";
import { s } from "./styles";
import AppointmentCard from "./AppointmentCard";

export default function CustomerAvailability(props) {
  const getProfessionalName = (id) => getProfessionalById(id, store.professionals)?.name;

  const haveSameDateAndTime = (appointment, timeBlock) =>
    appointment.day === timeBlock.day && appointment.time === timeBlock.time;

  const getCustomerAppointments = (timeBlock) =>
    props.appointments
      .filter((appointment) => haveSameDateAndTime(appointment, timeBlock))
      .map((appointment) => ({
        ...appointment,
        professional_name: appointment.professional_id
          ? getProfessionalName(appointment.professional_id)
          : "",
      }));

  return (
    <div style={{ border: "1px dashed #ccc" }}>
      <h4>Customer Availability</h4>
      <ul style={s.ul}>
        <For each={props.availability}>
          {(timeBlock) => (
            <li style={s.li}>
              <Show
                when={getCustomerAppointments(timeBlock).length}
                fallback={
                  <>
                    {dateToWeekday(timeBlock.day)} {timeBlock.time}
                  </>
                }
              >
                <AppointmentCard
                  appointment={getCustomerAppointments(timeBlock)[0]}
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
