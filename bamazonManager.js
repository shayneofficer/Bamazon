const inquirer = require("inquirer");
const mysql = require("mysql");
const table = require("table");

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
    listOptions();
})



function listOptions() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "operation"
        }
    ]).then((ans) => {
        switch (ans.operation) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;

            default:
                break;
        }


    }).catch((err) => {
        console.log(err);
    });
}

function viewProducts() {
    var query = connection.query(
        "SELECT * FROM products",
        (err, res) => {
            if (err) throw err;
            console.log(res);
            connection.end();
        }
    );
}

function viewLowInventory() {
    var query = connection.query(
        "SELECT * FROM products WHERE stock_quantity < 100",
        (err, res) => {
            if (err) throw err;
            console.log(res);
            connection.end();
        }
    )
}

function addToInventory() {
    inquirer.prompt([
        {
            type: "input",
            message: "Which item ID would you like to add more of?",
            name: "itemID"
        }
    ]).then((ans) => {
        var currQuantity;
        currQuantity = getCurrQuantity(ans.itemID);
    }).catch((err) => {
        console.log(err);
    });
}

function getCurrQuantity(itemID) {
    connection.query(
        "SELECT * FROM products WHERE ?",
        {
            item_id: itemID
        },
        (err, res) => {
            if (err) {
                throw err;
            }
            addFiftyUnits(res[0].stock_quantity, itemID);
        });
}

function addFiftyUnits(oldQuantity, itemID) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: oldQuantity + 50
            },
            {
                item_id: itemID
            }
        ],
        (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(`Added 50 units to item number ${itemID}!`);
            connection.end();
        }

    )
}

function addNewProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "What product would you like to add?",
            name: "productName"
        },
        {
            type: "input",
            message: "To which department would you like to add it?",
            name: "productDept",
        },
        {
            type: "input",
            message: "What price should the new product be?",
            name: "productPrice"
        },
        {
            type: "input",
            message: "How many of this product would you like to stock?",
            name: "productStock"
        }
    ]).then((ans) => {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: ans.productName,
                department_name: ans.productDept,
                price: ans.productPrice,
                stock_quantity: ans.productStock
            },
            (err, res) => {
                console.log(res.affectedRows + " product inserted!\n");
                connection.end();
            }
        )
    }).catch((err) => {
        console.log(err);
    })
}