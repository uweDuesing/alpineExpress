export class User {

    public pgp = require('pg-promise')(/* options */)
    public db = this.pgp('postgres://express:expressjs@localhost:5432/Express')


   public getAllUsers = (): Promise <{name: string, last_name: string}> => {

        return new Promise((resolve, reject) => {
            const users = [];
            this.db.multi('SELECT * from public.user')
                .then((data) => {
                    resolve(data);
                    console.log('DATA:', data)
                })
                .catch((error) => {
                    console.log('ERROR:', error)
                })
        });

    };

}
