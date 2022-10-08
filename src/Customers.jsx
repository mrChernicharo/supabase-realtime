import { Show } from 'solid-js';
import { createSignal } from 'solid-js';
import useCustomers from './useCustomers';

export default function Customers() {
	const { customers, addCustomer, removeCustomer } = useCustomers();
	const [currCustomerId, setCurrCustomerId] = createSignal(null);

	const currUser = () => customers().find(c => c.id === currCustomerId());

	return (
		<div>
			<label>Customer Email</label>
			<input
				type="email"
				onChange={e => {
					if (!e.currentTarget.validity.valid) {
						console.log('invalid email!');
						return;
					}
					addCustomer(e.currentTarget.value);
				}}
			/>

			<For each={customers()}>
				{person => (
					<div className="d-flex">
						<p onClick={e => setCurrCustomerId(person.id)}>
							{person.name} : {person.email}
						</p>
						<button
							class="btn btn-danger"
							onClick={e => {
								removeCustomer(person.id);
								setCurrCustomerId(null);
							}}
						>
							X
						</button>
					</div>
				)}
			</For>

			<Show when={currCustomerId()}>
				<button onClick={e => setCurrCustomerId(null)}>X</button>
				<h3>{currUser().name}</h3>
				<p>{currUser().email}</p>
			</Show>
		</div>
	);
}
