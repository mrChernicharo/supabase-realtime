import useCustomers from './useCustomers';

export default function Customers() {
	const { customers, addCustomer, removeCustomer } = useCustomers();

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
					<div>
						<p>
							{person.name} : {person.email}
							<button
								class="btn btn-danger"
								onClick={e => removeCustomer(person.id)}
							>
								X
							</button>
						</p>
					</div>
				)}
			</For>
		</div>
	);
}
