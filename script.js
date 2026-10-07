const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const addExpenseButton = document.getElementById("addExpense");

let expenses = [];

addExpenseButton.addEventListener("click", function () {

    const description = descriptionInput.value;
    const amount = amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    const expense = {
        description: description,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(expense);

    displayExpenses();

});

function displayExpenses() {

    const expensesContainer = document.getElementById("expenses");

    expensesContainer.innerHTML = "";

    expenses.forEach(function (expense) {

        const expenseElement = document.createElement("div");

        expenseElement.innerHTML = `
            <p>
                <strong>${expense.description}</strong>
                - KES ${expense.amount}
                - ${expense.category}
                - ${expense.date}
            </p>
        `;

        expensesContainer.appendChild(expenseElement);

    });

}