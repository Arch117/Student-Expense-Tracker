const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const addExpenseButton = document.getElementById("addExpense");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

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

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();

});

function displayExpenses() {

    const expensesContainer = document.getElementById("expenses");
    const totalAmountElement = document.getElementById("totalAmount");

    expensesContainer.innerHTML = "";

    let total = 0;

    expenses.forEach(function (expense) {

        total += Number(expense.amount);

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

    totalAmountElement.textContent = total;

}

displayExpenses();