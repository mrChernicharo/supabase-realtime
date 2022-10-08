import { createSignal, createEffect } from 'solid-js';
import { onMount } from 'solid-js';
import { supabase } from './supabaseClient';
import Staff from './Staff';
import Customers from './Customers';
import Professionals from './Professionals';

function App() {
	return (
		<div style={{ display: 'flex' }}>
			<Staff />

			<Customers />

			<Professionals />
		</div>
	);
}

export default App;
