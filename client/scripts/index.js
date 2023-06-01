const recipesContainer = document.getElementById('recipes-container')

/*Gets all recipes in the database. Should at some point return
data according to available ingredients */
const getRecipes = () => {

    axios.get('/recipes')
    .then(res => {   
        createRecipeCard(res.data)
    })
    .catch(err => console.log(err))
}

function createRecipeCard(recipes) {

    const mapOfRecipes = recipes.reduce((acc, curr) => {
        const recipeId = curr.recipe_id

        if (!acc[recipeId]){
            acc[recipeId] = {
                recipeId: recipeId,
                recipeName: curr.recipe_name,
                cookTime: curr.cook_time,
                instructions: curr.instructions,
                imageLink: curr.image_link,
                ingredients: [{
                        ingredientName: curr.ingredient_name,
                        quantity: curr.quantity,
                        unit: curr.unit,
                        descriptor: curr.descriptor
                    }]
            }
        } else if (acc[recipeId]) {
            acc[recipeId].ingredients.push({
                ingredientName: curr.ingredient_name,
                quantity: curr.quantity,
                unit: curr.unit,
                descriptor: curr.descriptor
            })
        }
        return acc
    }, {})

    const recipeArr = Object.keys(mapOfRecipes).map(key => mapOfRecipes[key])

        
        for (let recipe of recipeArr){
            
            const { recipeId, recipeName, imageLink, instructions, cookTime, ingredients } = recipe
            
            const recipeCard = document.createElement('div')
            recipeCard.classList.add('recipe-card')

            
            const recipeNameEl = document.createElement('h2')
            const instructionsTitle = document.createElement('h3')
            const instructionsEl = document.createElement('p')
            const cookTimeEl = document.createElement('p')
            const image = document.createElement('img')
            const ingDiv = document.createElement('div')
            const ingH3 = document.createElement('h3')
            const deleteButton = document.createElement('button')

            recipeNameEl.textContent = recipeName
            recipeNameEl.classList.add('recipe-name')
            instructionsTitle.textContent = 'Instructions'
            instructionsEl.textContent = instructions
            instructionsEl.classList.add('instructions')
            cookTimeEl.textContent = (`Total Time: ${cookTime} minutes`)
            cookTimeEl.classList.add('cook-time')
            ingDiv.appendChild(ingH3)
            ingH3.textContent = 'Ingredients'
            ingDiv.classList.add('ingredient-box')
            image.src = imageLink
            image.classList.add('recipe-images')
            deleteButton.textContent = 'Delete Recipe'
            deleteButton.classList.add('delete-button')
            deleteButton.onclick = () => {
                axios.delete(`/recipes/${recipeId}`)
                .then(() => {
                    getRecipes()
                    recipesContainer.innerHTML = ''
                })
                .catch(err => console.log(err))
            }

            recipeCard.appendChild(recipeNameEl)
            recipeCard.appendChild(image)
            recipeCard.appendChild(cookTimeEl)
            recipeCard.appendChild(ingDiv)
            
            for (i of ingredients){
                const { ingredientName, quantity, unit, descriptor } = i

                const ingredEl = document.createElement('p')
                ingredEl.textContent = (`- ${quantity} ${unit} ${ingredientName} - ${descriptor}`)
                ingredEl.classList.add('ingredients')
                ingDiv.appendChild(ingredEl)
            }
            
            recipeCard.appendChild(instructionsTitle)
            recipeCard.appendChild(instructionsEl)
            recipeCard.appendChild(deleteButton)

            recipesContainer.appendChild(recipeCard)

        }
}

getRecipes()