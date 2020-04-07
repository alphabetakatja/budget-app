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

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, des, val) {
      let newItem, ID;

      // ID -> unique number that we want to give to each input value
      // [1, 2, 3, 4, 5], next ID = 6;
      // [1, 2, 4, 6, 8], next ID = 9;
      // ID = last ID + 1;
      // Create new id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      // Push it into our data structure
      data.allItems[type].push(newItem);
      // Return the new element
      return newItem;
    },
    testing: function() {
      console.log("data structure: ", data);
    }
  };
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
    let input, newItem;
    // 1. Get the field input data
    input = uiController.getInput();
    // console.log("input in appController: ", input);

    // 2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

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
