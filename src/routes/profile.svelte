<script>
	import { authStore } from '../stores/auth';
	import { goto } from '$app/navigation';

	// логин.
	// на ввод данных проверим наличие такой записи в куках.
	// если есть, тогда скрываем поля логин и пароля и добавляем кнопку выхода.

	let regLogin;
	let regPass;
	let alreadyUsedLogin = false;

	function registrationOnSubmit() {
		let keys = [];
		
		if(regLogin && regPass) {
			// проверим логин на наличие в куках
			keys = [...document.cookie.split(';')];
			keys = keys.map(key => key.split('=')[0]);

			keys.forEach(el => {
				if(el !== regLogin) {
					document.cookie = `${regLogin}=${regPass}`;
					alreadyUsedLogin = false;
				}
				else {
					alreadyUsedLogin = true
				}
			});
			
		}
	}

	function loginOnSubmit() {
		console.log(document.cookie);
	}

	// $: console.log($authStore);
</script>


<div class="container">
	<div class="title">Регистрация</div>
	<form on:submit|preventDefault={registrationOnSubmit}>
		<div class="item_block">
			<label for="auth_mail_login">
				<span >Почта<span class="star">*</span></span>
			</label>
			<input type="text" id="auth_mail_login" bind:value={regLogin}>
		</div>
		<div class="item_block">
			<label for="auth_mail_star">
				<span>Пароль<span class="star">*</span></span>
			</label>
			<input type="password" id="auth_mail_pass" bind:value={regPass}>
		</div>
		<button>Зарегистрироваться</button>
		{#if alreadyUsedLogin}
			такой логин уже используется
		{/if}
	</form>
	
	<!-- <div class="title">... или вход</div>
	<form on:submit|preventDefault={loginOnSubmit}>
		<div class="item_block">
			<label for="auth_mail_login">
				<span >Почта<span class="star">*</span></span>
			</label>
			<input type="text" id="auth_mail_login" bind:value={login}>
		</div>
		<div class="item_block">
			<label for="auth_mail_star">
				<span>Пароль<span class="star">*</span></span>
			</label>
			<input type="password" id="auth_mail_pass" bind:value={pass}>
		</div>
		<button>Войти</button>
	</form> -->
</div>

<style>
	.title {
        font-size: 1.5rem;
        font-weight: 500;
        margin: 1rem 0;
    }
</style>