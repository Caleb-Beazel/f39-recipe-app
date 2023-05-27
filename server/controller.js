require('dotenv').config()
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

module.exports = {
    buildTables: (req, res) => {
        sequelize.query(`
        drop table if exists recipes;
        drop table if exists ingredients;
        drop table if exists ingredient_to_recipe;

        CREATE TABLE recipes (
            recipe_id SERIAL PRIMARY KEY NOT NULL,
            recipe_name VARCHAR (150) NOT NULL,
            cook_time INT NOT NULL,
            instructions VARCHAR NOT NULL,
            image_link VARCHAR NOT NULL
        );

        CREATE TABLE ingredients (
            ingredient_id SERIAL PRIMARY KEY NOT NULL,
            ingredient_name VARCHAR (150) UNIQUE NOT NULL,
            in_pantry BOOLEAN
        );

        CREATE TABLE ingredient_to_recipe (
            ing_to_recipe_id SERIAL PRIMARY KEY NOT NULL,
            recipe_id INT REFERENCES recipes(recipe_id) NOT NULL,
            ingredient_id INT REFERENCES ingredients(ingredient_id) NOT NULL,
            quantity DECIMAL NOT NULL,
            unit VARCHAR (50) NOT NULL,
            descriptor VARCHAR (200)
        )
        `).then(() => {
            console.log('DB tables built.')
            res.status(200)
        }).catch(err => console.log('error creating tables', err))
    },

    newRecipe: (req, res) => {
        let { recipeName, cookTime, instructions, imageLink, ingredients } = req.body
        
        
    }
}