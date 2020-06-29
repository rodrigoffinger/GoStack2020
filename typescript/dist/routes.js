"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = void 0;
var CreateUser_1 = __importDefault(require("./services/CreateUser"));
function helloWorld(request, response) {
    var user = CreateUser_1.default({
        name: "Rodrigo",
        email: "rodrigo_fgf@hotmail.com",
        password: "123456",
        techs: ["Node", "React", { title: "JS", experience: 100 }],
    });
    return response.json({ message: "Hello world" });
}
exports.helloWorld = helloWorld;
