import useStaff from './useStaff';

export default function Staff() {
	const { staff, addStaff, removeStaff } = useStaff();

	return (
		<div>
			<label>Staff Email</label>
			<input
				type="email"
				onChange={e => {
					if (!e.currentTarget.validity.valid) {
						console.log('invalid email!');
						return;
					}
					addStaff(e.currentTarget.value);
				}}
			/>
			<For each={staff()}>
				{person => (
					<div>
						<p>
							{person.name} : {person.email}
							<button
								class="btn btn-danger"
								onClick={e => removeStaff(person.id)}
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
