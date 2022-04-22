// Chai
const chai = require("chai");
const assert = require("chai").assert;
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);
const app = require('../../app');
const url='http://localhost:3300';

// Controller Dependencies
const controller = require("../../controller/userController");
const mysql = require('mysql');
const config = require('../../js/config');
const UserController = new controller();
const testDAO = require("../testsDAOMethods");
const { getMaxListeners } = require("../../app");
const pool = mysql.createPool(config.databaseConfig);
const dao_test = new testDAO(pool);

// tests
describe('hooks', function () {

    let id_usuario_reg;

    before(function () {
        // antes de cada test insertamos ("registramos") un usuario para que pueda logearse
        let usuario_reg = {
            username: "BorrarTareaTestNEG",
            email: "borrartareatestNEG@gmail.com",
            password: "1234"
        };
        dao_test.insert_user(usuario_reg);
        id_usuario_reg = dao_test.get_id_user(usuario_reg.email);

        // añadimos tareas a ese usuario, una de cada tipo
        let tareaManual = {
            nombre: "NombreMNEG",
            prioridad: "BAJA",
            categoria: "@CategoriaMNEG",
            id_usuario: id_usuario_reg,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "m",
            // atributos tarea manual
            id_tarea: -1,
            hora_ini: "10:00",
            hora_fin: "15:00",
            recurrente: 0,
            dias_recurrentes: "@L"
        };
        dao_test.insert_task(tareaManual);
        tareaManual.id_tarea = dao_test.get_id_task(tareaManual);
        dao_test.insert_task_m(tareaManual);

        let tareaProgramada = {
            nombre: "NombrePNEG",
            prioridad: "ALTA",
            categoria: "@CategoriaPNEG",
            id_usuario: id_usuario_reg,
            fechafin: a.format("YYYY-MM-DD"),
            fechaini: b.format("YYYY-MM-DD"),
            tipo: "p",
            // atributos tarea programada
            horas: 10,
            id_programada: -1,
            tipo_ds: "DIARIA"
        };
        dao_test.insert_task(tareaProgramada);
        tareaProgramada.id_programada = dao_test.get_id_task(tareaProgramada);
        dao_test.insert_task_p(tareaProgramada);
    })

    after(function () {
        // después de cada test borramos al que se ha insertado para poder ejecutarlos siempre
        dao_aux.delete_user(id_usuario_reg);
    });

    describe("Borrar tarea", function () {

        it("Borrar tarea manual", async function () {
            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/deleteTask/' + id_usuario_reg + '/' + tareaManual.id_tarea)
                        .end((err, res, body) => {
                            expect(res).to.have.status(200);
                        });
                });
        });

        it("Borrar tarea programada", async function () {
            let agent = chai.request.agent(url);
            await agent.post('/usuarios/login_user')
                .send({ correo: usuario_reg.email, password: usuario_reg.password })
                .then((res) => {
                    this.timeout(30000);
                    agent.get('/tareas/deleteTask/' + id_usuario_reg + '/' + tareaProgramada.id_programada)
                        .end((err, res, body) => {
                            expect(res).to.have.status(200);
                        });
                });
        });

    });

});