
//function to create a six digit hexadecimal number
function getRandomColor(){
    let hexadecimalCharacters = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"]
    output = "#"
    for (let i = 0; i < 6; i++){
        let randomNum = Math.floor(Math.random() * 16)
        output += hexadecimalCharacters[randomNum]
    }
    return output
}


let changeColorButton = document.getElementById("change-color-btn")

let colorBox = document.getElementById("color-box")
changeColorButton.addEventListener("click", function(){
    let colorValue = getRandomColor()
    colorBox.style.backgroundColor = colorValue

})