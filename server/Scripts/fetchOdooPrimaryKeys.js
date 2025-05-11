import Odoo from "odoo-xmlrpc";

export async function getPrimaryKeyColumns(url, port, db, username, password, tablename) {

    return new Promise((resolve, reject) => {
        const odoo = new Odoo({
            url: url,
            port: parseInt(port),
            db: db,
            username: username,
            password: password
        });

        console.log("Attempting to connect to Odoo...");

        odoo.connect(function (err) {
            if (err) {
                console.error("❌ Connection error:", err);
                return reject("Connection error: " + err);
            }

            console.log("✅ Connected to Odoo!");

            const model = tablename;
            const method = 'fields_get';
            const params = [
                [], // positional args
                { attributes: ['type', 'required', 'readonly'] } // kwargs
            ];


            odoo.execute_kw(model, method, params, function (err2, fields) {
                if (err2) {
                    console.error("❌ Error fetching fields from Odoo:", err2);
                    return reject("Error fetching fields: " + err2);
                }


                const primaryKeys = [];

                if (fields.id) {
                    primaryKeys.push({
                        name: 'id',
                        type: fields.id.type
                    });
                    console.log("Added 'id' field as primary key.");
                }

                for (const [key, attrs] of Object.entries(fields)) {
                    if (
                        key !== 'id' &&
                        attrs.required === true &&
                        attrs.readonly === true
                    ) {
                        primaryKeys.push({
                            name: key,
                            type: attrs.type
                        });
                        console.log(`Added '${key}' as additional primary-like field.`);
                    }
                }

                resolve(primaryKeys);
            });
        });
    });
}
