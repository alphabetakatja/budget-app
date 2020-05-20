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
    addItem: function(type, desc, val) {
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
        // ja bih ovdje stavila ID = 1;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === "exp") {
        newItem = new Expense(ID, desc, val);
      } else if (type === "inc") { 
        newItem = new Income(ID, desc, val);
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
let UIController = (function() {
  let DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      let html, newHtml, element;
      // 1. Create HTML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          `<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          `<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }

      // 2. Replace placeholder text with actual data we receive from the obj
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // 3. Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    clearInputFields: function() {
      let fields, fieldsArray;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);
      
      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, arr)  {
        current.value = '';
      });
      // Set the focus on the first element of the array
      fieldsArray[0].focus();

    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
let appController = (function(budgetCtrl, UICtrl) {

  let setUpEventListeners = function() {
    let DOM = UICtrl.getDOMstrings();

    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      // some old browsers use the 'which' property
      if (event.keyCode === 13 || event.which === 13) { 
        ctrlAddItem();
      }
    });
  };

  let updateBudget = function() {

    // 1. Calculate the budget

    // 2. Return the budget

    // 3. Display the budget on the UI

  };

  let ctrlAddItem = function() {
    let input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();

    // 2. Add the new item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the new item to the UI
    UICtrl.addListItem(newItem, input.type);

    // 4. Clear Input fields
    UICtrl.clearInputFields();

    // 5. Calculate & update the budget
    updateBudget();

  };

  return {
    init: function() {
      console.log("Application has started!");
      setUpEventListeners();
    }
  };
})(budgetController, UIController);

appController.init();
