const Modal = {
  openLogin() {
    document.querySelector('.modal-overlay.login')
      .classList.add('active')
    Utils.returnInput('#div-loginAccess',
      '.input-group.loginAccess')

    Utils.returnInput('#div-passwordLogin',
      '.input-group.passwordLogin')
  },
  closeLogin() {
    document.querySelector('.modal-overlay.login')
      .classList.remove('active')
  },
  openCadastro() {
    document.querySelector('.modal-overlay.cadastro')
      .classList.add('active')
    Modal.closeLogin()
    FormLogin.cleanField()
    const ret = FormRegister.getValues()
    for (const key in ret) {
      Utils.returnInput(`#div-${key}`,
        `.input-group.${key}`)
    }
  },
  closeCadastro() {
    document.querySelector('.modal-overlay.cadastro')
      .classList.remove('active')
    Modal.openLogin()
    FormRegister.clearFields()
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:authentications")) || []
  },
  set(authentications) {
    localStorage.setItem("dev.finances:authentications", JSON.
      stringify(authentications))
  }
}

const Authentication = {
  all: Storage.get(),

  add(authentication) {
    Authentication.all.push(authentication)
    App.reload()
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
  },
  returnInput(divName, divGroup, innerHTML, Boolean) {
    const classValue = divName.split('-')
    if (Boolean == true) {
      const span = document.createElement('span')
      span.setAttribute('class', `${classValue[1]} ms-Icon ms-Icon--Error`)
      span.setAttribute('style', 'color: red;')

      const retSpan = document.querySelector(`${divName}`)
        .classList.contains('active')

      if (!retSpan.valueOf()) {
        const div = document.querySelector(`${divName}`)
        div.classList.add('active')
        div.setAttribute('style', 'border: 1px solid red;')
        div.appendChild(span)
      }
      const txtErro = document.createElement('small')
      txtErro.setAttribute('class', `${classValue[1]} small-erro`)
      txtErro.innerHTML = innerHTML
      txtErro.setAttribute('style', 'color: red;')

      const resSmall = document.querySelector(`${divGroup}`)
        .classList.contains('active')

      if (!resSmall.valueOf()) {
        const group = document.querySelector(`${divGroup}`)
        group.classList.add('active')
        group.appendChild(txtErro)
      } else {
        document.querySelector(`.${classValue[1]}.small-erro`)
          .remove()

        const group = document.querySelector(`${divGroup}`)
        group.appendChild(txtErro)
      }
    } else {
      const div = document.querySelector(`${divName}`)
        .classList.contains('active')

      if (div.valueOf()) {
        document.querySelector(`.${classValue[1]}.ms-Icon.ms-Icon--Error`)
          .remove()
        const div = document.querySelector(`${divName}`)
        div.classList.remove('active')
        div.removeAttribute('style', 'border: 1px solid red;')
      }
      const group = document.querySelector(`${divGroup}`)
        .classList.contains('active')

      if (group.valueOf()) {
        document.querySelector(`.${classValue[1]}.small-erro`)
          .remove()

        document.querySelector(`${divGroup}`)
          .classList.remove('active')
      }
    }
  }
}

const FormRegister = {
  nome: document.querySelector('input#nome'),
  dataNascimento: document.querySelector('input#dataNascimento'),
  email: document.querySelector('input#email'),
  login: document.querySelector('input#login'),
  password: document.querySelector('input#password'),
  passwordTwo: document.querySelector('input#passwordTwo'),
  getValues() {
    return {
      nome: FormRegister.nome.value,
      dataNascimento: FormRegister.dataNascimento.value,
      email: FormRegister.email.value,
      login: FormRegister.login.value,
      password: FormRegister.password.value,
      passwordTwo: FormRegister.passwordTwo.value
    }
  },
  nameField() {
    const { nome } = FormRegister.getValues();
    let regex = /[^a-z A-Z ZéúíóáÉÚÍÓÁèùìòàçÇÈÙÌÒÀõãñÕÃÑêûîôâÊÛÎÔÂëÿüïöäËYÜÏÖÄ\-\ \s]+/g
    let result = regex.test(nome)

    if (nome == "") {
      return false
    } else if (result) {
      Utils.returnInput('#div-nome',
        '.input-group.nome',
        'Digite somente letras',
        true)
      return false
    } else {
      Utils.returnInput('#div-nome', '.input-group.nome')
      return true
    }
  },
  birthDateField() {
    const { dataNascimento } = FormRegister.getValues();
    const dateFormat = dataNascimento.split('-')

    const today = new Date()
    const birth = new Date(`${dateFormat[1]} ${dateFormat[2]} ${dateFormat[0]}`)

    let year = today.getFullYear() - birth.getFullYear();
    let month = today.getMonth() - birth.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
      year--;
    }

    if (dataNascimento == "") {
      return false
    } else if (year < 18) {
      Utils.returnInput('#div-dataNascimento',
        '.input-group.dataNascimento',
        'Cadastro autorizado para maiores de 18 anos',
        true)
      return false
    } else {
      Utils.returnInput('#div-dataNascimento',
        '.input-group.dataNascimento')
      return true
    }
  },
  emailField() {
    const { email } = FormRegister.getValues();
    const auth = Storage.get()

    let regex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/g
    let result = regex.test(email)
    if (!result && email != "") {
      Utils.returnInput('#div-email',
        '.input-group.email',
        'Email invalido',
        true)
      return false
    } else if (email != "") {
      if (auth.length > 0) {
        for (const key in auth) {
          if (auth[key].email == email) {
            Utils.returnInput('#div-email',
              '.input-group.email',
              'Email já cadastrado',
              true)
            return false
          } else if (auth[key].email != email && key == (auth.length - 1)) {
            Utils.returnInput('#div-email',
              '.input-group.email')
            return true
          }
        }
      } else {
        Utils.returnInput('#div-email',
          '.input-group.email')
        return true
      }
    } else {
      return false
    }
  },
  loginField() {
    const { login } = FormRegister.getValues();
    const auth = Storage.get().valueOf()

    if (login != "") {
      if (auth.length > 0) {
        for (const key in auth) {
          if (auth[key].login == login) {

            Utils.returnInput('#div-login',
              '.input-group.login',
              'Login já cadastro',
              true)
            return false
          } else if (auth[key].login != login && key == (auth.length - 1)) {
            Utils.returnInput('#div-login',
              '.input-group.login')
            return true
          }
        }
      } else {
        Utils.returnInput('#div-login',
          '.input-group.login')
        return true
      }
    } else {
      return false
    }
  },
  passwordField() {
    const { password, passwordTwo } = FormRegister.getValues();

    const anUpperCase = /[A-Z]/;
    const aLowerCase = /[a-z]/;
    const aNumber = /[0-9]/;
    const aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;

    if (password.length < 8 && password != "") {
      Utils.returnInput('#div-password',
        '.input-group.password',
        'Senha menor que 8 caracteres',
        true)
      return false
    } else if (password == "") {
      return false
    } else {
      let numUpper = 0;
      let numLower = 0;
      let numNums = 0;
      let numSpecials = 0;
      for (let i = 0; i < password.length; i++) {
        if (anUpperCase.test(password[i]))
          numUpper++;
        else if (aLowerCase.test(password[i]))
          numLower++;
        else if (aNumber.test(password[i]))
          numNums++;
        else if (aSpecial.test(password[i]))
          numSpecials++;
      }

      if (!(numUpper >= 1 && numLower >= 0 && numNums >= 1 && numSpecials >= 1)) {
        Utils.returnInput('#div-password',
          '.input-group.password',
          'Senha fora do padrão: <br>1 letra Maiúscula, <br>1 número, <br>1 caracter especial',
          true)
        return false
      } else if (password != passwordTwo && passwordTwo != "") {
        Utils.returnInput('#div-password',
          '.input-group.password',
          'As senhas estão diferentes',
          true)
        return false
      } else {
        Utils.returnInput('#div-password',
          '.input-group.password')

        Utils.returnInput('#div-passwordTwo',
          '.input-group.passwordTwo')
        return true
      }
    }
  },
  passwordTwoField() {
    const { password, passwordTwo } = FormRegister.getValues();

    if (password == "") {
      return false
    } else if (password != passwordTwo) {
      Utils.returnInput('#div-passwordTwo',
        '.input-group.passwordTwo',
        'As senhas estão diferentes',
        true)
      return false
    } else {
      Utils.returnInput('#div-password',
        '.input-group.password')

      Utils.returnInput('#div-passwordTwo',
        '.input-group.passwordTwo')
      return true
    }
  },
  validateFields() {
    let result = -12
    const ret = FormRegister.getValues()

    for (const key in ret) {
      if (ret[key] == '') {
        Utils.returnInput(`#div-${key}`,
          `.input-group.${key}`,
          'Preencha o campo vazio',
          true)
        result--
      } else {
        Utils.returnInput(`#div-${key}`,
          `.input-group.${key}`)
        result++
      }
    }

    const name = FormRegister.nameField().valueOf() == true ? result++ : result--
    const birthDate = FormRegister.birthDateField().valueOf() == true ? result++ : result--
    const email = FormRegister.emailField().valueOf() == true ? result++ : result--
    const login = FormRegister.loginField().valueOf() == true ? result++ : result--
    const password = FormRegister.passwordField().valueOf() == true ? result++ : result--
    const passwordTwo = FormRegister.passwordTwoField().valueOf() == true ? result++ : result--

    if (result >= 0) {
      return true
    } else {
      return false
    }
  },
  formatValues() {
    let { nome,
      dataNascimento,
      email,
      login,
      password,
      passwordTwo } = FormRegister.getValues()
    dataNascimento = Utils.formatDate(dataNascimento)
    return {
      nome,
      dataNascimento,
      email,
      login,
      password,
      passwordTwo
    }
  },
  clearFields() {
    FormRegister.nome.value = ""
    FormRegister.dataNascimento.value = ""
    FormRegister.email.value = ""
    FormRegister.login.value = ""
    FormRegister.password.value = ""
    FormRegister.passwordTwo.value = ""
  },
  submitRegister(event) {
    event.preventDefault()
    try {
      const authentication = FormRegister.formatValues()
      const form = FormRegister.validateFields()

      if (form.valueOf()) {
        Authentication.add(authentication)

        Modal.closeCadastro()
        App.reload()
      }
    } catch (error) {
      alert(error.message)
    }
  }

}

const FormLogin = {
  login: document.querySelector('input#loginAccess'),
  password: document.querySelector('input#passwordLogin'),
  getValues() {
    return {
      login: FormLogin.login.value,
      password: FormLogin.password.value
    }
  },
  loginField() {
    const { login } = FormLogin.getValues()
    const auth = Storage.get()

    if (login != "" && auth.length > 0) {
      for (const key in auth) {
        if (auth[key].login == login) {
          Utils.returnInput('#div-loginAccess',
            '.input-group.loginAccess',
            'Usuário já cadastrado',
            true)
          return true
        } else if (auth[key].login != login && key == (auth.length - 1)) {
          Utils.returnInput('#div-loginAccess',
            '.input-group.loginAccess')
          return false
        }
      }
    }
  },
  cleanField() {
    FormLogin.login.value = ""
    FormLogin.password.value = ""
  },
  validateFields() {
    const { login, password } = FormLogin.getValues()
    const auth = Storage.get()

    if (login != "" && password != "") {
      for (const key in auth) {
        if (auth[key].login == login && auth[key].password == password) {
          window.location.replace('./app/index.html?id=' + key)
          Utils.returnInput('#div-loginAccess',
            '.input-group.loginAccess')

          Utils.returnInput('#div-passwordLogin',
            '.input-group.passwordLogin')
          return login
        }
      }
    }
    Utils.returnInput('#div-loginAccess',
      '.input-group.loginAccess',
      'Usuário ou senha está errado',
      true)

    Utils.returnInput('#div-passwordLogin',
      '.input-group.passwordLogin',
      '',
      true)
  },
  submitLogin(event) {
    event.preventDefault()
    try {
      FormLogin.validateFields()

    } catch (error) {
      alert(error.message)
    }
  },

}

const App = {
  init() {
    Storage.set(Authentication.all)
    Modal.openLogin()
  },
  reload() {
    App.init()

  }
}

App.init()