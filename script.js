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
        alert("Please select a date.");
        return;
    }

    const expense = {
        description: description,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(expense);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();

    descriptionInput.value = "";
    amountInput.value = "";
    categoryInput.value = "";
    dateInput.value = "";

});

function displayExpenses() {

    const expensesContainer = document.getElementById("expenses");
    const totalAmountElement = document.getElementById("totalAmount");

    expensesContainer.innerHTML = "";

    let total = 0;

    const filteredExpenses = filterCategory.value === "All"
        ? expenses
        : expenses.filter(function (expense) {
            return expense.category === filterCategory.value;
    });

    filteredExpenses.forEach(function (expense) {

        total += Number(expense.amount);

        const expenseElement = document.createElement("div");

        expenseElement.innerHTML = `
            <div class="expense-card">

                <div class="expense-info">

                    <h3>${expense.description}</h3>

                    <p>${expense.category}</p>

                    <small>${expense.date}</small>

                </div>

                <div class="expense-right">

                    <strong>KES ${expense.amount}</strong>

                    <button onclick="deleteExpense(${expenses.indexOf(expense)})">
                        Delete
                    </button>
                </div>

            </div>
        `;

        expensesContainer.appendChild(expenseElement);

    });

    totalAmountElement.textContent = total;

}

displayExpenses();

filterCategory.addEventListener("change", displayExpenses);

function deleteExpense(index) {

    expenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();

}