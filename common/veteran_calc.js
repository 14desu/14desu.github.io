const Veteran_Output_Number = 500 + 1;
const Veteran_DirectInput_Numner = 4;
const Table_Row_Number = Veteran_Output_Number + Veteran_DirectInput_Numner
var Veteran_Probability = new Array(5);
for (var i = 0; i < 5; i++) {
  Veteran_Probability[i] = new Array(Table_Row_Number);
  for (var j = 0; j < Table_Row_Number; j++) {
    Veteran_Probability[i][j] = 0;
  }
}
for(var j = 0; j < Table_Row_Number; j++) {
  if(j<Veteran_DirectInput_Numner){
    Veteran_Probability[0][j] = $("#Veteran_Direct_Input"+[j+1]).val()*1 ;
  }
  else{
    Veteran_Probability[0][j] = j-Veteran_DirectInput_Numner;
  }
}

function KR_Veteran_Probability(){
  
  for(var j = 0; j < Table_Row_Number; j++) {
    if(j<Veteran_DirectInput_Numner){
      Veteran_Probability[0][j] = $("#Veteran_Direct_Input"+[j+1]).val()*1 ;
    }
    Veteran_Probability[1][j] = KR_Veteran_Probability_calc(Veteran_Probability[0][j]);
    Veteran_Probability[2][j] = Veteran_Probability[1][j]*1.1;
    Veteran_Probability[3][j] = Veteran_Probability[1][j]*$("#EVENT_FREE_Input").val();
    Veteran_Probability[4][j] = Veteran_Probability[2][j]*$("#EVENT_PAID_Input").val();
    for(var i = 1; i < 5; i++) {
      if(Veteran_Probability[i][j] > 100){
        Veteran_Probability[i][j] = 100;
      }
    }
  }
  KR_Veteran_Probability_Show();
}

function KR_Veteran_Probability_Show(){
  var Demical_Place = $("#Demical_Place_Input").val()*1;
  for(var j = 0; j < Table_Row_Number; j++) {
    $("#FREE"+[j]).html( (Math.round(Veteran_Probability[1][j]*Math.pow(10, Demical_Place))/Math.pow(10, Demical_Place)).toFixed(Demical_Place) );
    $("#PAID"+[j]).html( (Math.round(Veteran_Probability[2][j]*Math.pow(10, Demical_Place))/Math.pow(10, Demical_Place)).toFixed(Demical_Place) );
    $("#EVENTFREE"+[j]).html( (Math.round(Veteran_Probability[3][j]*Math.pow(10, Demical_Place))/Math.pow(10, Demical_Place)).toFixed(Demical_Place) );
    $("#EVENTPAID"+[j]).html( (Math.round(Veteran_Probability[4][j]*Math.pow(10, Demical_Place))/Math.pow(10, Demical_Place)).toFixed(Demical_Place) );
  }
  $("#EventFreeRatio").html( "x"+$("#EVENT_FREE_Input").val());
  $("#EventPaidRatio").html( "x"+$("#EVENT_PAID_Input").val());
}

const tbody = document.querySelector('#VETERANOUPUTTABLE tbody');
const fragment = document.createDocumentFragment();

for (let veteran_number = Veteran_DirectInput_Numner; veteran_number < Table_Row_Number; veteran_number++) {
  const row = document.createElement('tr');
  row.className = 'ALLROW' + (veteran_number % 5 === Veteran_DirectInput_Numner ? ' FIVEROW' : '') + (veteran_number % 10 === Veteran_DirectInput_Numner ? ' TENROW' : '');
  row.innerHTML = `
    <td>${veteran_number-Veteran_DirectInput_Numner}</td>
    <td><span id="FREE${veteran_number}"></span></td>
    <td><span id="PAID${veteran_number}"></span></td>
    <td><span id="EVENTFREE${veteran_number}"></span></td>
    <td><span id="EVENTPAID${veteran_number}"></span></td>
  `;
  fragment.appendChild(row);
}
tbody.appendChild(fragment);

$(document).ready(function () {
  $(".ALLROW, .DIRECTIPROW").hide();
  $(".TENROW").show();
  setTimeout(function() {
    KR_Veteran_Probability();
  }, 100);
});

$(document).on("change",".VETERAN_INPUT",function(){
  $(".ALLROW, .DIRECTIPROW").hide();
  $("."+$("#Veteran_Unit").val()).show();
  KR_Veteran_Probability();
});
