const userId = localStorage.getItem('userId');
if(!userId) window.location.href='login.html';

const expenseForm = document.getElementById('expenseForm');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const expenseTableBody = document.getElementById('expenseTableBody');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeText = document.getElementById('welcomeText');
const openFilterBtn = document.getElementById('openFilterBtn');
const closeFilterBtn = document.getElementById('closeFilterBtn');
const filterDrawer = document.getElementById('filterDrawer');
const filterOverlay = document.getElementById('filterOverlay');
const accountAll = document.getElementById('accountAll');
const accountCheckboxes = Array.from(document.querySelectorAll('.account-checkbox'));
const incomePercent = document.getElementById('incomePercent');
const expensePercent = document.getElementById('expensePercent');
const incomeAmount = document.getElementById('incomeAmount');
const expenseAmount = document.getElementById('expenseAmount');
const filterTotalAmount = document.getElementById('filterTotalAmount');

const totalAmount = document.getElementById('totalAmount');
const monthlyAmount = document.getElementById('monthlyAmount');
const highestAmount = document.getElementById('highestAmount');
const expenseCount = document.getElementById('expenseCount');

let expenses = [];
let editingExpenseId = null;
let selectedAccounts = [];

const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;

const formatDate = (rawDate) => {
  if (!rawDate) return '-';
  const parsed = new Date(rawDate);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString();
};

const normalizeAccount = (value) => {
  const account = String(value || '').toLowerCase();
  if (account === 'cash' || account === 'bank' || account === 'card') return account;
  return 'cash';
};

const updateFilterSummary = () => {
  const totals = expenses.reduce((acc, expense) => {
    const amount = Number(expense.amount || 0);
    if (amount < 0) {
      acc.income += Math.abs(amount);
    } else {
      acc.expense += amount;
    }
    return acc;
  }, { income: 0, expense: 0 });

  const total = totals.income + totals.expense;
  const incomePct = total > 0 ? (totals.income / total) * 100 : 0;
  const expensePct = total > 0 ? (totals.expense / total) * 100 : 0;

  incomePercent.textContent = `${Math.round(incomePct)}%`;
  expensePercent.textContent = `${Math.round(expensePct)}%`;
  incomeAmount.textContent = formatCurrency(totals.income);
  expenseAmount.textContent = formatCurrency(totals.expense);
  filterTotalAmount.textContent = formatCurrency(total);
};

const openFilterDrawer = () => {
  filterDrawer.classList.add('open');
  filterOverlay.classList.add('open');
  filterDrawer.setAttribute('aria-hidden', 'false');
};

const closeFilterDrawer = () => {
  filterDrawer.classList.remove('open');
  filterOverlay.classList.remove('open');
  filterDrawer.setAttribute('aria-hidden', 'true');
};

const getSelectedAccounts = () => {
  const values = accountCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => normalizeAccount(checkbox.value));
  return [...new Set(values)];
};

const syncAccountCheckboxes = () => {
  if (selectedAccounts.length === 0) {
    accountAll.checked = true;
    accountCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    return;
  }

  accountAll.checked = false;
  accountCheckboxes.forEach((checkbox) => {
    checkbox.checked = selectedAccounts.includes(normalizeAccount(checkbox.value));
  });
};

const buildExpenseUrl = () => {
  const query = new URLSearchParams();
  if (selectedAccounts.length > 0) {
    query.set('account', selectedAccounts.join(','));
  }
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return `/api/expenses${suffix}`;
};

const getFilteredExpenses = () => {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const sortValue = sortSelect.value;

  let result = [...expenses];

  if (query) {
    result = result.filter((expense) =>
      (expense.title || '').toLowerCase().includes(query)
    );
  }

  if (selectedCategory !== 'all') {
    result = result.filter(
      (expense) => (expense.category || 'General').toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (sortValue === 'amount-high') {
    result.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
  } else if (sortValue === 'amount-low') {
    result.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
  } else if (sortValue === 'oldest') {
    result.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
  } else {
    result.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }

  return result;
};

const updateStats = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const monthly = expenses
    .filter((expense) => {
      const parsed = new Date(expense.date || 0);
      return parsed.getMonth() === currentMonth && parsed.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const highest = expenses.reduce((max, expense) => Math.max(max, Number(expense.amount || 0)), 0);

  totalAmount.textContent = formatCurrency(total);
  monthlyAmount.textContent = formatCurrency(monthly);
  highestAmount.textContent = formatCurrency(highest);
  expenseCount.textContent = expenses.length.toString();
};

const populateCategoryFilter = () => {
  const categories = [...new Set(expenses.map((expense) => (expense.category || 'General').trim()).filter(Boolean))];
  const existingSelection = categoryFilter.value;

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  if (categories.includes(existingSelection)) {
    categoryFilter.value = existingSelection;
  }
};

const resetForm = () => {
  editingExpenseId = null;
  expenseForm.reset();
  submitBtn.textContent = 'Add Expense';
  cancelEditBtn.style.display = 'none';
};

const startEdit = (expense) => {
  editingExpenseId = expense.id;
  titleInput.value = expense.title || '';
  amountInput.value = expense.amount || '';
  categoryInput.value = expense.category || '';
  dateInput.value = expense.date ? new Date(expense.date).toISOString().split('T')[0] : '';
  submitBtn.textContent = 'Update Expense';
  cancelEditBtn.style.display = 'inline-block';
  titleInput.focus();
};

const renderTable = () => {
  const visibleExpenses = getFilteredExpenses();
  expenseTableBody.innerHTML = '';

  if (visibleExpenses.length === 0) {
    expenseTableBody.innerHTML = '<tr><td colspan="5" class="empty-cell">No expenses found</td></tr>';
    return;
  }

  visibleExpenses.forEach((expense) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${expense.title || '-'}</td>
      <td>${expense.category || 'General'}</td>
      <td>${formatCurrency(expense.amount)}</td>
      <td>${formatDate(expense.date)}</td>
      <td>
        <button class="table-btn edit" data-action="edit" data-id="${expense.id}">Edit</button>
        <button class="table-btn delete" data-action="delete" data-id="${expense.id}">Delete</button>
      </td>
    `;
    expenseTableBody.appendChild(tr);
  });
};

const loadExpenses = async()=>{
  const res = await fetch(buildExpenseUrl(),{ headers:{ userid:userId }});
  if (!res.ok) {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
    return;
  }

  const payload = await res.json();
  expenses = (Array.isArray(payload) ? payload : (payload.data || [])).map((expense) => ({
    ...expense,
    account: normalizeAccount(expense.account)
  }));
  updateStats();
  updateFilterSummary();
  populateCategoryFilter();
  renderTable();
};

expenseForm.addEventListener('submit', async e=>{
  e.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    amount: amountInput.value,
    category: categoryInput.value.trim() || 'General',
    date: dateInput.value ? new Date(dateInput.value).toISOString() : new Date().toISOString()
  };

  if (!payload.title || !payload.amount) {
    alert('Title and amount are required');
    return;
  }

  const url = editingExpenseId ? `/expenses/${editingExpenseId}` : '/expenses';
  const method = editingExpenseId ? 'PUT' : 'POST';

  const res = await fetch(url,{
    method,
    headers:{ 'Content-Type':'application/json', userid:userId },
    body:JSON.stringify(payload)
  });

  if (!res.ok) {
    alert('Unable to save expense. Please try again.');
    return;
  }

  resetForm();
  loadExpenses();
});

cancelEditBtn.addEventListener('click', resetForm);

expenseTableBody.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) return;

  const selectedExpense = expenses.find((expense) => expense.id === id);
  if (!selectedExpense) return;

  if (action === 'edit') {
    startEdit(selectedExpense);
    return;
  }

  if (action === 'delete') {
    const confirmed = window.confirm('Delete this expense?');
    if (!confirmed) return;

    const res = await fetch(`/expenses/${id}`, {
      method: 'DELETE',
      headers: { userid: userId }
    });

    if (!res.ok) {
      alert('Unable to delete expense.');
      return;
    }

    if (editingExpenseId === id) {
      resetForm();
    }

    loadExpenses();
  }
});

[searchInput, categoryFilter, sortSelect].forEach((element) => {
  element.addEventListener('input', renderTable);
  element.addEventListener('change', renderTable);
});

openFilterBtn.addEventListener('click', openFilterDrawer);
closeFilterBtn.addEventListener('click', closeFilterDrawer);
filterOverlay.addEventListener('click', closeFilterDrawer);

accountAll.addEventListener('change', async () => {
  if (!accountAll.checked) {
    if (selectedAccounts.length === 0) {
      accountAll.checked = true;
    }
    return;
  }

  selectedAccounts = [];
  syncAccountCheckboxes();
  await loadExpenses();
});

accountCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', async () => {
    selectedAccounts = getSelectedAccounts();
    if (selectedAccounts.length === 0) {
      selectedAccounts = [];
    }
    syncAccountCheckboxes();
    await loadExpenses();
  });
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  window.location.href = 'login.html';
});

const userEmail = localStorage.getItem('userEmail');
if (userEmail) {
  welcomeText.textContent = `Welcome, ${userEmail}`;
}

syncAccountCheckboxes();
loadExpenses();