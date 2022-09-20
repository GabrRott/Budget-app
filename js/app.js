//variables and selectors
const form = document.querySelector('#agregar-gasto');
const expensesList = document.querySelector('#gastos ul');






//events

eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded', askQuotation);

    form.addEventListener('submit', addExpenses)
}





//classes
class Quotation{
    constructor(cash){
    this.cash = Number(cash); 
    this.rest = Number(cash);
    this.expenses = [];
    }

    newExpense(expense){
        this.expenses = [...this.expenses, expense];
        this.restCalculation();
    }
    restCalculation(){
        const totalExpenses = this.expenses.reduce((total, expense)=> total + expense.quantity, 0);
                this.rest = this.cash-totalExpenses;
    }
    eraseExpense(id){
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        console.log(this.expenses);
        this.restCalculation();
    }
} 

class UI{
    addQuotation(quantity){
        //extrating values
        const{cash,rest}= quantity;
        //adding on the HTML 
        document.querySelector('#total').textContent = cash;
        document.querySelector('#restante').textContent = rest;
    }
    printAlert(message, type){
        const div = document.createElement('div');
        div.classList.add('text-center', 'alert');

        if(type ==='error'){
            div.classList.add('alert-danger');
        }else{
            div.classList.add('alert-success')
        }

        //Error message;
        div.textContent = message;

        //Insert on HTML
        document.querySelector('.primario').insertBefore(div, form);

         setTimeout(() => {
             div.remove();
         }, 3000);

    }
    showExpensesList(expenses){

        this.cleanHTML(); //Erase previus info on screen

        //itering on expenses list
        expenses.forEach(expense => {
            const {quantity,name,id}= expense;

            //create LI
            const newExp = document.createElement('li');
            newExp.className='list-group-item d-flex justify-content-between align-items-center';
            newExp.dataset.id = id;
            //adding expense item on the html
            newExp.innerHTML= `${name} <span class="badge badge-primary badge-pill"> $ ${quantity} </span>`;
            //erase or eleminate expenses items
            const btnErase = document.createElement('button');
            btnErase.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnErase.innerHTML = 'Borrar &times;';
            console.log(this.expenses);
            btnErase.onclick = () =>{
                eraseExpense(id);
            }
            newExp.appendChild(btnErase);
            //adding on the html
            expensesList.appendChild(newExp);



        });
    }
    //clean html
    cleanHTML(){
        while (expensesList.firstChild){
            expensesList.removeChild(expensesList.firstChild);
        }

    }
    restActualization(rest){
        document.querySelector('#restante').textContent = rest;
    }
    validateMount(cashObj){
        const {cash, rest}= cashObj;
        const restDiv = document.querySelector('.restante');
        //pruve 25%
        if((cash/4)>rest){
            restDiv.classList.remove('alert-succes', 'alert-warning');
            restDiv.classList.add('alert-danger')
        }else if((cash/2)>rest){
            restDiv.classList.remove('alert-succes', 'alert-danger');
            restDiv.classList.add('alert-warning')
        }else if ((cash/2)<rest){
            restDiv.classList.remove('alert-warning', 'alert-danger');
            restDiv.classList.add('alert-succes')

        }

        if(rest<=0){
            ui.printAlert('El presupuesto se ha agotado', 'error');
            form.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//Instance
const ui = new UI();
let cash;



//funciones
function askQuotation(){
    const userQuotation = prompt('¿Cuál es tu prespuesto?');
    
    if(userQuotation ===''|| userQuotation === null || isNaN(userQuotation) || userQuotation<= 0){
        window.location.reload();
    }

    //Valid quotation
    cash = new Quotation(userQuotation);

    ui.addQuotation(cash);

}

function addExpenses(e){
    e.preventDefault();

    //Read form data
    const name = document.querySelector('#gasto').value;
    const quantity = Number(document.querySelector('#cantidad').value);

    //validation
    if(name ===''|| quantity ===''){
        ui.printAlert('Ambos campos son obligatorios', 'error')
    } else if (quantity <= 0 || isNaN(quantity)){
        ui.printAlert('cantidad no válida', 'error')
    }else{


    //create expense obj
    const expense = {name, quantity, id:Date.now()};


    //adding new expenses
    cash.newExpense(expense);

    //action completed ok
    ui.printAlert('Gastos agregado correctamente');

    //printing expenses on screen
    const{expenses, rest} = cash;
    ui.showExpensesList(expenses);
    ui.restActualization(rest);
    ui.validateMount(cash);

    //form reset
    form.reset();
    }
}

function eraseExpense(id){
    //eliminate obj from th class
    console.log(this.expenses);
    cash.eraseExpense(id);
    

    //elimintate obj from the html
    const{expenses, rest}=cash;
    ui.showExpensesList(expenses);
    ui.restActualization(rest);
    ui.validateMount(cash);
}