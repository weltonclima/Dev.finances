const Modal = {
  open() {
    document.querySelector('.modal-overlay')
      .classList.add('active')
  },
  close() {
    document.querySelector('.modal-overlay')
      .classList.remove('active')
    Form.clearFields()
  }
}

const Users = {
  getURL() {
    let params = window.location.search.substring(1).split('&');
    let param = params[0].split('=');
    return param[1]
  },
  logout() {
    window.location.replace('../index.html')
  }
}


const Visible = {
  value() {
    const tagArray = ['incomeDisplay', 'expenseDisplay', 'totalDisplay']
    for (let property in tagArray) {
      let hidden = document.querySelector(`#${tagArray[property]}`)
      hidden.classList.toggle('active')

      document.querySelector(`#div-${tagArray[property]}`)
        .classList.toggle('active')
    }

    const eye = document.querySelector('.icon-eye')
      .classList.contains('active')
    if (eye.valueOf()) {
      let active = document.querySelector('.icon-eye')
      active.setAttribute('src', '../assets/eye-visible.svg')
      active.classList.remove('active')
      Visible.tabvisible('setAttribute')
    } else {
      let active = document.querySelector('.icon-eye')
      active.setAttribute('src', '../assets/eye-hidden.svg')
      active.classList.add('active')
      Visible.tabvisible('removeAttribute')
    }
  },
  tabvisible(params) {
    const tabArray = ['description', 'amount', 'date', 'remove', 'edit']
    const idUser = Users.getURL()
    for (let key in tabArray) {
      let get = 0
      Transaction.all.forEach(i => {
        if(idUser == i.idUser){
          const hidden = document.querySelector(`.${tabArray[key]}-${get}`)
        const hiddenAtributes = ['style', 'visibility: hidden']
        if (params == 'setAttribute') {
          hidden.setAttribute(hiddenAtributes[0], hiddenAtributes[1])
        } else {
          hidden.removeAttribute(hiddenAtributes[0], hiddenAtributes[1])
        }
        }
        get++

      })
    }
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },
  set(transactions) {
    localStorage.setItem("dev.finances:transactions", JSON.
      stringify(transactions))
  }
}

const Transaction = {
  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },
  remove(index) {
    const transaction = document.querySelector(`.remove-${index}`)
      .classList.contains('active')
    if (!transaction.valueOf()) {
      let counter = 0
      const timer = setInterval(function () {
        if (counter >= 1000) {
          remove.setAttribute('src', '../assets/minus.svg')
          remove.classList.remove('active')
          clearInterval(timer)
        }
        counter++
      })
      let remove = document.querySelector(`.remove-${index}`)
      remove.setAttribute('src', '../assets/confirme.svg')
      remove.classList.add('active')
    } else {
      const status = document.querySelector(`.remove-${index}`)
        .classList.contains('active')
      if (status.valueOf()) {
        Transaction.all.splice(index, 1)
        App.reload()
      }
    }
  },
  edit(index, transaction) {
    Modal.open();

    const descriptionText = Transaction.all[index].description
    const amountText = Transaction.all[index].amount
    const dateText = Transaction.all[index].date

    document.getElementById("description").value = descriptionText
    document.getElementById("amount").value = Utils.reFormatAmount(amountText)
    document.getElementById("date").value = Utils.reFormatDate(dateText)

    var el = document.getElementById("saveBtn");

    el.onclick = function () {
      Transaction.all.splice(index, 1);
    }
  },
  incomes() {
    let income = 0
    const idUser = Users.getURL()
    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0 && transaction.idUser == idUser) {
        income += transaction.amount;
      }
    })
    return income
  },
  expenses() {
    let expense = 0;
    const idUser = Users.getURL()
    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0 && transaction.idUser == idUser) {
        expense += transaction.amount;
      }
    })
    return expense
  },
  total() {
    return Transaction.incomes() + Transaction.expenses()
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const idUser = Users.getURL()
    if (idUser == transaction.idUser) {
      const tr = document.createElement('tr')
      tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
      tr.dataset.index = index
      DOM.transactionsContainer.appendChild(tr)
    }
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense"
    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
      <td class="description">
        <div class="div-description-${index}">
          <p class="description-${index}">${transaction.description}</p>
        </div>
      </td>
      <td class="${CSSclass} amount">
        <div class="div-amount-${index}">
          <p class="amount-${index}">${amount}</p>
        </div>
      </td>
      <td class="date">
        <div class="div-date-${index}">
          <p class="date-${index}">${transaction.date}</p>
        </div>
      </td>
      <td class="icon">
        <div class="div-remove-${index}">
          <img class="remove-${index}" 
                id="remove" 
                onclick="Transaction.remove(${index})" 
                src="../assets/minus.svg" 
                alt="Remover transação">
        </div>
        <div class="div-edit-${index}">
          <img class="edit-${index}"
                id="edit"
                onclick="Transaction.edit(${index})"
                src="../assets/edit.svg" 
                alt="editar transação"/>
        </div>
      </td>
    `
    return html
  },

  updateBalance() {
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },
  clearTransaction() {
    DOM.transactionsContainer.innerHTML = ""
  }
}

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "")
    value = Number(value) / 100
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })
    return signal + value
  },
  formatAmount(value) {
    value = value * 100
    let round = String(value).split(".")
    return Number(round[0])
  },
  reFormatAmount(value) {

    value = Number(value) / 100
    return value
  },
  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
  reFormatDate(date) {
    const splittedDate = date.split("/")
    return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),
  getValues() {
    return {
      idUser: Users.getURL.value,
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },
  validateFields() {
    const { description, amount, date } = Form.getValues()
    if (description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos")
    }
  },
  formatValues() {
    let { idUser, description, amount, date } = Form.getValues()
    idUser = Users.getURL()
    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)
    return {
      idUser,
      description,
      amount,
      date
    }
  },
  clearFields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
  submit(event) {
    event.preventDefault()
    try {
      Form.validateFields()
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      Form.clearFields()
      Modal.close()
      App.reload()
    } catch (error) {
      alert(error.message)
    }
  }
}
const Tema = {
  darkTheme() {
    const html = document.querySelector("html")
    const checkbox = document.querySelector("input[name=theme]")


    const getStyle = (element, style) =>
      window
        .getComputedStyle(element)
        .getPropertyValue(style)


    const initialColors = {

      darkBlue: getStyle(html, "--dark-blue"),
      green: getStyle(html, "--green"),
      lightGreen: getStyle(html, "--light-green"),
      darkClaro: getStyle(html, " --dark-claro"),
    }

    const darkMode = {
      green: "#49AA26",
      lightGreen: "#2D4A22",
      darkClaro: "#f0f2f5"
    }

    const transformKey = key =>
      "--" + key.replace(/([A-Z])/, "-$1").toLowerCase()


    const changeColors = (colors) => {
      Object.keys(colors).map(key =>
        html.style.setProperty(transformKey(key), colors[key])
      )
    }


    checkbox.addEventListener("change", ({ target }) => {
      target.checked ? changeColors(darkMode) : changeColors(initialColors)
    })

    const isExistLocalStorage = (key) =>
      localStorage.getItem(key) != null

    const createOrEditLocalStorage = (key, value) =>
      localStorage.setItem(key, JSON.stringify(value))

    const getValeuLocalStorage = (key) =>
      JSON.parse(localStorage.getItem(key))

    checkbox.addEventListener("change", ({ target }) => {
      if (target.checked) {
        changeColors(darkMode)
        createOrEditLocalStorage('modo', 'darkMode')
      } else {
        changeColors(initialColors)
        createOrEditLocalStorage('modo', 'initialColors')
      }
    })

    if (!isExistLocalStorage('modo'))
      createOrEditLocalStorage('modo', 'initialColors')


    if (getValeuLocalStorage('modo') === "initialColors") {
      checkbox.removeAttribute('checked')
      changeColors(initialColors);
    } else {
      checkbox.setAttribute('checked', "")
      changeColors(darkMode);
    }
  }
}

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction)
    DOM.updateBalance()
    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransaction()
    App.init()
  }
}

App.init()
Tema.darkTheme()
