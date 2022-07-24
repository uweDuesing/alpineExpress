export class ApiController {

    public helloWorld = (reg, res): Promise<string> => {
        return new Promise ((resolve, reject) =>{
            resolve(JSON.stringify({msg: 'hello world'}));
        });
    };
}
