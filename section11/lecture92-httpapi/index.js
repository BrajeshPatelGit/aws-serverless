export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    let body;
    
    try {
        switch (event.routeKey) {
            case "GET /prod":
                body = `Processing Get All prods`; // GET prod
                break;
            case "GET /prod/{id}":
                if(event.pathParameters != null) {
                    body = `Processing Get prod Id with "${event.pathParameters.id}"`; // GET prod/1234
                }
                break;
            case "POST /prod":
                let payload = JSON.parse(event.body);
                body = `Processing Post prod Id with "${payload}"`; // POST /prod
                break;
            case "DELETE /prod/{id}":
                if(event.pathParameters != null) {
                    body = `Processing Delete prod Id with "${event.pathParameters.id}"`; // DELETE prod/1234
                }
                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }

        console.log(body);
        return {
            statusCode: 200,
            body: JSON.stringify({
            message: `Successfully finished operation: "${event.routeKey}"`,
            body: body
            })
        };

    } catch (e) {
        console.error(e);
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: "Failed to perform operation.",
            errorMsg: e.message          
          })
        };
    }       
}