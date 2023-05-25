const newInstructStep = document.getElementById('new-instructions')
const addStepButton = document.getElementById('another-step')
const newIngredients = document.getElementById('new-ingredients')
const anotherIngredButton = document.getElementById('another-ingredient')
const submitRecipe = document.getElementById('submit-recipe')

anotherIngredButton.addEventListener('click', (e) => {
    e.preventDefault()

    let newNameLabel = document.createElement('label')
    let newNameInput = document.createElement('input')
    let newQuantityLabel = document.createElement('label')
    let newQuantityInput = document.createElement('input')
    let newUnitsLabel = document.createElement('label')
    let newUnitsInput = document.createElement('input')
    let newDescriptorLabel = document.createElement('label')
    let newDescriptorInput = document.createElement('input')

    newNameInput.classList.add('new-ingredient-name')
    newNameLabel.innerHTML = 'Ingredient Name: '
    newNameLabel.appendChild(newNameInput)
    newIngredients.appendChild(newNameLabel)
    
    newQuantityInput.classList.add('new-ingredient-quantity')
    newQuantityLabel.innerHTML = 'Quantity: '
    newQuantityLabel.appendChild(newQuantityInput)
    newIngredients.appendChild(newQuantityLabel)
    
    newUnitsInput.classList.add('new-ingredient-units')
    newUnitsLabel.innerHTML = 'Units of Measurement: '
    newUnitsLabel.appendChild(newUnitsInput)
    newIngredients.appendChild(newUnitsLabel)
    
    newDescriptorInput.classList.add('new-ingredient-descriptor')
    newDescriptorLabel.innerHTML = 'Descriptor: '
    newDescriptorLabel.appendChild(newDescriptorInput)
    newIngredients.appendChild(newDescriptorLabel)

})

addStepButton.addEventListener('click', (e) => {
    e.preventDefault()

    let newStep = document.createElement('textarea')
    
    newStep.classList.add('new-recipe-step')
    newInstructStep.appendChild(newStep)
})

