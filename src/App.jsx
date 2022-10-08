import { createClient } from '@supabase/supabase-js';
import { createSignal } from 'solid-js';

import { supabase } from './supabaseClient';

function App() {
	const [professionalEmail, setProfessionalEmail] = createSignal('');
	const [currentUsers, setCurrentUsers] = createSignal([]);

	const channel = supabase.channel('online-users');

	function getRandomUser() {
		const users = ['Alice', 'Bob', 'Mallory', 'Inian'];
		return users[Math.floor(Math.random() * users.length)];
	}

	channel
		.on('presence', { event: 'sync' }, () => {
			console.log('currently online users', channel.presenceState());
			setCurrentUsers(prev => Object.values(channel.presenceState()));
		})
		.on('presence', { event: 'join' }, ({ newPresences }) => {
			console.log(
				'new users have joined',
				{ newPresences },
				channel.presenceState()
			);
		})
		.on('presence', { event: 'leave' }, ({ leftPresences }) => {
			console.log(
				'users have left',
				{ leftPresences },
				channel.presenceState()
			);
		})
		.subscribe(async status => {
			if (status === 'SUBSCRIBED') {
				const message = await channel.track({
					user_name: getRandomUser(),
				});
				console.log(message);
			}
		});

	return (
		<div>
			Hello
			<input
				type="email"
				value={professionalEmail()}
				onChange={e => setProfessionalEmail(e.currentTarget.value)}
			/>
			<pre>{JSON.stringify(currentUsers(), null, 2)}</pre>
		</div>
	);
}

export default App;
