document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.toLowerCase();
  const password = document.getElementById("password").value;

  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    const raw = await res.text();
    let data = {};

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (error) {
      data = {};
    }

    const resolvedUserId = data.userId || email;
    localStorage.setItem("userId", resolvedUserId);
    localStorage.setItem("userEmail", data.email || email);
    window.location.href = "dashboard.html";
  } else {
    alert(await res.text());
  }
});

const passwordInput = document.getElementById("password");
const togglePasswordButton = document.getElementById("togglePassword");

togglePasswordButton.addEventListener("click", () => {
  const shouldShowPassword = passwordInput.type === "password";
  passwordInput.type = shouldShowPassword ? "text" : "password";
  togglePasswordButton.innerHTML = shouldShowPassword
    ? '<i class="fa-regular fa-eye-slash"></i>'
    : '<i class="fa-regular fa-eye"></i>';
  togglePasswordButton.setAttribute(
    "aria-label",
    shouldShowPassword ? "Hide password" : "Show password"
  );
});