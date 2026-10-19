
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const filterCategory = document.getElementById("filterCategory");
const startDateFilter = document.getElementById("startDateFilter");
const endDateFilter = document.getElementById("endDateFilter");
const clearDateFilters = document.getElementById("clearDateFilters");

const addExpenseButton = document.getElementById("addExpense");

const successModal = document.getElementById("successModal");
const viewExpensesButton = document.getElementById("viewExpensesButton");
const addAnotherButton = document.getElementById("addAnotherButton");

// Edit Expense elements
const editExpenseModal = document.getElementById("editExpenseModal");
const editExpenseForm = document.getElementById("editExpenseForm");
const editDescriptionInput = document.getElementById("editDescription");
const editAmountInput = document.getElementById("editAmount");
const editCategoryInput = document.getElementById("editCategory");
const editDateInput = document.getElementById("editDate");
const cancelEditButton = document.getElementById("cancelEditButton");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editingExpenseIndex = null;


// Save expenses to browser storage
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}


// Add a new expense
addExpenseButton.addEventListener("click", function () {
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (description === "") {
        alert("Please enter a description.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter an amount greater than 0.");
        return;
    }

    if (category === "") {
        alert("Please select a category.");
        return;
    }

    if (
        date === "" ||
        date < "1900-01-01" ||
        date > "2100-12-31"
    ) {
        alert("Please select a date between 1900 and 2100.");
        return;
    }

    const now = new Date();

    const recordedDate = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");

    const expense = {
        recordedDate: recordedDate,
        description: description,
        amount: amount,
        category: category,
        date: date
    };

    expenses.unshift(expense);

    try {
        saveExpenses();
    } catch (error) {
        expenses.shift();
        alert("Unable to save the expense. Please try again.");
        return;
    }

    displayExpenses();

    descriptionInput.value = "";
    amountInput.value = "";
    categoryInput.value = "";
    dateInput.value = "";

    successModal.hidden = false;
    viewExpensesButton.focus();
});


// Display expenses using the selected category and Date Spent filters
function displayExpenses() {
    const expensesContainer = document.getElementById("expenses");
    const totalAmountElement = document.getElementById("totalAmount");
    const expenseCountElement = document.getElementById("expenseCount");
    const emptyMessage = document.getElementById("emptyMessage");

    expensesContainer.innerHTML = "";

    const selectedCategory = filterCategory.value;
    const startDate = startDateFilter.value;
    const endDate = endDateFilter.value;

    const filteredExpenses = expenses.filter(function (expense) {
        const matchesCategory =
            selectedCategory === "All" ||
            expense.category === selectedCategory;

        // expense.date represents Date Spent, not Date Recorded.
        const matchesStartDate =
            startDate === "" || expense.date >= startDate;

        const matchesEndDate =
            endDate === "" || expense.date <= endDate;

        return (
            matchesCategory &&
            matchesStartDate &&
            matchesEndDate
        );
    });

    let total = 0;

    filteredExpenses.forEach(function (expense) {
        total += Number(expense.amount);

        const row = document.createElement("tr");

        const recordedDateCell = document.createElement("td");
        recordedDateCell.textContent = expense.recordedDate || "—";

        const dateCell = document.createElement("td");
        dateCell.textContent = expense.date;

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = expense.description;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;

        const amountCell = document.createElement("td");
        amountCell.textContent = Number(expense.amount).toLocaleString(
            "en-KE",
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );

        const actionCell = document.createElement("td");

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.type = "button";

        editButton.addEventListener("click", function () {
            const actualIndex = expenses.indexOf(expense);

            if (actualIndex !== -1) {
                openEditModal(actualIndex);
            }
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            const actualIndex = expenses.indexOf(expense);

            if (actualIndex !== -1) {
                deleteExpense(actualIndex);
            }
        });

        actionCell.append(editButton, deleteButton);

        row.append(
            recordedDateCell,
            dateCell,
            descriptionCell,
            categoryCell,
            amountCell,
            actionCell
        );

        expensesContainer.appendChild(row);
    });

    totalAmountElement.textContent = total.toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    expenseCountElement.textContent =
        filteredExpenses.length +
        (filteredExpenses.length === 1 ? " expense" : " expenses");

    emptyMessage.hidden = filteredExpenses.length !== 0;
}


// Re-render when filters change
filterCategory.addEventListener("change", displayExpenses);

startDateFilter.addEventListener("change", function () {
    validateDateRange("start");
});

endDateFilter.addEventListener("change", function () {
    validateDateRange("end");
});

function validateDateRange(changedField) {
    const startDate = startDateFilter.value;
    const endDate = endDateFilter.value;

    if (startDate && endDate && startDate > endDate) {
        alert("The start date cannot be later than the end date.");

        if (changedField === "start") {
            endDateFilter.value = "";
        } else {
            startDateFilter.value = "";
        }
    }

    displayExpenses();
}


// Clear both date filters without changing the category filter
clearDateFilters.addEventListener("click", function () {
    startDateFilter.value = "";
    endDateFilter.value = "";

    displayExpenses();
});


// Open the Edit Expense modal
function openEditModal(index) {
    const expense = expenses[index];

    if (!expense) {
        return;
    }

    editingExpenseIndex = index;

    editDescriptionInput.value = expense.description;
    editAmountInput.value = expense.amount;
    editCategoryInput.value = expense.category;
    editDateInput.value = expense.date;

    editExpenseModal.hidden = false;
    editDescriptionInput.focus();
}


// Save edits to the existing expense
editExpenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (
        editingExpenseIndex === null ||
        !expenses[editingExpenseIndex]
    ) {
        alert("Unable to find this expense. Please try again.");
        closeEditModal();
        return;
    }

    const description = editDescriptionInput.value.trim();
    const amount = Number(editAmountInput.value);
    const category = editCategoryInput.value;
    const date = editDateInput.value;

    if (description === "") {
        alert("Please enter a description.");
        editDescriptionInput.focus();
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter an amount greater than 0.");
        editAmountInput.focus();
        return;
    }

    if (category === "") {
        alert("Please select a category.");
        editCategoryInput.focus();
        return;
    }

    if (
        date === "" ||
        date < "1900-01-01" ||
        date > "2100-12-31"
    ) {
        alert("Please select a date between 1900 and 2100.");
        editDateInput.focus();
        return;
    }

    const expense = expenses[editingExpenseIndex];

    // Keep the original recordedDate unchanged.
    const originalValues = {
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date
    };

    expense.description = description;
    expense.amount = amount;
    expense.category = category;
    expense.date = date;

    try {
        saveExpenses();
    } catch (error) {
        // Restore the previous values if saving fails.
        Object.assign(expense, originalValues);

        alert("Unable to save your changes. Please try again.");
        return;
    }

    closeEditModal();
    displayExpenses();
});


// Close the Edit Expense modal
function closeEditModal() {
    editExpenseModal.hidden = true;
    editingExpenseIndex = null;
    editExpenseForm.reset();
}

cancelEditButton.addEventListener("click", closeEditModal);

editExpenseModal.addEventListener("click", function (event) {
    if (event.target === editExpenseModal) {
        closeEditModal();
    }
});


// Delete an expense
function deleteExpense(index) {
    if (index < 0 || index >= expenses.length) {
        return;
    }

    const deletedExpense = expenses.splice(index, 1)[0];

    try {
        saveExpenses();
    } catch (error) {
        expenses.splice(index, 0, deletedExpense);
        alert("Unable to delete the expense. Please try again.");
        return;
    }

    displayExpenses();
}


// Restore the last section viewed after a page refresh
const addSection = document.getElementById("addExpenseSection");
const recordsSection = document.getElementById("expensesSection");

const savedSection = localStorage.getItem("activeSection");

if (savedSection === "expenses") {
    addSection.hidden = true;
    recordsSection.hidden = false;
} else {
    addSection.hidden = false;
    recordsSection.hidden = true;
}


// Show the Add Expense section
document.getElementById("showAddSection").addEventListener("click", function () {
    recordsSection.hidden = true;
    addSection.hidden = false;

    localStorage.setItem("activeSection", "add");
});


// Show the My Expenses section
document.getElementById("showExpensesSection").addEventListener("click", function () {
    addSection.hidden = true;
    recordsSection.hidden = false;

    localStorage.setItem("activeSection", "expenses");

    displayExpenses();
});


// Success modal: View Expenses
viewExpensesButton.addEventListener("click", function () {
    successModal.hidden = true;

    addSection.hidden = true;
    recordsSection.hidden = false;

    localStorage.setItem("activeSection", "expenses");

    displayExpenses();
});


// Success modal: Add Another Expense
addAnotherButton.addEventListener("click", function () {
    successModal.hidden = true;
    descriptionInput.focus();
});


// About Developer modal
const aboutModal = document.getElementById("aboutModal");
const showAboutButton = document.getElementById("showAboutButton");
const aboutCloseButton = document.getElementById("aboutCloseButton");

showAboutButton.addEventListener("click", function () {
    aboutModal.hidden = false;
    aboutCloseButton.focus();
});

aboutCloseButton.addEventListener("click", function () {
    aboutModal.hidden = true;
    showAboutButton.focus();
});

aboutModal.addEventListener("click", function (event) {
    if (event.target === aboutModal) {
        aboutModal.hidden = true;
        showAboutButton.focus();
    }
});


// Escape closes open modals
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        if (!editExpenseModal.hidden) {
            closeEditModal();
        } else if (!aboutModal.hidden) {
            aboutModal.hidden = true;
            showAboutButton.focus();
        }
    }
});


// Display the existing records on startup
displayExpenses();
