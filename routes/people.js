const db = require("../services/db.js");
const express = require("express");
const routes = express.Router();

routes.use(function (req, res, next) {
    console.log(req.url, "@", Date.now());
    next();
});

//////////////////////////////////GET PEOPLE//////////////////////////////////
routes.route("/people").get((req, res) => {

    //Used to define if the get will response a list or not.
    var listPeople = req.query.listPeople;
    // if necessary a pagination. 
    var page = typeof req.query.page === 'undefined' ? 0 : parseInt(req.query.page);
    // Used to query a people by the id. 
    var idPeople = typeof req.query.idPeople === 'undefined' ? 0 : parseInt(req.query.idPeople);

    new Promise((resolve, reject) => {
        try {
            if (listPeople) {
                //SQL TO QUERY A LIST OF PEOPLE.
                // I should use this code below if I wan to create pagination on the app, otherwise the list will be fix by the env file.
                //const offset = helper.getOffset(page = 2, db.config.listPerPage);
                var sql = "";
                sql += " SELECT CONCAT(UPPER( ";
                /*sql += "     LEFT(SUBSTRING_INDEX(p.name, ' ',-1), 1)), LOWER(SUBSTRING(SUBSTRING_INDEX(p.name, ' ',-1), 2)), ', ', UPPER( ";
                sql += "     LEFT(SUBSTRING_INDEX(p.name, ' ', 1), 1)), LOWER(SUBSTRING(SUBSTRING_INDEX(p.name, ' ', 1), 2))) AS NAME, ";*/
                sql += "  p.name AS NAME, ";
                sql += "  pp.profession, ";
                sql += "     p.email, ";
                sql += "     p.idpeople as id, ";
                sql += "     if(p.likes > 999, CONCAT(FORMAT(p.likes / 1000, 1), 'K'), p.likes) AS likes, ";
                sql += "     if(p.visualizations > 999, CONCAT(FORMAT(p.visualizations / 1000, 1), 'K'), p.visualizations) AS visualization ";
                sql += " FROM people p ";
                sql += " INNER JOIN profile pp ON (p.idpeople = pp.people_idpeople) ";
                sql += " LIMIT ?,? ";
                var peopleAmount = parseInt(db.config.listPerPage);
                var params = [page, peopleAmount];
                db.query(sql, params).then((result) => {
                    resolve(res.send(result));
                });
            } else {
                //SQL TO QUERY A PEOPLE BY ID, NOT LIST. 
            }

        } catch (err) {
            console.log(err.message);
            reject(res.send(err.message));
        }
    });

    //////////////////////////////////POST PEOPLE//////////////////////////////////
});

module.exports = routes;