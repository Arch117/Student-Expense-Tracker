const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

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

    expenses.forEach(function (expense, index) {

        total += Number(expense.amount);

        const expenseElement = document.createElement("div");

        expenseElement.innerHTML = `
            <p>
                <strong>${expense.description}</strong>
                - KES ${expense.amount}
                - ${expense.category}
                - ${expense.date}

                <button onclick="deleteExpense(${index})">Delete</button>
            </p>
        `;

        expensesContainer.appendChild(expenseElement);

    });

    totalAmountElement.textContent = total;

}

displayExpenses();

function deleteExpense(index) {

    expenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();

}