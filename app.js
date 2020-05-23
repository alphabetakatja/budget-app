// BUDGET CONTROLLER
let budgetController = (function() {

  // Data model for expenses and incomes
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(current) {
        sum += current.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, desc, val) {
      let newItem, ID;

      // ID -> unique number that we want to give to each input value
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
    deleteItem: function(type, id) {
      let ids, index;
      
      // We are creating a new array with all the ids of expenses and incomes 
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

    },
    calculateBudget: function() {

      // Calculate the total sum of income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentages: function() {
      //  a = 20, b = 10, c = 40; totalInc = 100;
      // percentage = (20 / 100) * 100;
      data.allItems.exp.forEach(function(current) {
        current.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function() {
      // we are creating a new array with all of the percentages in it
      let allPercentages = data.allItems.exp.map(function(current) {
      return current.getPercentage();
      });
      return allPercentages;

    },
    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
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
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  let formatNumber = function(num, type) {
    let numSplit, int, dec, sign;
    //  + or - before the number
    // exactly 2 decimal points
    // comma separating the thousands
    //  2420.4567 -> + 2,310.46

    num = Math.abs(num);
    // a method of the number prototype
    num = num.toFixed(2);
    // our num is now a string and we need to divide the num into 2 parts: the integer and the decimal part

    numSplit = num.split('.');
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
      // input 2310, output 2,310
    }
    
    dec = numSplit[1];

    type === 'exp' ? sign = '-' : sign = '+';

    return sign + ' ' + int + '.' + dec;

  };

  let nodeListForEach = function(list, callback) {
    // For loop that each time calls a callback function
    for (let i = 0; i < list.length; i++) {
      // we call the callback with the current item and the index as args
      callback(list[i], i);
    }
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
          `<div class="item clearfix" id="inc-%id%">
            <div class="item__description">%description%</div>
            <div class="right clearfix">
              <div class="item__value">%value%</div>
              <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
            </div>
          </div>`;
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          `<div class="item clearfix" id="exp-%id%">
            <div class="item__description">%description%</div>
            <div class="right clearfix">
              <div class="item__value">%value%</div>
              <div class="item__percentage"></div>
              <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
              </div>
            </div>
          </div>`;
      }

      // 2. Replace placeholder text with actual data we receive from the obj
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      // 3. Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },
    deleteListItem: function(selectorID) {
      let el = document.getElementById(selectorID);
      // removing item from DOM, we need to find its parent 
      el.parentNode.removeChild(el);
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
    displayBudget: function(obj) {

      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
    displayPercentages: function(percentages) {

      let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
      
      nodeListForEach(fields, function(current, index) {
        
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
        
      });

    },
    displayMonth: function() {
      let now, months, month, year;
      
      // it returns today's date
      now = new Date();

      year = now.getFullYear();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();

      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },
    changedType: function() {
      let fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue
        );

        nodeListForEach(fields, function(current) {
          current.classList.toggle('red-focus');
        });

        document.querySelector(DOMstrings.inputButton).classList.toggle('red');
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

    // Adding delete event
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  
    // Changing class of the 'exp' input type
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
  
  };

  let updateBudget = function() {

    // 1. Calculate the budget
    budgetCtrl.calculateBudget();

    // 2. Return the budget
    let budget = budgetCtrl.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  let updatePercentages = function() {

    // 1. Calculate the percentages
    budgetCtrl.calculatePercentages();

    // 2. Read them from the budget controller
    let percentages = budgetCtrl.getPercentages();

    // 3. Update the UI with new percentages
    UICtrl.displayPercentages(percentages);

  };

  let ctrlAddItem = function() {
    let input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the new item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Add the new item to the UI
    UICtrl.addListItem(newItem, input.type);

    // 4. Clear Input fields
    UICtrl.clearInputFields();

    // 5. Calculate & update the budget
    updateBudget();

    // 6. Calculate & update percentages
    updatePercentages();
    }
  };

  let ctrlDeleteItem = function(event) {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {

      // inc-1 it returns an array with the type and a number
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);

      // 2. Delete item from the UI
      UICtrl.deleteListItem(itemID);

      // 3. Update and show the new budget 
      updateBudget();

    }
  };

  return {
    init: function() {
      console.log("Application has started!");
      UICtrl.displayMonth();
      // Resetting the values of the budget object when page reloads
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setUpEventListeners();
    }
  };
})(budgetController, UIController);

appController.init();
