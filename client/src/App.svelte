<script>
	import { Router, Route } from "svelte-navigator";
	import { onMount } from "svelte";
	import Notifications from "svelte-notifications";
	import jwtDecode from "jwt-decode";

	import { loadUser, logout } from "./apis/auth";

	import PrivateRoute from "./components/privateRoute/PrivateRoute.svelte";

	import Register from "./components/auth/Register.svelte";
	import Login from "./components/auth/Login.svelte";
	import ResetPassword from "./components/auth/ResetPassword.svelte";
	import Board from "./components/board/Board.svelte";
	import AdminDashboard from "./components/admin/AdminDashboard.svelte";
	import ViewMessage from "./components/admin/ViewMessage.svelte";
	import Navbar from "./components/navbar/Navbar.svelte";

	onMount(() => {
		if (localStorage.token) {
			let decode = jwtDecode(localStorage.token);
			let currentTime = Date.now() / 1000;
			if (decode.exp < currentTime) {
				logout();
			} else {
				loadUser();
			}
		}

		window.addEventListener("storage", () => {
			if (!localStorage.token) logout();
		});
	});
	export let url = "";
</script>

<main>
	<Notifications>
		<Navbar />
		<Router {url}>
			<PrivateRoute path="/">
				<Board />
			</PrivateRoute>
			<PrivateRoute path="/administrator">
				<AdminDashboard />
			</PrivateRoute>
			<PrivateRoute path="/administrator/view_message">
				<ViewMessage />
			</PrivateRoute>
			<Route path="/auth/register" component={Register} />
			<Route path="/auth/login" component={Login} />
			<Route path="/auth/resetPassword/:userId/:token" let:params>
				<ResetPassword {params} />
			</Route>
		</Router>
	</Notifications>
</main>

<style>
	main {
		text-align: center;
		padding: p;
		margin: 0 auto;
		height: 100vh;
	}
</style>
