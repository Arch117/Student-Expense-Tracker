const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const filterCategory = document.getElementById("filterCategory");

const addExpenseButton = document.getElementById("addExpense");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

addExpenseButton.addEventListener("click", function () {

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if (description === "") {
        alert("Please enter a description.");
        return;
    }

    if (amount <= 0) {
        alert("Please enter an amount greater than 0.");
        return;
    }

    if (category === "") {
        alert("Please select a category.");
        return;
    }

    if (date === "") {
        alert("Please select a valid date.");
        return;
    }

    const selectedDate = new Date(date + "T00:00:00");


    if (date < "1900-01-01" || date > "2100-12-31") {
        alert("Please select a date between 1900 and 2100.");
        return;
    }

    const expense = {
        description: description,
        amount: amount,
        category: category,
        date: date
    };

    try {
        expenses.push(expense);

        localStorage.setItem("expenses", JSON.stringify(expenses));

        displayExpenses();

        alert("Expense recorded successfully! 🎉");

        descriptionInput.value = "";
        amountInput.value = "";
        categoryInput.value = "";
        dateInput.value = "";

    } catch (error) {
        expenses.pop();
        alert("Unable to save the expense. Please try again.");
    }

});


function displayExpenses() {
    const expensesContainer = document.getElementById("expenses");
    const totalAmountElement = document.getElementById("totalAmount");
    const expenseCountElement = document.getElementById("expenseCount");
    const emptyMessage = document.getElementById("emptyMessage");

    expensesContainer.innerHTML = "";

    const selectedCategory = filterCategory.value;

    const filteredExpenses = selectedCategory === "All"
        ? expenses
        : expenses.filter(function (expense) {
            return expense.category === selectedCategory;
        });

    let total = 0;

    filteredExpenses.forEach(function (expense) {
        total += Number(expense.amount);

        const row = document.createElement("tr");

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
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function () {
            const actualIndex = expenses.indexOf(expense);
            deleteExpense(actualIndex);
        });

        actionCell.appendChild(deleteButton);

        row.append(
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
        filteredExpenses.length + (
            filteredExpenses.length === 1 ? " expense" : " expenses"
        );

    emptyMessage.hidden = filteredExpenses.length !== 0;
}

displayExpenses();

filterCategory.addEventListener("change", displayExpenses);

function deleteExpense(index) {

    expenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();

}


const addSection = document.getElementById("addExpenseSection");
const recordsSection = document.getElementById("expensesSection");

document.getElementById("showAddSection").addEventListener("click", function () {
    recordsSection.hidden = true;
    addSection.hidden = false;
});

document.getElementById("showExpensesSection").addEventListener("click", function () {
    addSection.hidden = true;
    recordsSection.hidden = false;
    displayExpenses();
});
