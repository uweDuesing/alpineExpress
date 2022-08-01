export class ApiController {

    public helloWorld = (req, res): Promise<string> => {
        return new Promise((resolve, reject) => {

            if (req.body?.user !== undefined) {
                const user = req.body['user'];

                resolve(JSON.stringify({msg: 'hello ' +user}));
            } else {
                resolve(JSON.stringify({msg: 'hello world'}));
            }
        });
    };
}
