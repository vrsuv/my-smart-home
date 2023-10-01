// The main.js file of your application
module.exports = function (app) {

    // R1: Home page to display name of web application.
    app.get("/", function (req, res) {
        res.render("index.html")
    });

    // R2: About page to display information of web application.
    app.get("/about", function (req, res) {
        res.render("about.html");
    });


    // R3A: Display a form to add devices.
    // Page to display form to add devices or choose from 'catalog' table in database.
    app.get("/addDevices", function (req, res) {
        res.render("addDevice.html");
    });

    // Fetch all devices in the 'catalog' table when users search for a device.
    app.get("/search", function (req, res) {
        // query database to get all the devices
        let sqlquery = "SELECT * FROM catalog";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            // res.send(result);
            res.render("search.html", { catalog: result });
        });
    });

    app.get("/search-result", function (req, res) {
        //searching in the database 
        res.send(req.query);
    });

    // Search through table in database for name keyed in by user.
    // Shows row of chosen device with its input fields.
    app.get("/search-result-db", function (req, res) {
        //searching in the database
        let word = [req.query.chosenDevice];
        let sqlquery = "SELECT * FROM `catalog` WHERE name like ?";
        // execute sql query 
        db.query(sqlquery, word, (err, result) => {
            if (err) {
                res.send("No device found with the name you have entered");
                res.redirect("/search");
            } else {
                res.render('addSearched.html', { catalog: result });
            }
        });
    });

    // Page that shows details of device chosen from catalog.
    // Displays form for users to add chosen device into device list.
    app.get("/addSearched", function (req, res) {
        // query database to get all the devices
        let sqlquery = "SELECT * FROM catalog";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            // res.send(result);
            res.render("addSearched.html", { catalog: result });
        });
    });

    // R3B: Collect form data and insert into table 'yourDevices' in the database.
    // Shows updated list of devices with the addition of the new device.
    app.post("/deviceAdded", function (req, res) {
        // saving data in database
        let sqlquery = "INSERT INTO yourDevices (name, switch, move, temp, vol, speed, duration) VALUES (`?`,?,?,?,?,?,?)";
        let newrecord = [req.body.name, req.body.switch,
                        req.body.move, req.body.temp,
            req.body.vol, req.body.speed, req.body.duration];
        // execute sql query
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            } else {
                let sqlquery1 = "SELECT * FROM yourDevices";
                // execute sql query
                db.query(sqlquery1, (err, result) => {
                    if (err) {
                        res.redirect("/");
                    }
                    // res.send(result);
                    res.render("yourList.html", { yourDevices: result });
                });
            }
        });
    });


    // R4A: Let users choose/search through list.
    // Page to show all current devices in the user's device list.
    app.get("/yourDevices", function (req, res) {
        // query database to get all the books
        let sqlquery = "SELECT * FROM yourDevices";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            // res.send(result);
            res.render("yourDevices.html", { yourDevices: result });
        });
    });

    // Search database for the device selected by users.
    // Shows row of chosen device with its input fields.
    app.get("/select-search-result-db", function (req, res) {
        //searching in the database
        let word = [req.query.name];
        let sqlquery = "SELECT * FROM yourDevices WHERE name like ?";
        // execute sql query 
        db.query(sqlquery, word, (err, result) => {
            if (err) {
                return console.error("No device found with the name you have entered"
                    + req.query.name + "error: " + err.message);
                // res.redirect("/yourDevices");
            } else {
                res.render('yourSelected.html', { yourDevices: result });
            }
        });
    });

    // Page that shows details of selected device from user's device list.
    app.get("/yourSelected", function (req, res) {
        res.render("yourSelected.html");
    });


    // R5: Update device page
    // Page that shows current devices in list and form for users to choose device.
    app.get("/update", function (req, res) {
        // query database to get all the books
        let sqlquery = "SELECT * FROM yourDevices";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            // res.send(result);
            res.render("update.html", { yourDevices: result });
        });
    });

    // Search through table in database for name keyed in by user.
    // Shows row of selected device with its input fields.
    app.get("/update-search-result-db", function (req, res) {
        //searching in the database
        let word = [req.query.name];
        let sqlquery = "SELECT * FROM yourDevices WHERE name like ?";
        // execute sql query 
        db.query(sqlquery, word, (err, result) => {
            if (err) {
                res.send("No device found with the name you have entered");
                return console.error("No device found with the name you have entered"
                    + req.query.name + "error: " + err.message);
                // res.redirect("/update");
            } else {
                res.render('confirmUpdate.html', { yourDevices: result });
            }
        });
    });

    // Page that displays form for users to update relavant input fields.
    app.get("/confirmUpdate", function (req, res) {
        res.render("comfirmUpdate.html");
    });

    // R5B: Collect form data and insert into table 'yourDevices' in the database.
    // Shows updated list of devices.
    app.post("/updateDevice", function (req, res) {
        // saving data in database
        let sqlquery1 = "UPDATE yourDevices SET switch='" + req.body.switch +
                        "', move='" + req.body.move +
                        "', temp='" + req.body.temp +
                        "', vol='" + req.body.vol +
                        "', speed='" + req.body.speed +
                        "', duration='" + req.body.duration +
                        "', vol='" + req.body.vol +
                        "' WHERE name='" + req.body.name + "'";
        
        let newrecord = [req.body.name, req.body.switch,
                        req.body.move, req.body.temp,
                        req.body.vol, req.body.speed, req.body.duration];
        // execute sql query
        db.query(sqlquery1, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            } else {
                let sqlquery1 = "SELECT * FROM yourDevices";
                // execute sql query
                db.query(sqlquery1, (err, result) => {
                    if (err) {
                        res.redirect("/");
                    }
                    // res.send(result);
                    res.render("yourList.html", { yourDevices: result });
                });
            }
        });
    });


    // R6: Delete device page
    // Fetch all devices in the 'yourDevice' table when users search for a device to delete.
    app.get("/deleteDevice", function (req, res) {
        // query database to get all the books
        let sqlquery = "SELECT * FROM yourDevices";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect("/");
            }
            // res.send(result);
            res.render("deleteDevice.html", { yourDevices: result });
        });
    });

    // Search through table in database for name searched by user.
    // Shows row of chosen device with its input fields for deletion confirmation.
    app.get("/deleted-search-result-db", function (req, res) {
        //searching in the database
        let word = [req.query.name];
        let sqlquery = "SELECT * FROM yourDevices WHERE name like ?";
        // execute sql query 
        db.query(sqlquery, word, (err, result) => {
            if (err) {
                return console.error("No device found with the name you have entered"
                    + req.query.name + "error: " + err.message);
                // res.redirect("/deleteDevice");
            } else {
                res.render('confirmDelete.html', { yourDevices: result });
            }
        });
    });
    // Page that displays form for users to confirm deletion of device.
    app.get("/confirmDelete", function (req, res) {
        res.render("confirmDelete.html");
    });
    // Carry out the delete function in the database with the input given by user.
    // Shows updated list of device with the removal of device requested for deletion.
    app.post("/deviceDeleted", function (req, res) {
        // saving data in database
        let sqlquery = "DELETE FROM yourDevices where name='" + req.body.name + "'";
        // execute sql query
        let newrecord = [req.body.name];
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            } else {
                let sqlquery1 = "SELECT * FROM yourDevices";
                // execute sql query
                db.query(sqlquery1, (err, result) => {
                    if (err) {
                        res.redirect("/");
                    }
                    // res.send(result);
                    res.render("yourList.html", { yourDevices: result });
                });
            }
        });
    });

}