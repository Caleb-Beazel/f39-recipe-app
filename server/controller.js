require('dotenv').config()
const SHA256 = require('crypto-js/sha256')
const Sequelize = require('sequelize')
const {CONNECTION_STRING} = process.env

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    logging: false
})

//Generates unique string for hashing.

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
  
  // Function to generate a unique key. "randomize" is set to some integer value.

function generateUniqueKey(randomize) {
    const timestamp = new Date().getTime().toString();
    const randomString = generateRandomString(randomize);
    const key = SHA256(timestamp + randomString).toString();
    return key;
  }



module.exports = {
    buildTables: (req, res) => {
        sequelize.query(`
        drop table if exists ingredient_to_recipe;
        drop table if exists recipes;
        drop table if exists ingredients;

        CREATE TABLE recipes (
            recipe_id VARCHAR PRIMARY KEY UNIQUE NOT NULL,
            recipe_name VARCHAR (150) NOT NULL,
            cook_time INT NOT NULL,
            instructions VARCHAR NOT NULL,
            image_link VARCHAR NOT NULL
        );

        CREATE TABLE ingredients (
            ingredient_id VARCHAR PRIMARY KEY UNIQUE NOT NULL,
            ingredient_name VARCHAR (150) UNIQUE NOT NULL,
            in_pantry BOOLEAN
        );

        CREATE TABLE ingredient_to_recipe (
            ing_to_recipe_id VARCHAR PRIMARY KEY UNIQUE NOT NULL,
            recipe_id VARCHAR REFERENCES recipes(recipe_id) NOT NULL,
            ingredient_id VARCHAR REFERENCES ingredients(ingredient_id) NOT NULL,
            quantity DECIMAL NOT NULL,
            unit VARCHAR (50) NOT NULL,
            descriptor VARCHAR (200)
        )
        `).then(() => {
            console.log('DB tables built.')
            res.status(200)
        }).catch(err => console.log('error creating tables', err))
    },

    addRecipe: async (req, res) => {
        let { recipeName, cookTime, instructions, imageLink, ingredients } = req.body
        let hashRecipeID = generateUniqueKey(13)
        
        await sequelize.query(`
        INSERT INTO 
            recipes (recipe_id, recipe_name, cook_time, instructions, image_link)
        VALUES
            ('${hashRecipeID}' ,'${recipeName}', ${cookTime},'${instructions}', '${imageLink}');
        `).then(() => {
            console.log('recipe added')
            res.sendStatus(200)
        }).catch(err => console.log(err))

        try {await Promise.all(
            ingredients.map(async i => {
                const {ingredientName, quantity, unit, descriptor} = i
                let hashIngredID = generateUniqueKey(7)
                let hashIngToRecID = generateUniqueKey(8)
                    
                const result = await sequelize.query(`
                SELECT ingredient_id FROM ingredients
                WHERE ingredient_name = '${ingredientName}'
                `)

                const dbIngredientID = result?.[0]?.[0]?.ingredient_id

                if (dbIngredientID){
                    hashIngredID = dbIngredientID
                } else {
                    await sequelize.query(`
                    INSERT INTO
                        ingredients (ingredient_id, ingredient_name)
                    VALUES
                        ('${hashIngredID}','${ingredientName}')
                    `) 
                }
                    
                await sequelize.query(`
                INSERT INTO
                    ingredient_to_recipe (ing_to_recipe_id, recipe_id, ingredient_id, quantity, unit, descriptor)
                VALUES
                    ('${hashIngToRecID}', '${hashRecipeID}', '${hashIngredID}', ${quantity}, '${unit}', '${descriptor}')
                `).catch(err => console.log(err))               
        })
    )
    res.sendStatus

    }  catch (e) {
        console.error(e)
    }
    },

    getRecipes: (req, res) => {
        // let allRecipes = []
        // sequelize.query(`
        //     SELECT recipe_id FROM recipes
        // `).then((dbRes) => {
        //     for (i in dbRes[0]){
        //         let id = dbRes[0][i].recipe_id
        //         // console.dir(id)
        //         sequelize.query(`
        //             SELECT 
        //             ingredient_to_recipe.recipe_id,
        //             quantity,
        //             unit,
        //             descriptor,
        //             ingredient_name,
        //             in_pantry,
        //             recipe_name,
        //             cook_time,
        //             instructions,
        //             image_link
        //             FROM ingredient_to_recipe
        //             JOIN ingredients ON ingredients.ingredient_id = ingredient_to_recipe.ingredient_id
        //             JOIN recipes ON recipes.recipe_id = ingredient_to_recipe.recipe_id
        //             WHERE ingredient_to_recipe.recipe_id = '${id}'
        //         `)
        //         .then(dbRes2 => {
        //             console.log(dbRes2[0])
        //             allRecipes.push(dbRes2[0])
        //         })
        //     }
        //     // console.dir(allRecipes)
        //     res.status(200).send(allRecipes)
        // }) 
        sequelize.query(`
        SELECT *
        FROM recipes
        JOIN ingredient_to_recipe ON recipes.recipe_id = ingredient_to_recipe.recipe_id
        JOIN ingredients ON ingredients.ingredient_id = ingredient_to_recipe.ingredient_id
        ORDER BY recipes.recipe_name;
        `).then((dbRes) => {
            res.status(200).send(dbRes[0])
         })
        .catch(err => console.log(err))
    },

    //addIngredients has no end points or corresponding HTML.
    addIngredients: async (req, res) => {
        const {ingredients} = req.body
        try {await Promise.all(
            ingredients.map(async i => {
                const {ingredientName} = i
                let hashIngredID = generateUniqueKey(7)
                    
                const result = await sequelize.query(`
                SELECT ingredient_id FROM ingredients
                WHERE ingredient_name = '${ingredientName}'
                `)

                const dbIngredientID = result?.[0]?.[0]?.ingredient_id
                // console.dir({dbIngredientID})

                if (dbIngredientID){
                    hashIngredID = dbIngredientID
                } else {
                    await sequelize.query(`
                    INSERT INTO
                        ingredients (ingredient_id, ingredient_name)
                    VALUES
                        ('${hashIngredID}','${ingredientName}')
                    `) 
                }               
        })
    )
    res.sendStatus

    }  catch (e) {
        console.error(e)
    }
    }
}



        

// const test = () => {
//     ['foo', 'Flour'].forEach(async item => {
//         const result = await sequelize.query(`
//             SELECT ingredient_id FROM ingredients
//             WHERE ingredient_name = '${item}'
//         `)
        // console.dir(result)
        // console.dir(result?.[0]?.[0]?.ingredient_id)
//     })
// }

// test()

