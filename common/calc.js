var kr_reload_tiercut_data = [];
const kr_gun_reload_api_url = "https://script.google.com/macros/s/AKfycbzT6yEb6A51gg9RpMdz2uxM2lsZtDtt9OHaT_V73Ue8mujdSTedn2nBATbXW4UzttZH/exec";
function kr_gun_reload_api() {
  fetch(kr_gun_reload_api_url)
    .then(response => response.json())
    .then(data => {
      kr_reload_tiercut_data = data["data"]["kr_gun_reloadcut"];
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
}

const kr_torpedo_tier_data = [
  ["-", 0, 3761097],
  [90, 3761097, 4562019],
  [92, 4563357, 5762180],
  [94, 5762746, 7695914],
  [96, 7784227, 10564236],
];

$(document).ready(function () {
  kr_gun_reload_api();
});

var pwcode = true;
var AbilIndex = [
  ["잠재", "POT"],
  ["명중", "ACC"],
  ["연사", "RLD"],
  ["어뢰", "TOR"],
  ["대공", "AAW"],
  ["수리", "REP"],
  ["보수", "RES"],
  ["기관", "ENG"],
  ["함재", "AIR"],
  ["전투", "FIG"],
  ["폭격", "BOM"],
  ["수병수", "NUM"]
];
var sailor_class_change_number = 0;
const REDIRECT_URL2 = "https://gall.dcinside.com/board/view/?id=nf&no=368543";

function pwcode_check(){
  if( pwcode == false ) {
    window.location.href = REDIRECT_URL2;
    return false;
  }
}

function ip_ban_check(){
  if (ip_bancheck_status) {
    alert("정상적인 접근이 아닙니다")
    window.location.href = REDIRECT_URL;
    return false;
  }
}

function get_sailor_tree_detail() {

  ip_ban_check();
  pwcode_check();
  active_user_ip_post();
  
  const sailor_calc_api_url = "https://script.google.com/macros/s/AKfycbzXnaFw3AE2fEkrzDBz2BmrTgUtdlLCqxMfUuSXRyctoaeOidtiMz0DsBurvqZI5f64Hw/exec?input=" + $("#nation_sel").val() + " - " + $("#sailor_tree_select").val();

  $.getJSON(sailor_calc_api_url, function (response) {

    let sailor_tree_api = response["data"]["sailortree"];
    let sailor_ability_detail_api = response["data"]["sailorabil"];

    //sailor_ability_detail_api 값으로 검색된 전직횟수 판정
    sailor_class_change_number = 0;
    for (i = 0; i < sailor_tree_api.length; i++) {
      if (sailor_ability_detail_api[i][0] > 0) {
        sailor_class_change_number = sailor_class_change_number + 1;
      }
    }

    //판정한 전직횟수로 배열길이 조정
    sailor_tree_api.length = sailor_class_change_number;
    sailor_ability_detail_api.length = sailor_class_change_number;

    //수병트리/전직Lv정보 output
    for (i = 0; i < sailor_class_change_number; i++) {
      $("#tree_detail_class_" + [i+1]).html(sailor_tree_api[i]);
      $("#tree_detail_class_change_level_" + [i+1]).html(sailor_ability_detail_api[i][0]);
      for (j = 0; j < AbilIndex.length; j++) {
        $("#tree_detail_ability_change_" + AbilIndex[j][1] + [i+1]).html(sailor_ability_detail_api[i][j+1]);
      }
    }
    update_sailor_class_change_number();
    calculate_sailor_ability();
  }
  );
}

function update_sailor_class_change_number(){
  sailor_class_change_number = 0;
  $(".tree_detail_class_outputrow").hide();
  for (i = 0; i < 6; i++) {
    if ($("#tree_detail_class_change_level_" + [i+1]).html() > 0) {
      sailor_class_change_number = sailor_class_change_number + 1;
      $("#tree_detail_class_outputrow_" + [i+1]).show();
    }
  }
}

function calculate_sailor_ability(){

  ip_ban_check();
  pwcode_check();

  //전직상세데이터가져오기
  let sailor_tree_detail = Array.from(Array(sailor_class_change_number), () => Array(12).fill(0));
  let sailor_class_change_level_input = new Array(sailor_class_change_number);
  for (i = 0; i < sailor_class_change_number; i++) {
    sailor_tree_detail[i][0] = $("#tree_detail_class_change_level_" + [i+1]).html()*1;
    for (j = 0; j < AbilIndex.length; j++) {
      sailor_tree_detail[i][j+1] = $("#tree_detail_ability_change_" + AbilIndex[j][1] + [i+1]).html();
    }
    sailor_class_change_level_input[i] = $("#tree_detail_class_change_level_input" + [i+1]).val();
  }

  //입력초기어빌가져오기
  let sailor_ability_growth = new Array(12);
  for (i = 0; i < AbilIndex.length; i++) {
    if (i < 11) {
      sailor_ability_growth[i] = document.getElementById(AbilIndex[i][1] + "IP").value;
    }
    else if (i = 11) {
      sailor_ability_growth[i] = 5;
    }
  }

  let sailor_ability_calculate = Array.from(Array(sailor_class_change_number), () => Array(12).fill(0));
  let sailor_ability_total = [27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 55];

  // Lv1 초기누적어빌 반영 *플미/개근/전설 > 초기30
  for (i = 0; i < 11; i++) {
    if (sailor_ability_growth[i] == 14 && i != 0) {
      sailor_ability_total[i] = 30;
      if (i == 1 || i == 2) {
        sailor_ability_total[1] = 30;
        sailor_ability_total[2] = 30;
      }
    }
    else if (sailor_ability_growth[i] == 17 && i == 0) {
      sailor_ability_total[i] = 30;
    }
    else if ($("#Sailor_AutoInput").val() == "개근" || $("#Sailor_AutoInput").val() == "전설보조" || $("#Sailor_AutoInput").val() == "전설특무") {
      sailor_ability_total[i] = sailor_ability_total[i] + (sailor_ability_growth[i] - 9) * (89);
      sailor_ability_growth[i] = 9;
    }
  }

  //강화여부체크 > 적용
  for (i = 0; i < AbilIndex.length; i++) {
    if ($("#boost_input").val() == AbilIndex[i][1] + "boost" + 1) {
      sailor_ability_growth[i] = sailor_ability_growth[i] * 1 + 1;
      sailor_ability_total[i] = sailor_ability_total[i] * 1 + 1;
    }
    if ($("#boost_input").val() == AbilIndex[i][1] + "boost" + 2) {
      sailor_ability_growth[i] = sailor_ability_growth[i] * 1 + 2;
      sailor_ability_total[i] = sailor_ability_total[i] * 1 + 2;
    }
  }

  //국가보너스 어빌 계산
  if ($("#nation_sel").val() == "미국") {
    sailor_ability_total[9] = sailor_ability_total[9] + 5;
  }
  else if ($("#nation_sel").val() == "영국") {
    sailor_ability_total[5] = sailor_ability_total[5] + 3;
    sailor_ability_total[6] = sailor_ability_total[6] + 3;
  }
  else if ($("#nation_sel").val() == "일본") {
    sailor_ability_total[3] = sailor_ability_total[3] + 2;
  }
  else if ($("#nation_sel").val() == "독일") {
    sailor_ability_total[1] = sailor_ability_total[1] + 4;
    sailor_ability_total[2] = sailor_ability_total[2] + 4;
    sailor_ability_total[7] = sailor_ability_total[7] + 2;
    sailor_ability_total[9] = sailor_ability_total[9] + 2;
  }
  else if ($("#nation_sel").val() == "프랑스") {
    sailor_ability_total[6] = sailor_ability_total[6] + 2;
  }
  else if ($("#nation_sel").val() == "소련") {
    sailor_ability_total[1] = sailor_ability_total[1] + 4;
    sailor_ability_total[2] = sailor_ability_total[2] + 4;
    sailor_ability_total[7] = sailor_ability_total[7] + 2;
    sailor_ability_total[9] = sailor_ability_total[9] + 2;
  }
  else if ($("#nation_sel").val() == "이탈리아") {
    sailor_ability_total[2] = sailor_ability_total[2] + 8;
    sailor_ability_total[9] = sailor_ability_total[9] + 2;
  }

  //입력초기어빌분 계산
  for (r = 0; r < 12; r++) {
    sailor_ability_total[r] = sailor_ability_total[r] + (($("#LEVIP").val() * 1 - 1) * sailor_ability_growth[r]);
  }

  //늦직입력 - 레벨체크
  for (i = 0; i < sailor_class_change_number; i++) {
    if (sailor_class_change_level_input[i] == "") {
      continue;
    }
    if ($("#tree_detail_class_change_level_" + [i+1]).html()*1 > sailor_class_change_level_input[i]) {
      alert("늦직Lv은 본래의 전직Lv보다 더 높아야 합니다")
      $("#tree_detail_class_change_level_input" + [i+1]).val(sailor_tree_detail[i][0]);
    }
    if ($("#LEVIP").val()*1 < sailor_class_change_level_input[i]) {
      alert("늦직Lv은 수병Lv이하이어야 합니다")
      $("#tree_detail_class_change_level_input" + [i+1]).val($("#LEVIP").val()*1);
    }
    if (sailor_tree_detail[i][0] < sailor_class_change_level_input[i]) {
      sailor_tree_detail[i][0] = sailor_class_change_level_input[i];
    }
  }

  //늦직입력 - 전직안하는 트리분 반영
  for (i = 1; i < sailor_class_change_number; i++) {
    if (sailor_class_change_level_input[i] == "" && sailor_class_change_level_input[i - 1] != ""){
      sailor_tree_detail.length = i;
    }
  }

  // 수병트리영향분 계산
  for (i = 0; i < sailor_tree_detail.length; i++) {
    if ($("#LEVIP").val() * 1 < sailor_tree_detail[i][0]) {
      continue;
    }
    for (r = 0; r < 12; r++) {
      if (sailor_tree_detail[i][r + 1] == "") {
        sailor_tree_detail[i][r + 1] = 0;
      }
      sailor_ability_growth[r] = sailor_ability_growth[r] * 1 + sailor_tree_detail[i][r + 1] * 1;
      sailor_ability_calculate[i][r] = sailor_ability_calculate[i][r] + (($("#LEVIP").val() * 1 - sailor_tree_detail[i][0] * 1) * sailor_tree_detail[i][r + 1]);
    }
  }

  // 입력초기어빌 + 수병트리영향분 합산
  for (i = 0; i < sailor_class_change_number; i++) {
    for (r = 0; r < 12; r++) {
      sailor_ability_total[r] = sailor_ability_total[r] + sailor_ability_calculate[i][r];
      if (sailor_ability_total[r] < 0) {
        sailor_ability_total[r] = 0;
      }
    }
  }

  //영국 갑판병 보너스 어빌
  if ($("#nation_sel").val() == "영국") {
    if ($("#sailor_tree_select").val() == "갑판병") {
      for (r = 0; r < 11; r++) {
        sailor_ability_total[r] = sailor_ability_total[r] + 50;
      }
    }
  }

  if ($("#boost_input").val() == "boost20") {
    for (j = 0; j < 11; j++) {
      sailor_ability_growth[j] = Math.floor(sailor_ability_growth[j] * 1.225);
      sailor_ability_total[j] = Math.floor(sailor_ability_total[j] * 1.225);
    }
  }

  // 수병 성장어빌/누적어빌/수병수 계산결과 output
  for (i = 0; i < AbilIndex.length; i++) {

    //성장어빌&누적어빌
    $("#" + AbilIndex[i][1] + "Growth").html(sailor_ability_growth[i]);
    $("#" + AbilIndex[i][1] + "Total").val(sailor_ability_total[i]);

    if ($("#sailor_tree_select").val() == "갑판병") {
      if (i < AbilIndex.length - 1) {
        //갑판어빌
        $("#" + AbilIndex[i][1] + "SeamanTotal").val(Math.floor(sailor_ability_total[i] * 0.07));
        //갑판보정율
        if ($("#server_input").val() == "Korea_server") {
          $("#" + AbilIndex[i][1] + "SeamanRate").html(Math.floor(sailor_ability_total[i] / 300));
        }
        if ($("#server_input").val() == "Global_server") {
          $("#" + AbilIndex[i][1] + "SeamanRate").html("");
        }
      }
    }
    else {
      if (i < AbilIndex.length - 1) {
        $("#" + AbilIndex[i][1] + "SeamanTotal").val("");
        $("#" + AbilIndex[i][1] + "SeamanRate").html("");
      }
    }
  }
  sailor_performance_autoip();
  sailor_performance_calc();
}

function sailor_performance_calc(){

const output_vet_number = 6;
let abilindex = [
  ["잠재", "POT"],
  ["명중", "ACC"],
  ["연사", "RLD"],
  ["어뢰", "TOR"],
  ["수리", "REP"],
  ["보수", "RES"],
  ["기관", "ENG"],
  ["전투", "FIG"],
  ["폭격", "BOM"],
];

//함장목표가이드라인길이
var BBCaptin_Target_Guideline = ($("#Target_Guideline_Input").val() - $("#FCS_Guideline_Input").val());
$("#Target_Guildline").html( $("#Target_Guideline_Input").val() );

let sailor_realabil = new Array(output_vet_number);
for (k=0; k<output_vet_number; k++){
  sailor_realabil[k] = new Array(abilindex.length);
  for(j=0; j<abilindex.length; j++){
    sailor_realabil[k][j] = Realabil_Calc($("#"+abilindex[j][1]+"Total").val()*1,$("#output_vetip"+[k+1]).val()*1,$("#output_expip"+[k+1]).val()*1,($("#output_vetip"+[k+1]).val()*1+$("#output_expip"+[k+1]).val()*1+$("#output_newip"+[k+1]).val()*1)/$("#NUMTotal").val());
    if(abilindex[j][0] == $("#sailor_calc_seaman_abil_type_input").val()){
      sailor_realabil[k][j] = sailor_realabil[k][j] * ( 1 + $("#sailor_calc_seaman_rate").val() / 100 );
    }
  }
  //수리속도계산
  $("#KR_RepairSpeed"+(k+1)).html( KR_RepairSpeed_calc( sailor_realabil[k][4]) );
  $("#Global_RepairSpeed"+(k+1)).html( Global_RepairSpeed_calc( sailor_realabil[k][4]) );
  //함장수리속도계산
  if( BBCaptin_Target_Guideline*1000 < sailor_realabil[k][0] ){
    $("#KR_RepairSpeed_BBCaptin"+(k+1)).html( KR_RepairSpeed_calc(sailor_realabil[k][4]*BBCaptin_Target_Guideline*1000/sailor_realabil[k][0]) );
  }
  else{
    $("#KR_RepairSpeed_BBCaptin"+(k+1)).html( "-" );
  }
  //함장가이드라인계산
  $("#KR_Guideline"+(k+1)).html( kr_guideline_calc( sailor_realabil[k][0]) , $("#FCS_Guideline_Input").val()*1 );
  $("#Global_Guideline"+(k+1)).html( global_guideline_calc( sailor_realabil[k][0]) , $("#FCS_Guideline_Input").val()*1 );
  //구조방어계산
  $("#KR_RestoreRate"+(k+1)).html( KR_RestoreRate_calc( sailor_realabil[k][5]) );
  $("#Global_RestoreRate"+(k+1)).html( Global_RestoreRate_calc( sailor_realabil[k][5]) );
  //Global 포병계산
  $("#Global_GunnerReloadCap"+(k+1)).html( Global_GunReloadCap_calc( sailor_realabil[k][2]) );

  }

  if( pwcode == false ) {
    return;
  }


  for (k=0; k<output_vet_number; k++){
    //KR 포병계산
    let reloadtiercalc = 0;
    for(j=0; j<kr_reload_tiercut_data.length; j++){
      if(kr_reload_tiercut_data[j]+70 < sailor_realabil[k][2] ) {
        reloadtiercalc = reloadtiercalc + 1;
      }
    }
    $("#SailorReload"+(k+1)).html( "-" + (reloadtiercalc-1) + "%" );
    $("#NeededSeamanReloadUp"+(k+1)).html( Math.ceil((kr_reload_tiercut_data[reloadtiercalc]/sailor_realabil[k][2])*100-100) );
    $("#AvgGunReload"+(k+1)).html( KR_AvgReloadTime_calc( reloadtiercalc, $("#Gun_Reloadtime_Input").val()*1, $("#gun_enforce_input").val()*1 ) );
    $("#ActualGunReload"+(k+1)).html( KR_RealReloadTime_calc(KR_AvgReloadTime_calc(reloadtiercalc, $("#Gun_Reloadtime_Input").val()*1, $("#gun_enforce_input").val()*1)) );
    $("#WithSeaman_GunReload"+(k+1)).html( KR_AvgReloadTime_calc(reloadtiercalc+1, $("#Gun_Reloadtime_Input").val()*1, $("#gun_enforce_input").val()*1) );
    $("#WithSeaman_ActualGunReload"+(k+1)).html( KR_RealReloadTime_calc(KR_AvgReloadTime_calc(reloadtiercalc+1, $("#Gun_Reloadtime_Input").val()*1, $("#gun_enforce_input").val()*1)) );
    //KR 기관병계산
    $("#KR_OverheatTime"+(k+1)).html( KR_OverheatTime_calc( sailor_realabil[k][6] ) );
    $("#KR_OverheatRate"+(k+1)).html( KR_OverheatRate_calc( sailor_realabil[k][6] ) );
    //KR 음탐병계산
    $("#KR_SonarRange"+(k+1)).html( KR_SonarRange_calc( sailor_realabil[k][0] ) );
    //KR 잠항병계산
    let oxytier = KR_OxyTier_calc( sailor_realabil[k][0] );
    let oxyu = Math.ceil(((oxytier+1)*250000/sailor_realabil[k][0])*100-100);
    let oxytime = KR_OxyTime_calc($("#SS_Divetime_Input").val()*25,KR_OxyCharge_calc(oxytier));
    let oxyutime = KR_OxyTime_calc($("#SS_Divetime_Input").val()*25,KR_OxyCharge_calc(oxytier+1));
    $("#KR_OxyCharge"+(k+1)).html( KR_OxyCharge_calc(oxytier)/25 );
    $("#KR_OxyChargeTime"+(k+1)).html( oxytime );
    $("#KR_NeededSeaman_OxyChargeUp"+(k+1)).html( oxyu );
    $("#KR_WithSeaman_OxyChargeTime"+(k+1)).html( oxyutime );
    //KR 어뢰병계산
    $("#Torpedo_ReloadTier"+(k+1)).html( "-" );
    $("#Torpedo_ReloadTime"+(k+1)).html( "-" );
    $("#Torpedo_NeededSeamanReloadUp"+(k+1)).html( "-" );
    for(j=0;j<kr_torpedo_tier_data.length;j++){
      if(kr_torpedo_tier_data[j][1] < sailor_realabil[k][3] &&
      kr_torpedo_tier_data[j][2] > sailor_realabil[k][3]){
        $("#Torpedo_ReloadTier"+(k+1)).html( kr_torpedo_tier_data[j][0] );
        $("#Torpedo_ReloadTime"+(k+1)).html( KR_TorpedoReloadTime_calc(kr_torpedo_tier_data[j][0],$("#Torpedo_Reloadtime_Input").val()) );
        if(j>0 && j<kr_torpedo_tier_data.length-1){
          $("#Torpedo_NeededSeamanReloadUp"+(k+1)).html( Math.ceil(kr_torpedo_tier_data[j+1][1]/sailor_realabil[k][3]*100-100) );
        }
      }
    }

  }
}

function sailor_seaman_autocalc(){

  let seaman_number = 0;
  let seaman_total = 0;

  for(i=0; i<3; i++){
    if($("#sailor_calc_seaman_input"+[i+1]).val() > 0){
        seaman_number = seaman_number + 1 ;
        seaman_total = seaman_total + Math.floor($("#sailor_calc_seaman_input"+[i+1]).val()/21);
    }
  }

  $("#sailor_calc_seaman_number").val(seaman_number);
  $("#sailor_calc_seaman_rate").val( Math.floor(seaman_total/Math.sqrt(seaman_number)) );

}

function Get_Result_Ship_Calc() {

  ip_ban_check();
  pwcode_check();

  var POTabil = new Array(14);
  var REPabil = new Array(14);
  var ENGabil = new Array(14);
  var Sailor_TYPE = new Array(14);
  var Sailor_NUM = new Array(14);
  var Sailor_VET = new Array(14);
  var Sailor_amenia = new Array(14);

  for (i = 0; i < 14; i++) {
    POTabil[i] = document.getElementById("Ship_Calc_POTInput" + (i + 1)).value;
    REPabil[i] = document.getElementById("Ship_Calc_REPInput" + (i + 1)).value;
    ENGabil[i] = document.getElementById("Ship_Calc_ENGInput" + (i + 1)).value;
    Sailor_TYPE[i] = document.getElementById("Ship_Calc_SailorType" + (i + 1)).innerHTML;
    Sailor_NUM[i] = document.getElementById("Ship_Calc_NUMInput" + (i + 1)).value;
    Sailor_VET[i] = document.getElementById("Ship_Calc_VETInput" + (i + 1)).value;
    Sailor_amenia[i] = 1;
  }

  //함장
  var Target_Captin_Guideline = document.getElementById("Ship_Calc_TargetGuidelineInput").value - document.getElementById("Ship_Calc_FCSGuidelineInput").value;

  if (document.getElementById("Ship_Calc_Guideline_YN").checked == true) {
    if (Target_Captin_Guideline * 1000 < Realabil_Calc(POTabil[0], Sailor_VET[0], Sailor_NUM[0] - Sailor_VET[0], 1)) {
      Sailor_amenia[0] = Target_Captin_Guideline * 1000 / Realabil_Calc(POTabil[0], Sailor_VET[0], Sailor_NUM[0] - Sailor_VET[0], 1);
    }
  }

  //수리속도 계산
  var REPtotal = 0;
  var outputindex = 0;
  for (i = 0; i < REPabil.length; i++) {
    if (REPabil[i] > 0) {
      outputindex = i + 1;
      document.getElementById("Ship_Calc_RepairSpeed_Output" + outputindex).innerHTML = KR_RepairSpeed_calc(Realabil_Calc(REPabil[i], Sailor_VET[i], Sailor_NUM[i] - Sailor_VET[i], Sailor_amenia[i]));
      REPtotal = REPtotal + Realabil_Calc(REPabil[i], Sailor_VET[i], Sailor_NUM[i] - Sailor_VET[i], Sailor_amenia[i]);
    }
  }

  //기관 계산
  var ENGTotal = 0;
  var ENGCount = 0;
  var ENGSeamanTotal = 0;
  var ENGSeamanCount = 0;
  var Ship_ENGSeamanRate = 0;
  for (i = 0; i < ENGabil.length; i++) {
    if (ENGabil[i] > 0) {
      if (Sailor_TYPE[i] == "갑판병") {
        ENGSeamanTotal = ENGSeamanTotal + Math.floor(ENGabil[i] / 21);
        ENGSeamanCount = ENGSeamanCount + 1;
      }
      if (Sailor_TYPE[i] == "기관병" && i > 4) {
        outputindex = i + 1;
        document.getElementById("Ship_Calc_OverheatTime_Output" + outputindex).innerHTML = KR_OverheatTime_calc(Realabil_Calc(ENGabil[i], Sailor_VET[i], Sailor_NUM[i] - Sailor_VET[i], Sailor_amenia[i]));
        document.getElementById("Ship_Calc_OverheatRate_Output" + outputindex).innerHTML = KR_OverheatRate_calc(Realabil_Calc(ENGabil[i], Sailor_VET[i], Sailor_NUM[i] - Sailor_VET[i], Sailor_amenia[i]));
        ENGTotal = ENGTotal + Realabil_Calc(ENGabil[i], Sailor_VET[i], Sailor_NUM[i] - Sailor_VET[i], Sailor_amenia[i]);
        ENGCount = ENGCount + 1;
      }
    }
  }

  if (ENGSeamanCount > 0) {
    Ship_ENGSeamanRate = Math.floor(ENGSeamanTotal / Math.sqrt(ENGSeamanCount));
    ENGTotal = ENGTotal * (1 + Ship_ENGSeamanRate / 100);
  }

  if (ENGCount > 0) {
    var ENGPenaltyTotal = ENGTotal / Math.sqrt(ENGCount);
  }

  document.getElementById("Ship_Calc_OverheatSpeed_Output").innerHTML = KR_OverheatSpeed_calc(document.getElementById("Ship_Calc_ShipBasicSpeed_Input").value, KR_OverheatRate_calc(ENGPenaltyTotal), document.getElementById("Ship_Calc_Ship_BasicOverheatRate_Input").value, document.getElementById("Ship_Calc_Engine_OverheatRate_Input").value);
  document.getElementById("Ship_Calc_OverheatTime_Output").innerHTML = Math.floor(document.getElementById("Ship_Calc_Engine_OverheatTime_Input").value * 0.8) + KR_OverheatTime_calc(ENGTotal);
  document.getElementById("Ship_Calc_RepairSpeed_Output").innerHTML = 25 + KR_RepairSpeed_calc(REPtotal);
  document.getElementById("Ship_Calc_Seaman_CorrectionRate_Output").innerHTML = KR_OverheatRate_calc(ENGPenaltyTotal); //Ship_ENGSeamanRate;

}

function Get_Result_Realabil_Calc() {

  ip_ban_check();
  pwcode_check();

  let AbilIndex = [
    ["잠재", "POT"],
    ["명중", "ACC"],
    ["연사", "RLD"],
    ["어뢰", "TOR"],
    ["수리", "REP"],
    ["보수", "RES"],
    ["기관", "ENG"],
    ["전투", "FIG"],
    ["폭격", "BOM"],
  ];
  let SailorIndex = [
    ["수병수", "NUM"],
    ["사관", "VET"],
    ["숙련병", "EXP"],
    ["신병", "NEW"],
  ];

  //수병가져오기
  let Sailortotal = new Array(4);
  for (i = 0; i < Sailortotal.length; i++) {
    Sailortotal[i] = new Array(5);
  }
  for (i = 0; i < Sailortotal.length; i++) {
    Sailortotal[i][0] = $("#Realabil_Calc_" + SailorIndex[i][1] + "_Input1").val();
    Sailortotal[i][1] = $("#Realabil_Calc_" + SailorIndex[i][1] + "_Input2").val();
  }
  for (i = 0; i < 2; i++) {
    Sailortotal[3][i + 2] = Math.round((Sailortotal[1][i] * 1 + Sailortotal[2][i] * 1 + Sailortotal[3][i] * 1) / Sailortotal[0][i] * 1000) / 10;
    Sailortotal[2][i + 2] = Math.round(Sailortotal[2][i] * 1 * Sailortotal[3][i + 2] / 100);
    Sailortotal[1][i + 2] = Math.round(Sailortotal[1][i] * 4 * Sailortotal[3][i + 2] / 100);
    Sailortotal[0][i + 2] = Sailortotal[2][i + 2] * 1 + Sailortotal[1][i + 2] * 1;
  }
  for (i = 0; i < Sailortotal.length; i++) {
    if (Sailortotal[i][2] > 0) {
      Sailortotal[i][4] = Math.floor(Sailortotal[i][3] / Sailortotal[i][2] * 100 * 10) / 10;
    }
    else {
      Sailortotal[i][4] = "-";
    }
  }


  //어빌가져오기
  var Abiltotal = new Array(9);
  for (i = 0; i < Abiltotal.length; i++) {
    Abiltotal[i] = new Array(5);
  }
  for (i = 0; i < Abiltotal.length; i++) {
    Abiltotal[i][0] = $("#Realabil_Calc_" + AbilIndex[i][1] + "_Input1").val();
    Abiltotal[i][1] = $("#Realabil_Calc_" + AbilIndex[i][1] + "_Input2").val();
    Abiltotal[i][2] = Math.round(Abiltotal[i][0] * Sailortotal[0][2]);
    Abiltotal[i][3] = Math.round(Abiltotal[i][1] * Sailortotal[0][3]);
    if (Abiltotal[i][2] > 0) {
      Abiltotal[i][4] = Math.floor(Abiltotal[i][3] / Abiltotal[i][2] * 100 * 10) / 10;
    }
    else {
      Abiltotal[i][4] = "-";
    }
  }


  //계산결과 출력
  for (i = 0; i < Abiltotal.length; i++) {
    $("#Realabil_Calc_" + AbilIndex[i][1] + "_Output1").html(Abiltotal[i][2]);
    $("#Realabil_Calc_" + AbilIndex[i][1] + "_Output2").html(Abiltotal[i][3]);
    $("#Realabil_Calc_" + AbilIndex[i][1] + "Rate_Output").html(Abiltotal[i][4] + "%");
  }
  for (i = 0; i < Sailortotal.length; i++) {
    if (i < Sailortotal.length - 1) {
      $("#Realabil_Calc_" + SailorIndex[i][1] + "_Output1").html(Sailortotal[i][2]);
      $("#Realabil_Calc_" + SailorIndex[i][1] + "_Output2").html(Sailortotal[i][3]);
      $("#Realabil_Calc_" + SailorIndex[i][1] + "Rate_Output").html(Sailortotal[i][4] + "%");
    }
    else {
      $("#Realabil_Calc_" + SailorIndex[i][1] + "_Output1").html(Sailortotal[i][2] + "%");
      $("#Realabil_Calc_" + SailorIndex[i][1] + "_Output2").html(Sailortotal[i][3] + "%");
      $("#Realabil_Calc_" + SailorIndex[i][1] + "Rate_Output").html("← 수병빈혈도");
    }
  }
}