// BUDGET CONTROLLER
let budgetController = (function() {
  // data model for expenses and incomes
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Expense.protoype.getExpense() = function() {
  //
  // }
})();

// UI CONTROLLER
let uiController = (function() {
  let DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
let appController = (function(budgetCtrl, uiCtrl) {
  let setUpEventListeners = function() {
    let DOM = uiController.getDOMstrings();

    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        // console.log("Enter was pressed!");
        ctrlAddItem();
      }
    });
  };

  let ctrlAddItem = function() {
    // 1. Get the field input data
    let input = uiController.getInput();
    // console.log("input in appController: ", input);

    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. Calculate the budget

    // 5. Display the budget on the UI
  };

  return {
    init: function() {
      console.log("Application has started!");
      setUpEventListeners();
    }
  };
})(budgetController, uiController);

appController.init();
