import xmlrpc from 'xmlrpc';  // Change require to import

// // Odoo server configurations
const odooUrl = 'http://localhost:8069';
// const db = 'NEDUniversity-7';
// const username = 'admin';  // Change this to your Odoo username
// const password = 'admin';  // Change this to your Odoo password

// // XML-RPC client connection to Odoo
// const client = xmlrpc.createClient({
//     url: `${odooUrl}/xmlrpc/2/common`
// });

// // Function to login to Odoo
// export function loginToOdoo() {
//     client.methodCall('authenticate', [db, username, password, {}], function (error, value) {
//         if (error) {
//             console.log('Error logging in to Odoo:', error);
//         } else {
//             const uid = value; // This is the user ID
//             console.log(`Login successful. User ID: ${uid}`);
//             // fetchUsers(uid);
//             // fetchSalesOrders(uid);
//             // fetchProducts(uid);
//             // fetchPartners(uid);
//         }
//     });
// }

// // Function to fetch users
// function fetchUsers(uid) {
//     const modelsClient = xmlrpc.createClient({
//         url: `${odooUrl}/xmlrpc/2/object`
//     });

//     const domain = [];
//     const fields = ['name', 'login'];
//     modelsClient.methodCall('execute_kw', [
//         db, uid, password, 'res.users', 'search_read', [domain], { fields }
//     ], function (error, value) {
//         if (error) {
//             console.log('Error fetching users:', error);
//         } else {
//             console.log('Users:', value);
//         }
//     });
// }

// // Function to fetch sales orders
// function fetchSalesOrders(uid) {
//     const modelsClient = xmlrpc.createClient({
//         url: `${odooUrl}/xmlrpc/2/object`
//     });

//     const domain = [];
//     const fields = ['name', 'date_order', 'partner_id', 'amount_total'];
//     modelsClient.methodCall('execute_kw', [
//         db, uid, password, 'sale.order', 'search_read', [domain], { fields }
//     ], function (error, value) {
//         if (error) {
//             console.log('Error fetching sales orders:', error);
//         } else {
//             console.log('Sales Orders:', value);
//         }
//     });
// }

// // Function to fetch products
// function fetchProducts(uid) {
//     const modelsClient = xmlrpc.createClient({
//         url: `${odooUrl}/xmlrpc/2/object`
//     });

//     const domain = [];
//     const fields = ['name', 'list_price', 'type'];
//     modelsClient.methodCall('execute_kw', [
//         db, uid, password, 'product.product', 'search_read', [domain], { fields }
//     ], function (error, value) {
//         if (error) {
//             console.log('Error fetching products:', error);
//         } else {
//             console.log('Products:', value);
//         }
//     });
// }

// // Function to fetch partners
// function fetchPartners(uid) {
//     const modelsClient = xmlrpc.createClient({
//         url: `${odooUrl}/xmlrpc/2/object`
//     });

//     const domain = [];
//     const fields = ['name', 'email', 'phone'];
//     modelsClient.methodCall('execute_kw', [
//         db, uid, password, 'res.partner', 'search_read', [domain], { fields }
//     ], function (error, value) {
//         if (error) {
//             console.log('Error fetching partners:', error);
//         } else {
//             console.log('Partners:', value);
//         }
//     });
// }

// // Start the process
// loginToOdoo();
// //  XML-RPC client connection to Odoo
 
 
 
 
 
 
 
 
 
 const client = xmlrpc.createClient({
    url: `${odooUrl}/xmlrpc/2/common`
  });

  // Function to login to Odoo
  export function loginToOdoo(db, username, password) {
    client.methodCall('authenticate', [db, username, password, {}], function (error, value) {
      if (error) {
        console.log('Error logging in to Odoo:', error);
      } else {
        const uid = value; // This is the user ID
        console.log(`Login successful. User ID: ${uid}`);
        // fetchUsers(uid);
        // fetchSalesOrders(uid);
        // fetchProducts(uid);
        // fetchPartners(uid);
      }
    });
  }

  // Function to fetch users
  function fetchUsers(uid) {
    const modelsClient = xmlrpc.createClient({
      url: `${odooUrl}/xmlrpc/2/object`
    });

    const domain = [];
    const fields = ['name', 'login'];
    modelsClient.methodCall('execute_kw', [
      db, uid, password, 'res.users', 'search_read', [domain], { fields }
    ], function (error, value) {
      if (error) {
        console.log('Error fetching users:', error);
      } else {
        console.log('Users:', value);
      }
    });
  }

  // Function to fetch sales orders
  function fetchSalesOrders(uid) {
    const modelsClient = xmlrpc.createClient({
      url: `${odooUrl}/xmlrpc/2/object`
    });

    const domain = [];
    const fields = ['name', 'date_order', 'partner_id', 'amount_total'];
    modelsClient.methodCall('execute_kw', [
      db, uid, password, 'sale.order', 'search_read', [domain], { fields }
    ], function (error, value) {
      if (error) {
        console.log('Error fetching sales orders:', error);
      } else {
        console.log('Sales Orders:', value);
      }
    });
  }

  // Function to fetch products
  function fetchProducts(uid) {
    const modelsClient = xmlrpc.createClient({
      url: `${odooUrl}/xmlrpc/2/object`
    });

    const domain = [];
    const fields = ['name', 'list_price', 'type'];
    modelsClient.methodCall('execute_kw', [
      db, uid, password, 'product.product', 'search_read', [domain], { fields }
    ], function (error, value) {
      if (error) {
        console.log('Error fetching products:', error);
      } else {
        console.log('Products:', value);
      }
    });
  }

  // Function to fetch partners
  function fetchPartners(uid) {
    const modelsClient = xmlrpc.createClient({
      url: `${odooUrl}/xmlrpc/2/object`
    });

    const domain = [];
    const fields = ['name', 'email', 'phone'];
    modelsClient.methodCall('execute_kw', [
      db, uid, password, 'res.partner', 'search_read', [domain], { fields }
    ], function (error, value) {
      if (error) {
        console.log('Error fetching partners:', error);
      } else {
        console.log('Partners:', value);
      }
    });
  }
