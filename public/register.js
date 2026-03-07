document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.toLowerCase();
  const password = document.getElementById("password").value;


  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  if (!passwordRegex.test(password)) {
    alert("Password must be 8 characters and include letter, number & special character");
    return;
  }

  const res = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    const data = await res.json();
    alert(data.message || "Registered successfully");
    window.location.href = "login.html";
  } else {
    alert(await res.text());
  }
});