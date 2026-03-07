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

const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  forgotPasswordForm.style.display = forgotPasswordForm.style.display === "none" ? "block" : "none";
});

forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("forgotEmail").value.toLowerCase();
  const newPassword = document.getElementById("forgotNewPassword").value;

  const res = await fetch("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword })
  });

  if (res.ok) {
    alert("Password reset successful. Please login with your new password.");
    forgotPasswordForm.reset();
    forgotPasswordForm.style.display = "none";
  } else {
    alert(await res.text());
  }
});