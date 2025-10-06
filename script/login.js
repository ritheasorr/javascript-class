window.onload = () =>{
   const form = document.getElementById('login-form');
   form.addEventListener('submit', async (event) => {

         event.preventDefault();
         const email = document.getElementById('email').value;
         const password = document.getElementById('password').value;
         console.log(email, password);

         const response = await fetch('../auth.json');
         console.log("response:", response);
         const users = await response.json();
         console.log("users:", users);

         // Perform login logic here
         const user = users.user.find(u => u.email === email && u.password === password);
         if (user) {
             redirecttoHome();
         } else {
             alert('Invalid email or password.');
         }
   });
}

function redirecttoHome() {
   window.location.href = '../view/home.html';
}