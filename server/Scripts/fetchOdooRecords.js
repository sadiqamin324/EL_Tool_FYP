import Odoo from "odoo-xmlrpc";


export async function fetchOdooRecords(
  url,
  port,
  db,
  username,
  password,
  modelName,
  fieldsToFetch
) {
  const odoo = new Odoo({
    url: url,
    port: parseInt(port),
    db: db,
    username: username,
    password: password,
  });


  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        reject(`Connection failed: ${err}`);
        return;
      }

      // Fetch all records with specified fields
      odoo.execute_kw(
        modelName,          // e.g. 'product.product'
        'search_read',      // method
        [                   // args
          [],               // empty domain = all records
          { fields: fieldsToFetch }  // array of field names
        ],
        (err, records) => {
          if (err) {
            reject(`Data fetch failed: ${err}`);
          } else {
            resolve(records);  // array of objects with requested fields
          }
        }
      );
    });
  });
}