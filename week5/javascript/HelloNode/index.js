module.exports = async function (context, req) {

context.log('JavaScript HTTP trigger function processed a request.');

if (req.query.name || (req.body && req.body.name)) {
    // Set the output binding data from the query object.
    context.bindings.catalogItem = JSON.stringify({
        id: 123,
        name:req.query.name });
    


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: "Hello from Node.js, " + (req.query.name || req.body.name)
    };
    

}
else {
    context.res = {
        status: 400,
        body: "The query options 'name' is required."
    };
}
};




