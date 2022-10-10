import { store } from "./store";
import { parseWeekday, getProfessionalById } from "./helpers";
import { s } from "./styles";

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
              <span style={{ color: timeBlock.status === "1" ? "green" : "red" }}>
                {parseWeekday(timeBlock.day)} {timeBlock.time}
              </span>
              <pre>{JSON.stringify(getCustomerAppointments(timeBlock), null, 2)}</pre>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
