async function sendRequest(adrs, method, body)
{
    let request = await fetch(adrs, {
        method: method,
        body: body
    });
    let result = await request.text();
    return result;
}
export {sendRequest};