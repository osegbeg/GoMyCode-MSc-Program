
//the behaviour of the like button. Turns red when clicked and vice-versa
let hearts = document.querySelectorAll(".fa-heart");
hearts.forEach(function(heart){
    heart.addEventListener("click", function(){
        if (this.style.color === "red"){
            this.style.color = "";
        }
        else {
            this.style.color = "red";
        }
    })
})


let plusButtons = document.querySelectorAll(".fa-plus-circle")
let minusButtons = document.querySelectorAll(".fa-minus-circle")

//added behaviour for the plus button
plusButtons.forEach(function(plusButton){
    plusButton.addEventListener("click", function(){
        
        let quantityText = plusButton.parentElement.querySelector(".quantity")
        let counter = Number(quantityText.innerHTML)
        counter++
        quantityText.innerHTML = counter
        totalAmount()

    })
})

//added behaviour for the minus button.
minusButtons.forEach(function(minusButton){
    minusButton.addEventListener("click", function(){
        let quantityText = minusButton.parentElement.querySelector(".quantity")
        let counter = Number(quantityText.innerHTML)
        
        
        if (counter >= 1){
            counter--            
        }
        quantityText.innerHTML = counter
        totalAmount()
    })
})

//the behaviour of the delete button. resets the counter to 0
let trashButtons = document.querySelectorAll(".fa-trash-alt")
trashButtons.forEach(function(trashButton){
    trashButton.addEventListener("click", function(){
        let quantityText = trashButton.parentElement.previousElementSibling.querySelector(".quantity")
        quantityText.innerHTML = 0
        totalAmount()
   
    })
})

//function to calculate the total amount for checkout
function totalAmount(){
    let total = 0
    let container = document.querySelectorAll(".card")
    container.forEach(function(piece){
        let quantity = piece.querySelector(".quantity")
        let quantityText = quantity.innerHTML
        let quantityNumber = Number(quantityText)
        let price = piece.querySelector(".unit-price")
        let priceStr = price.innerHTML
        let unitPrice = Number(priceStr.slice(0,-1).trim())
        let productAmount = unitPrice * quantityNumber
        total += productAmount
        totalSelector = document.querySelector(".total")
        totalSelector.innerHTML = `${total} $`


    })
}