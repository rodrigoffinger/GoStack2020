import { Request, Response } from "express";
import createUser from "./services/CreateUser";

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    name: "Rodrigo",
    email: "rodrigo_fgf@hotmail.com",
    password: "123456",
    techs: ["Node", "React", { title: "JS", experience: 100 }],
  });

  return response.json({ message: "Hello world" });
}
