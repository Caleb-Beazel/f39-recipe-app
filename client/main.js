

const newInstructStep = document.getElementById('new-instructions')
const addStepButton = document.getElementById('another-step')
const newIngredients = document.getElementById('new-ingredients')
const anotherIngredButton = document.getElementById('another-ingredient')
const newRecipeForm = document.getElementById('new-recipe')
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

newRecipeForm.addEventListener('submit',(e) => {
    e.preventDefault()

    let newRecipe = {}

    newRecipe.recipeName = document.querySelector('#new-recipe-name').value
    newRecipe.cookTime = document.querySelector('#new-recipe-cooktime').value
    newRecipe.instructions = []
    newRecipe.imageLink = document.querySelector('#new-recipe-image').value
    newRecipe.ingredients = []

    let tempInstructs = document.querySelectorAll('.new-recipe-step')

    for (i = 0; i < tempInstructs.length; i++){
        let stepFormat = `Step ${i+1}: ${tempInstructs[i].value}`
        newRecipe.instructions.push(stepFormat) 
    }
    newRecipe.instructions = newRecipe.instructions.join('\n\n')


    let tempIngredName = document.querySelectorAll('.new-ingredient-name')
    let tempIngredQuantity = document.querySelectorAll('.new-ingredient-quantity')
    let tempIngredUnit = document.querySelectorAll('.new-ingredient-units')
    let tempIngredDescriptor = document.querySelectorAll('.new-ingredient-descriptor')
    
    for(i = 0; i < tempIngredName.length; i++){
        newRecipe.ingredients.push({
            ingredientName: tempIngredName[i].value,
            quantity: tempIngredQuantity[i].value,
            unit: tempIngredUnit[i].value,
            descriptor: tempIngredDescriptor[i].value
        })
    }
    console.log(newRecipe)
    console.log(newRecipe.instructions)
    
    axios.post('http://localhost:7766/recipes', newRecipe)
    .then(res => {
        let submitBox = document.getElementById('submitted-text')
        submitBox.innerHTML = "Your recipe has been added!"
    })
    .catch(err => console.log(err))
})
