const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as ID ${connection.threadId}\n`);

    purchasePrompt();
});


function purchasePrompt() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the item you want to buy?",
            name: "itemID"
        },
        {
            type: "input",
            message: "How many units would you like to buy?",
            name: "itemUnits"
        }
    ]).then((ans) => {
        checkQuantity(ans.itemID, ans.itemUnits);
    }).catch((err) => {
        console.log(err);
    });
}

function checkQuantity(id, units) {
    var query = connection.query(
        "SELECT * FROM products WHERE ?",
        {
            item_id: id
        },
        (err, res, fields) => {
            if (err) throw err;

            if (units > res[0].stock_quantity) {
                console.log("Insufficient quantity!");
                purchasePrompt();
            } else {
                orderItem(id, units, res[0].stock_quantity, res[0].price);
            }
        }
    );
}

function orderItem(id, units, stock, price) {
    var newStock = stock - units;
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newStock
            },
            {
                item_id: id
            }
        ],
        (err, res) => {
            if (err) throw err;
            console.log(`You spent $${units * price}\n`);
        }
    );
    connection.end();
}