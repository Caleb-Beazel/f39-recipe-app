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
    }
})

//generates unique string for hashing

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }
  
  // Function to generate a unique key

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

    addRecipe: (req, res) => {
        let { recipeName, cookTime, instructions, imageLink, ingredients } = req.body
        let hashRecipeID = generateUniqueKey(13)
        sequelize.query(`
        INSERT INTO 
            recipes (recipe_id, recipe_name, cook_time, instructions, image_link)
        VALUES
            ('${hashRecipeID}' ,'${recipeName}', ${cookTime},'${instructions}', '${imageLink}');
        `).then(() => {
            console.log('recipe added')
            res.sendStatus(200)
        }).catch(err => console.log(err))

        for (i of ingredients){
            console.log(i)
            console.dir(i)
            const ingredientName = i.ingredientName
            const quantity = i.quantity
            const unit = i.unit
            const descriptor = i.descriptor
            let hashIngredID = generateUniqueKey(7)
            let hashIngToRecID = generateUniqueKey(8)

            
            if(sequelize.query(`
            SELECT EXISTS(SELECT * FROM ingredients
                WHERE ingredient_name = '${ingredientName}')
            `)){
                hashIngredID = sequelize.query(`
                    SELECT ingredient_id FROM ingredients
                    WHERE ingredient_name = '${ingredientName}'
                `)
            } else { sequelize.query(`
                INSERT INTO
                    ingredients (ingredient_id, ingredient_name)
                VALUES
                    ('${hashIngredID}','${ingredientName}')
                `) 
            }

            sequelize.query(`
                INSERT INTO
                    ingredient_to_recipe (ing_to_recipe_id, recipe_id, ingredient_id, quantity, unit, descriptor)
                VALUES
                    ('${hashIngToRecID}', '${hashRecipeID}', '${hashIngredID}', ${quantity}, '${unit}', '${descriptor}')
            `).then(() => {
                console.log('ingredient to recipe added')
                res.sendStatus(200)
            }).catch(err => console.log(err))

        }
        
    }
}