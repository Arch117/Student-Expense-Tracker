const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const addExpenseButton = document.getElementById("addExpense");

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

    console.log(expense);
});