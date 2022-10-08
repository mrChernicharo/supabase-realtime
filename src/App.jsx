import { createSignal, createEffect } from 'solid-js';
import { onMount } from 'solid-js';
import { supabase } from './supabaseClient';
import useStaff from './useStaff';

function App() {
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
							{person.name || 'user'} : {person.email}
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

export default App;
