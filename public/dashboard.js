const userId = localStorage.getItem('userId');
if(!userId) window.location.href='login.html';

const expenseForm = document.getElementById('expenseForm');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const accountInput = document.getElementById('account');
const dateInput = document.getElementById('date');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

const expenseTableBody = document.getElementById('expenseTableBody');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeText = document.getElementById('welcomeText');
const openStatsBtn = document.getElementById('openStatsBtn');
const openFilterBtn = document.getElementById('openFilterBtn');
const openCalendarBtn = document.getElementById('openCalendarBtn');
const closeFilterBtn = document.getElementById('closeFilterBtn');
const filterDrawer = document.getElementById('filterDrawer');
const filterOverlay = document.getElementById('filterOverlay');
const statsOverlay = document.getElementById('statsOverlay');
const statsModal = document.getElementById('statsModal');
const closeStatsBtn = document.getElementById('closeStatsBtn');
const dailyTotal = document.getElementById('dailyTotal');
const weeklyTotal = document.getElementById('weeklyTotal');
const statsMonthlyTotal = document.getElementById('statsMonthlyTotal');
const yearlyTotal = document.getElementById('yearlyTotal');
const weeklyTrendText = document.getElementById('weeklyTrendText');
const calendarOverlay = document.getElementById('calendarOverlay');
const calendarModal = document.getElementById('calendarModal');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const calendarMonthLabel = document.getElementById('calendarMonthLabel');
const calendarGrid = document.getElementById('calendarGrid');
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
let calendarViewDate = new Date();

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

const getCategoryBadgeClass = (category) => {
  const normalized = String(category || '').trim().toLowerCase();
  if (normalized === 'food') return 'category-badge category-food';
  if (normalized === 'travel') return 'category-badge category-travel';
  if (normalized === 'shopping' || normalized === 'clothes' || normalized === 'clothing') {
    return 'category-badge category-shopping';
  }
  return 'category-badge category-other';
};

const getAccountDisplay = (account) => {
  const normalized = normalizeAccount(account);
  if (normalized === 'cash') return '💵 Cash';
  if (normalized === 'bank') return '🏦 Bank';
  return '💳 Card';
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

const openStatsModal = () => {
  updateStatisticsPanel();
  statsOverlay.classList.add('open');
  statsModal.classList.add('open');
  statsModal.setAttribute('aria-hidden', 'false');
};

const closeStatsModal = () => {
  statsOverlay.classList.remove('open');
  statsModal.classList.remove('open');
  statsModal.setAttribute('aria-hidden', 'true');
};

const toInputDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const openCalendarModal = () => {
  const parsed = dateInput.value ? new Date(dateInput.value) : new Date();
  calendarViewDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  renderCalendar();
  calendarOverlay.classList.add('open');
  calendarModal.classList.add('open');
  calendarModal.setAttribute('aria-hidden', 'false');
};

const closeCalendarModal = () => {
  calendarOverlay.classList.remove('open');
  calendarModal.classList.remove('open');
  calendarModal.setAttribute('aria-hidden', 'true');
};

const getExpenseDateSet = () => {
  const dates = new Set();
  expenses.forEach((expense) => {
    const parsed = new Date(expense.date || '');
    if (!Number.isNaN(parsed.getTime())) {
      dates.add(toInputDate(parsed));
    }
  });
  return dates;
};

const renderCalendar = () => {
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const selectedDate = dateInput.value || '';
  const expenseDateSet = getExpenseDateSet();

  calendarMonthLabel.textContent = calendarViewDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric'
  });

  calendarGrid.innerHTML = '';

  const totalCells = 42;
  for (let cellIndex = 0; cellIndex < totalCells; cellIndex += 1) {
    let dayNumber;
    let cellDate;
    let isOutsideMonth = false;

    if (cellIndex < firstDayIndex) {
      dayNumber = prevMonthDays - firstDayIndex + cellIndex + 1;
      cellDate = new Date(year, month - 1, dayNumber);
      isOutsideMonth = true;
    } else if (cellIndex >= firstDayIndex + daysInMonth) {
      dayNumber = cellIndex - (firstDayIndex + daysInMonth) + 1;
      cellDate = new Date(year, month + 1, dayNumber);
      isOutsideMonth = true;
    } else {
      dayNumber = cellIndex - firstDayIndex + 1;
      cellDate = new Date(year, month, dayNumber);
    }

    const cellDateValue = toInputDate(cellDate);
    const dayButton = document.createElement('button');
    dayButton.type = 'button';
    dayButton.className = 'calendar-day';
    dayButton.textContent = String(dayNumber);
    dayButton.dataset.date = cellDateValue;

    if (isOutsideMonth) {
      dayButton.classList.add('outside');
    }

    if (expenseDateSet.has(cellDateValue)) {
      dayButton.classList.add('has-expense');
    }

    if (selectedDate && selectedDate === cellDateValue) {
      dayButton.classList.add('selected');
    }

    dayButton.addEventListener('click', () => {
      dateInput.value = cellDateValue;
      closeCalendarModal();
    });

    calendarGrid.appendChild(dayButton);
  }
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

const updateStatisticsPanel = () => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  const currentWeekStart = new Date(todayStart);
  currentWeekStart.setDate(currentWeekStart.getDate() - 6);
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(previousWeekStart.getDate() - 7);
  const previousWeekEnd = new Date(currentWeekStart);

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totals = expenses.reduce((acc, expense) => {
    const amount = Number(expense.amount || 0);
    const parsedDate = new Date(expense.date || '');
    if (Number.isNaN(parsedDate.getTime())) return acc;

    if (parsedDate >= todayStart && parsedDate < tomorrowStart) {
      acc.daily += amount;
    }

    if (parsedDate >= currentWeekStart && parsedDate < tomorrowStart) {
      acc.weekly += amount;
    }

    if (parsedDate >= previousWeekStart && parsedDate < previousWeekEnd) {
      acc.previousWeekly += amount;
    }

    if (parsedDate.getMonth() === currentMonth && parsedDate.getFullYear() === currentYear) {
      acc.monthly += amount;
    }

    if (parsedDate.getFullYear() === currentYear) {
      acc.yearly += amount;
    }

    return acc;
  }, {
    daily: 0,
    weekly: 0,
    previousWeekly: 0,
    monthly: 0,
    yearly: 0
  });

  dailyTotal.textContent = formatCurrency(totals.daily);
  weeklyTotal.textContent = formatCurrency(totals.weekly);
  statsMonthlyTotal.textContent = formatCurrency(totals.monthly);
  yearlyTotal.textContent = formatCurrency(totals.yearly);

  const currentWeekly = totals.weekly;
  const previousWeekly = totals.previousWeekly;
  if (previousWeekly <= 0) {
    weeklyTrendText.textContent = currentWeekly > 0
      ? 'No spending in last week to compare.'
      : 'No weekly spending data yet.';
    return;
  }

  const diff = currentWeekly - previousWeekly;
  const percentage = Math.round(Math.abs((diff / previousWeekly) * 100));

  if (diff > 0) {
    weeklyTrendText.textContent = `You spent ${percentage}% more than last week.`;
  } else if (diff < 0) {
    weeklyTrendText.textContent = `You spent ${percentage}% less than last week.`;
  } else {
    weeklyTrendText.textContent = 'You spent the same as last week.';
  }
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
  accountInput.value = normalizeAccount(expense.account);
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
    const categoryText = expense.category || 'General';
    const categoryClass = getCategoryBadgeClass(categoryText);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${expense.title || '-'}</td>
      <td><span class="${categoryClass}">${categoryText}</span></td>
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
  updateStatisticsPanel();
  updateFilterSummary();
  renderCalendar();
  populateCategoryFilter();
  renderTable();
};

expenseForm.addEventListener('submit', async e=>{
  e.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    amount: amountInput.value,
    category: categoryInput.value.trim() || 'General',
    account: accountInput.value || 'cash',
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

openStatsBtn.addEventListener('click', openStatsModal);
openFilterBtn.addEventListener('click', openFilterDrawer);
if (openCalendarBtn) {
  openCalendarBtn.addEventListener('click', openCalendarModal);
}
closeStatsBtn.addEventListener('click', closeStatsModal);
closeFilterBtn.addEventListener('click', closeFilterDrawer);
filterOverlay.addEventListener('click', closeFilterDrawer);
statsOverlay.addEventListener('click', closeStatsModal);
calendarOverlay.addEventListener('click', closeCalendarModal);
prevMonthBtn.addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() - 1, 1);
  renderCalendar();
});
nextMonthBtn.addEventListener('click', () => {
  calendarViewDate = new Date(calendarViewDate.getFullYear(), calendarViewDate.getMonth() + 1, 1);
  renderCalendar();
});

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
    // If clicking an individual checkbox while All is checked, uncheck All first
    if (accountAll.checked && checkbox.checked) {
      accountAll.checked = false;
    }
    
    selectedAccounts = getSelectedAccounts();
    
    // If no individual checkboxes are selected, automatically select All
    if (selectedAccounts.length === 0) {
      selectedAccounts = [];
      accountAll.checked = true;
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