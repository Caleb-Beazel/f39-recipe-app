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
    // console.dir(recipes)
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

            
            const recipeNameEl = document.createElement('h3')
            const instructionsEl = document.createElement('p')
            const cookTimeEl = document.createElement('p')
            const image = document.createElement('img')
            const ingDiv = document.createElement('div')
            const deleteButton = document.createElement('button')

            recipeNameEl.textContent = recipeName
            instructionsEl.textContent = instructions
            cookTimeEl.textContent = (`Total Time: ${cookTime} minutes`)
            ingDiv.textContent = 'Ingredients'
            image.src = imageLink
            deleteButton.textContent = 'Delete Recipe'

            recipeCard.appendChild(image)
            recipeCard.appendChild(recipeNameEl)
            recipeCard.appendChild(cookTimeEl)
            recipeCard.appendChild(ingDiv)
            
            for (i of ingredients){
                const { ingredientName, quantity, unit, descriptor } = i

                const ingredEl = document.createElement('p')
                ingredEl.textContent = (`- ${quantity} ${unit} ${ingredientName} - ${descriptor}`)
                ingDiv.appendChild(ingredEl)
            }
            
            recipeCard.appendChild(instructionsEl)
            recipeCard.appendChild(deleteButton)

            recipesContainer.appendChild(recipeCard)

        }
}


getRecipes()