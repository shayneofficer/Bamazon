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
        var oldStock;
        var queryOne = connection.query(
            "SELECT stock_quantity FROM products WHERE ?",
            {
                item_id: ans.itemID
            },
            (err, res) => {
                if (err) throw err;
                oldStock = res;
                console.log(oldStock);
                console.log(res);
            }
        )
        var newStock = oldStock + 50;
        console.log(newStock);
        var queryTwo = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newStock
                },
                {
                    item_id: ans.itemID
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log(res);
            }
        )
    }).catch((err) => {
        console.log(err);
    })


}

function addNewProduct() {

}