const userId = localStorage.getItem('userId');
if(!userId) window.location='/login.html';

const loadExpenses = async()=>{
  const res = await fetch('/expenses',{ headers:{ userid:userId }});
  const expenses = await res.json();
  expenseList.innerHTML='';
  expenses.forEach(e=>{
    const li=document.createElement('li');
    li.textContent=`${e.title} - ₹${e.amount}`;
    expenseList.appendChild(li);
  });
};

expenseForm.addEventListener('submit', async e=>{
  e.preventDefault();
  await fetch('/expenses',{
    method:'POST',
    headers:{ 'Content-Type':'application/json', userid:userId },
    body:JSON.stringify({ title:title.value, amount:amount.value })
  });
  expenseForm.reset(); loadExpenses();
});

loadExpenses();