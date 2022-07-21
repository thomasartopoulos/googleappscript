// Fecha: 14 de julio de 2022
// v. 1.0.0
//--------------------------------------------------------------------------------------//
// 14/07/2022 - EmailReport() -> Envío de alerta en caso que falle el script
//            - uploadNombres() -> Carga de la hoja de nombres
//            - TriggerReport() -> Carga de datos del trigger a la hoja de "Estado de envíos" 
//--------------------------------------------------------------------------------------//

function mainFunction(){
  uploadNombres();
  EmailReport();
  TriggerReport();
}

// ------------------------ VARIABLES GLOBALES ----------------------------

var ss_trigger = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Estado de envíos");
var ss_alertas = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Alertas");
var ss_nombres = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Output para Upload - Nombres");

var accountId = "163885122";
var webPropertyId = "UA-163885122-1";
var customDataSourceId = "jXcYyAAJQ1i9Zvt3kmeE1g";



// ------------------------ ALERTAS ----------------------------

function EmailReport(body) {
     var d = new Date();
     var currentTime = d.toLocaleTimeString();
     var lr = ss_alertas.getLastRow();
     // var to = "thomas.artopoulos@mediamonks.com";

        for (var i = 2; i<=lr; i++){
          var ListadoMails = ss_alertas.getRange(i, 1).getValue();
          MailApp.sendEmail(ListadoMails, currentTime+" [Error] Data Import Script: Nombres - Upload.gs", body);
    } 
}

// ------------------------ TRIGGER REPORT ------------------------

function TriggerReport(upload) {

  var date = Utilities.formatDate(new Date(), "GMT-3", "yyyy-MM-dd HH:mm:ss"); // "yyyy-MM-dd'T'HH:mm:ss'Z'"
  var date_col = ss_trigger.getRange('A1:A').getDisplayValues().flat();
  var date_index = date_col.length - date_col.slice().reverse().findIndex(x => x!='') + 1;
  var date_cell = ss_trigger.getRange('A' + date_index);
  date_cell.setValue(date);

  // Script
  var function_name = "Nombres - Upload"
  var function_col = ss_trigger.getRange('B1:B').getDisplayValues().flat();
  var function_index = function_col.length - function_col.slice().reverse().findIndex(x => x!='') + 1;
  var function_cell = ss_trigger.getRange('B' + function_index);
  function_cell.setValue(function_name);

    // Log --> Lo terminé definiendo más abajo! No se cómo definir variables globales.
  //var log_col = ss_trigger.getRange('C1:C').getDisplayValues().flat();
  //var log_index = function_col.length - function_col.slice().reverse().findIndex(x => x!='') + 1;
  //var log_cell = ss_trigger.getRange('C' + function_index);
  //function_cell.setValue(function_name);
}

// ------------------------ UPLOAD NOMBRES ------------------------

function uploadNombres()
{
  var maxRows = ss_nombres.getLastRow();
  var maxColumns = ss_nombres.getLastColumn();
  var data = [];

  for (var i = 1; i <= maxRows;i++) {
    data.push(ss_nombres.getRange([i], 1,1, maxColumns).getValues());
  }
  var newData = data.join("\n");
  var blobData = Utilities.newBlob(newData, "application/octet-stream", "GA import data");
  Logger.log(blobData.getDataAsString())

  try {
    var upload= Analytics.Management.Uploads.uploadData(accountId, webPropertyId, customDataSourceId, blobData);
    
    SpreadsheetApp.getUi().alert("Uploading: OK");

    // Log
    var log_col = ss_trigger.getRange('C1:C').getDisplayValues().flat();
    var log_index = log_col.length - log_col.slice().reverse().findIndex(x => x!='') + 1;
    var log_cell = ss_trigger.getRange('C' + log_index);
    log_cell.setValue("Uploading: OK");

    // Row counter
    var number_col = ss_trigger.getRange('D1:C').getDisplayValues().flat();
    var number_index = number_col.length - number_col.slice().reverse().findIndex(x => x!='') + 1;
    var number_cell = ss_trigger.getRange('D' + log_index);
    const data = ss_nombres.getRange('A:A').getValues();
    let ar=data.map(x => x[0]); //turns 2D array to 1D array, so we can use indexOf
    const number=ar.indexOf('');
    number_cell.setValue(number);
  }

  catch(err) {
    SpreadsheetApp.getUi().alert(err);
    EmailReport(err);

    // Log
    var log_col = ss_trigger.getRange('C1:C').getDisplayValues().flat();
    var log_index = log_col.length - log_col.slice().reverse().findIndex(x => x!='') + 1;
    var log_cell = ss_trigger.getRange('C' + log_index);
    log_cell.setValue(err);


    // Row counter
    var number_col = ss_trigger.getRange('D1:D').getDisplayValues().flat();
    var number_index = number_col.length - number_col.slice().reverse().findIndex(x => x!='') + 1;
    var number_cell = ss_trigger.getRange('D' + number_index);
    // Me traigo la data de la hoja de nombres
    const data = ss_nombres.getRange('A:A').getValues();
    let ar=data.map(x => x[0]); //turns 2D array to 1D array, so we can use indexOf
    const number=ar.indexOf('');
    number_cell.setValue(number);
  }
}
