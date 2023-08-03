import {User} from "../user.module";

export class ApiController {

    public helloWorld = (req, res): Promise<string> => {
        return new Promise((resolve, reject) => {

            if (req.body?.user !== undefined) {

                const user = new User();
                    user.getAllUsers().then((data) => {
                        resolve(JSON.stringify(data));
                    })
            } else {
                resolve(JSON.stringify({msg: 'hello world'}));
            }
        });
    };
}

