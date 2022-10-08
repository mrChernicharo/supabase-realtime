import useProfessionals from './useProfessionals';
import { createSignal, createEffect } from 'solid-js';

export default function Professionals() {
	const {
		professionals,
		setProfessionals,
		addProfessional,
		removeProfessional,
	} = useProfessionals();
	const [currProfessionalId, setCurrProfessionalId] = createSignal(null);

	const currUser = () =>
		professionals().find(c => c.id === currProfessionalId());

	createEffect(() => {
		console.log(currProfessionalId());
	});

	return (
		<div>
			<h2>Professionals</h2>
			<For each={professionals()}>
				{person => (
					<div className="d-flex">
						<p onClick={e => setCurrProfessionalId(person.id)}>
							{person.name} : {person.email}
						</p>
						<button
							class="btn btn-danger"
							onClick={e => {
								removeProfessional(person.id);
								setCurrProfessionalId(null);
							}}
						>
							X
						</button>
					</div>
				)}
			</For>

			<Show when={currProfessionalId()}>
				<button onClick={e => setCurrProfessionalId(null)}>X</button>
				<h3>{currUser().name}</h3>
				<p>{currUser().email}</p>
			</Show>
		</div>
	);
}
