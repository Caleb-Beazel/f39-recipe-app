const recipesContainer = document.getElementById('recipes-container')

/*Gets all recipes in the database. Should at some point return
data according to available ingredients */
const getRecipes = () => {
    axios.get('/recipes')
    .then(res => {
        // console.log(res.data)
        createRecipeCard(res.data)
    })
}

function createRecipeCard(recipes) {
    
    const mapOfRecipes = recipes.reduce((acc, curr) => {
        const recipeId = curr.recipe_id
        if (!acc[recipeId] && (!null || !undefined)){
            acc[recipeId] = {
                recipeId: recipeId,
                recipeName: curr.recipe_name,
                cookTime: curr.cook_time,
                instructions: curr.instructions,
                ingredients: [{
                        ingredientName: curr.ingredient_name,
                        quantity: curr.quantity,
                        unit: curr.unit,
                        descriptor: curr.descriptor
                    }]
            }
        } else if (acc[recipeId] && (!null || !undefined) ) {
            acc[recipeId].ingredients.push({
                ingredientName: curr.ingredient_name,
                quantity: curr.quantity,
                unit: curr.unit,
                descriptor: curr.descriptor
            })
        }
    }, {})

    const recipeArr = Object.keys(mapOfRecipes).map(key => mapOfRecipes[key])

    console.dir(recipeArr)
        
        // const recipeCard = document.createElement('div')
        // const { recipeName, } = recipe
        // recipeCard.classList.add('recipe-card') 
        
        // recipesContainer.appendChild(recipeCard)


    // recipeCard.innerHTML = `<img alt='recipe img' src=${movie.imageURL} class="recipe-img"/>
    // <p class="recipe-name">${movie.title}</p>
    // <div class="btns-container">
    //     <button onclick="updateMovie(${movie.id}, 'minus')">-</button>
    //     <p class="movie-rating">${movie.rating} stars</p>
    //     <button onclick="updateMovie(${movie.id}, 'plus')">+</button>
    // </div>
    // <button onclick="deleteMovie(${movie.id})">delete</button>
    // `


}

getRecipes()