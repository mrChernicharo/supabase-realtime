export default function AppointmentCard(props) {
  console.log(props.appointment);

  return (
    <div>
      <p>{props.appointment.professional_name}</p>
      <p>{props.appointment.customer_name}</p>
      <p>{props.appointment.datetime}</p>
    </div>
  );
}
