import { createEffect } from 'solid-js';
import { createSignal } from 'solid-js';

import useStaff from './useStaff';

export default function Staff() {
	const { staff, addStaff, removeStaff, createProfessional } = useStaff();
	// const { addProfessional } = useProfessionals();

	const [selectedStaffId, setSelectedStaffId] = createSignal(null);
	const currUser = () => staff().find(p => p.id === selectedStaffId());

	createEffect(() => {
		console.log(selectedStaffId());
	});

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
					<div className="d-flex">
						<p onClick={e => setSelectedStaffId(person.id)}>
							{person.name} : {person.email}
						</p>
						<button
							class="btn btn-danger"
							onClick={e => {
								removeStaff(person.id);
								setSelectedStaffId(null);
							}}
						>
							X
						</button>
					</div>
				)}
			</For>

			<Show when={selectedStaffId() && currUser()}>
				<button onClick={e => setSelectedStaffId(null)}>X</button>
				<h3>{currUser().name}</h3>
				<p>{currUser().email}</p>
			</Show>
		</div>
	);
}
