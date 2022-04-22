const assert = require("chai").assert;
const chai = require("chai");
const dao = require("../../js/userDAO");
const testDAO = require("../testsDAOMethods");
const mysql = require('mysql');
const config = require('../../js/config');
const { NULL } = require("mysql/lib/protocol/constants/types");
const pool = mysql.createPool(config.databaseConfig);
const task = new dao(pool);
const dao_test = new testDAO(pool);

describe('hooks', function () {

    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        setTimeout(function () {
            dao_test.get_id_user("registrotestDAO@gmail.com", cb_getID);
            function cb_getID(err, getID) {
                id_usuario = getID;
                dao_test.delete_user(id_usuario);
            }
        }, 1000);
    });

    // tests
    describe("Registrarse", function () {

        it("Agrega usuario a la BD", function () {
            let nuevoUsuario = {
                nombre: "RegistroTestDAO",
                correo: "registrotestDAO@gmail.com",
                pass: "1234",
            };
            task.registro(nuevoUsuario).then(value => {
                assert.equal(value, true);
            });

        });

    });

});