// Fecha de creación: 1 de julio de 2022
// v. 1.0.0

//--------------------------------------------------------------------------------------//
// 01/07/2022 - Función "writeApiResponse" para la lectura de la columna con las credenciales, GET a la API y escritua sobre columna de status.
// 02/07/2022 - Función "onopen" para automatizar la creación de las nuevas sheets con la fecha como nombre.
//            - Función "importrange" para copiar la información original de la hoja de credenciales
//--------------------------------------------------------------------------------------//

function mainFunction(){
  onOpen();
  Utilities.sleep(200);// pause in the loop for 200 milliseconds
  runsies();
  Utilities.sleep(200);
  writeApiResponse();
  Utilities.sleep(200);
}


function onOpen() {

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var date = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy");

    var yourNewSheet = ss.getSheetByName(date);

    if (yourNewSheet != null) {
        ss.deleteSheet(yourNewSheet);
    }

    yourNewSheet = ss.insertSheet();
    yourNewSheet.setName(date);
} // Cierro onOpen

// Con esta función copio y pego la información de las columnas
function runsies() {
var date = Utilities.formatDate(new Date(), "GMT-3", "dd/MM/yyyy");

  importRange(
    "1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA",  //Source ID -  e.g. "14QBa3ID3EWbK3FNReNUn5nlJwQFQR6l91zODzZTd6SA"
    "QueryInfo!A:A", // Source Range - e.g. "Task List!A2:G"
    "1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA", // Destination ID - e.g. "14QBa3ID3EWbK3FNReNUn5nlJwQFQR6l91zODzZTd6SA"
    date +"!A:A" // Destination Range Start - e.g. "Sheet1!B3"
  );  
  
  importRange(
    "1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA",  //Source ID -  e.g. "14QBa3ID3EWbK3FNReNUn5nlJwQFQR6l91zODzZTd6SA"
    "QueryInfo!B:B", // Source Range - e.g. "Task List!A2:G"
    "1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA", // Destination ID - e.g. "14QBa3ID3EWbK3FNReNUn5nlJwQFQR6l91zODzZTd6SA"
    date +"!B:B" // Destination Range Start - e.g. "Sheet1!B3"
  );

  importRange(
    "1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA",  //Source ID -  e.g. "14QBa3ID3EWbK3FNReNUn5nlJwQFQR6l91zODzZTd6SA"
    "QueryInfo!C:C", // Source Range - e.g. "Task List!A2:G"
    "1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA", // Destination ID - e.g. "14QBa3ID3EWbK3FNReNUn5nlJwQFQR6l91zODzZTd6SA"
    date +"!C:C" // Destination Range Start - e.g. "Sheet1!B3"
  );

  importRange(
    "1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA",  //Source ID -  e.g. "14QBa3ID3EWbK3FNReNUn5nlJwQFQR6l91zODzZTd6SA"
    "QueryInfo!D:D", // Source Range - e.g. "Task List!A2:G"
    "1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA", // Destination ID - e.g. "14QBa3ID3EWbK3FNReNUn5nlJwQFQR6l91zODzZTd6SA"
    date +"!D:D" // Destination Range Start - e.g. "Sheet1!B3"
  );

};

function importRange(sourceID, sourceRange, destinationID, destinationRangeStart){

  // Gather the source range values
  const sourceSS = SpreadsheetApp.openById(sourceID);
  const sourceRng = sourceSS.getRange(sourceRange)
  const sourceVals = sourceRng.getValues();

  // Get the destiation sheet and cell location.
  const destinationSS = SpreadsheetApp.openById(destinationID);
  const destStartRange = destinationSS.getRange(destinationRangeStart);
  const destSheet = destStartRange.getSheet();

  // Get the full data range to paste from start range.
  const destRange = destSheet.getRange(
      destStartRange.getRow(),
      destStartRange.getColumn(),
      sourceVals.length,
      sourceVals[0].length
    );
  
  // Paste in the values.
  destRange.setValues(sourceVals);

  SpreadsheetApp.flush();
};

function writeApiResponse() {

//------------------------------ Me traigo la columna de API Keys ---------------------------//

  // Determino el rango, ver si puedo hacer que el rango dependa de la columna B pero las celdas que tienen info
  var range_apikeys = SpreadsheetApp.openById("1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA").getSheets()[0].getRange('B2:B')
  
  // Me traigo la data en un array de dos dimensiones filtrando celdas vacías
  var api_keys = range_apikeys.getValues().flat().filter(r=>r!="");

  // Uso el método length para el for
  var apiLength = api_keys.length;

//------------------------------ Me traigo la columna Query Schedule------------------------//

  // Determino el rango, ver si puedo hacer que el rango dependa de la columna B pero las celdas que tienen info
  var range_queryschedule = SpreadsheetApp.openById("1W1vB3yLuKUF8PSQrHGYJr9wk3ofw64TKLuDXpCKoEVA").getSheets()[0].getRange('C2:C')

  // Me traigo la data en un array de dos dimensiones filtrando celdas vacías
  var query_schedule = range_queryschedule.getValues().flat().filter(r=>r!="");

//------------------------------ Json Request------------------------//

  var request = {
    'url': 'https://api.supermetrics.com/enterprise/v2/query/status?json='
};

  var json_request={'api_key':'','schedule_id':''}

//------------------------------GET------------------------//

  // Itero sobre los valores
  for (var i = 0; i < apiLength; i++) {
    json_request.api_key = ' "api_key" : ' + '"' + api_keys[i] + '"';
    json_request.schedule_id = ' "schedule_id" : ' + '"' +  query_schedule[i] + '"';
    
    // console.log(json_request)

  // Damos formato al url

    var request_tourl= (request.url + '{' + json_request.api_key + ',' + json_request.schedule_id + '}')

   // console.log(request_tourl)

    var url_encoded = encodeURI(request_tourl)

    // Iteramos con el try
    try{
    var response = UrlFetchApp.fetch(url_encoded);
      console.log(response)
      }

    catch (error) {
      console.log(error);
      }

  //------------------------------Enviamos la información al spreadsheet------------------------//

  

  }
} 
