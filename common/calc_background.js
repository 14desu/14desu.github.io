$(document).ready( function() {
  $(".sailor_performance_input_detail").hide();
});

$(document).on("change","#sailor_exp_new_ip_check",function(){
  sailor_performance_input_detail_set();
});

function sailor_performance_input_detail_set(){
  if($("#sailor_exp_new_ip_check").is(":checked") == true){
    $(".sailor_performance_input_detail").show();
  }
  else{
    $(".sailor_performance_input_detail").hide();
  }
}

function Nation_Autoip(){
    //국가변경시의 기본정보
    var Nation_Index = [
      ["국가","공홈국가번호", "EBB함포연사","FCS길이","트리갱신용트리거","함선여유율","엔진시간","엔진비율","어뢰연사속도"],
      ["미국", 1,             18.8,         1700,   "USN",               23,16,120,  35.8],
      ["영국", 2,             19.88,        1600,   "RN",               28,17,120,  40.2],
      ["일본", 3,             19.6,         1600,   "IN",               22,14,120,  41.2],
      ["독일", 4,             19.8,         1750,   "KM",               20,14,120,  37],
      ["프랑스", 5,           19.6,         1725,   "MN",               25,15,120,  48],
      ["소련", 6,             18.72,        1728,   "SN",               25,16,122,  51],
      ["이탈리아", 7,         19.6,         1699,   "RM",               28,14,120,  52],
      ];
  
    //국가판정>자동IP
    for(i=0; i<Nation_Index.length; i++){
      if($("#nation_sel").val() == Nation_Index[i][0]){
        $(".FCS_Official_Shipyard").attr("href", "https://www.navyfield.co.kr:444/guide/shipyard/fcs.asp?Code1="+Nation_Index[i][1]);
        $(".Engine_Official_Shipyard").attr("href", "https://www.navyfield.co.kr:444/guide/shipyard/engine.asp?Code1="+Nation_Index[i][1]);
        $(".Ship_Official_Shipyard").attr("href", "https://www.navyfield.co.kr:444/guide/shipyard/ship.asp?Code1="+Nation_Index[i][1]);
        $(".Gun_Official_Shipyard").attr("href", "https://www.navyfield.co.kr:444/guide/shipyard/gun.asp?Code1="+Nation_Index[i][1]);
        $(".Torpedo_Official_Shipyard").attr("href", "https://www.navyfield.co.kr:444/guide/shipyard/torpedo.asp?Code1="+Nation_Index[i][1]);

        $(".Gun_Reloadtime_Input").val(Nation_Index[i][2]);
        $(".FCS_Guideline_Input").val(Nation_Index[i][3]);
        $("."+Nation_Index[i][4]).show();
        $("#Ship_Calc_Ship_BasicOverheatRate_Input").val(Nation_Index[i][5]);
        $("#Ship_Calc_Engine_OverheatTime_Input").val(Nation_Index[i][6]);
        $("#Ship_Calc_Engine_OverheatRate_Input").val(Nation_Index[i][7]);
        $("#Torpedo_Reloadtime_Input").val(Nation_Index[i][8]);

      }
    }
  }
  
function RN_Abroad_Reset(){
  //영국유학IP체크리셋
  $("#RN_Abroad_Input").prop("checked", false);
  //영국유학함장IP/OP리셋
  if($("#nation_sel").val() == "영국"){
    $("#RN_Abroad_Input").hide();
  }
  else{
    if($("#tree_sel").val() == "함장"){
      $("#RN_Abroad_Input").show();
    }
  }
}

function Boost_List_Reset(){
  if($("#server_input").val() == "Korea_server"){
    $(".boost1").show();
    $(".boost2").hide();
    $(".boost20").hide();
    if($("#Sailor_AutoInput").val() == "직접입력"){
      $(".boost2").show();
    }
  }
  else if($("#server_input").val() == "Global_server"){
    $(".boost1").hide();
    $(".boost2").hide();
    $(".boost20").show();
  }
}

function level_input_reset(){
  if($("#server_input").val() == "Korea_server"){
    $("#LEVIP").val(120);
  }
  else if($("#server_input").val() == "Global_server"){
    $("#LEVIP").val(125);
  }
}

$(document).on("change","#server_input",function(){
  Boost_List_Reset();
  level_input_reset();
  sailor_calc_inputoutput_reset();
});

$(document).on("change","#Sailor_AutoInput",function(){
  Boost_List_Reset(); 
});

$(document).on("change","#nation_sel",function(){
    params["nationinput"] = $("#nation_sel").val();
  
    //수병트리의 리셋
    $(".TreeReset").hide();
    $(".SailorTreeReset").val("");
  
    Nation_Autoip();
    RN_Abroad_Reset();
    SS_Divetime_Autoip();
});

$(document).on("change","#tree_sel",function(){
    //
    params["treeinput"] = $("#tree_sel").val();
      
    sailor_calc_inputoutput_reset();
});

$(document).on("change","#RN_Abroad_Input",function(){
    if($("#RN_Abroad_Input").is(":checked") == true){
      params["nationinput"] = "영국";
    }
    else{
      params["nationinput"] = $("#nation_sel").val();
    }
});

$(document).on("change","#Gun_ActualReloadtime_Output",function(){
    if($("#Gun_ActualReloadtime_Output").is(":checked") == true){
      $(".Gunner_Output_Detail").show();
    }
    else{
      $(".Gunner_Output_Detail").hide();
    }
});

$(document).on("change","#SS_Class_Input",function(){
    SS_Divetime_Autoip();
});

function SS_Divetime_Autoip(){
    var Nation_SS_Divetime = [
      ["국가","SS1","SS2","SS3","SS4","SS5","PSS","SS6"],
      ["미국",132,154,176,198.88,222.92,231,240],
      ["영국",129.8,151.8,173.8,196.4,221.52,230,240],
      ["일본",140.8,162.8,184.8,210.68,237.84,238,240],
      ["독일",127.6,151.8,176,200.64,224.88,232,240],
      ["프랑스",132.56,155.12,177.64,185.76,218,229,240],
      ["소련",128,152,176,208,220.48,230,240],
      ["이탈리아",124,145,166,200,224,232,240],
      ];
    for(i=0; i<Nation_SS_Divetime.length; i++){
      if($("#nation_sel").val() == Nation_SS_Divetime[i][0]){
        for(j=1; j<8; j++){
          if($("#SS_Class_Input").val() == Nation_SS_Divetime[0][j]){
            $("#SS_Divetime_Input").val(Nation_SS_Divetime[i][j]);
            $(".SS_Class_Output").text(Nation_SS_Divetime[0][j]+" "+Nation_SS_Divetime[i][j]+"s");
          }
        }
      }
    }
}

$(document).on("change","#Sailor_AutoInput",function(){
  Sailor_Ability_Autoip();
});

function Sailor_Ability_Autoip(){
    //어빌입력 리셋
    document.getElementById("POTIP").value = 9;  
    document.getElementById("ACCIP").value = 9;
    document.getElementById("RLDIP").value = 9;
    document.getElementById("TORIP").value = 9;
    document.getElementById("AAWIP").value = 9;
    document.getElementById("REPIP").value = 9;
    document.getElementById("RESIP").value = 9;
    document.getElementById("ENGIP").value = 9;
    document.getElementById("AIRIP").value = 9;
    document.getElementById("FIGIP").value = 9;
    document.getElementById("BOMIP").value = 9;
  
    //이벤트수병 입력
    if($("#Sailor_AutoInput").val() == "개근"){
      document.getElementById("ACCIP").value = 14;
      document.getElementById("RLDIP").value = 14;
    }
    else if($("#Sailor_AutoInput").val() == "전설보조"){
      document.getElementById("REPIP").value = 14;
      document.getElementById("RESIP").value = 14;
      document.getElementById("ENGIP").value = 14;
    }
    else if($("#Sailor_AutoInput").val() == "전설특무"){
      document.getElementById("AIRIP").value = 14;
      document.getElementById("FIGIP").value = 14;
      document.getElementById("BOMIP").value = 14;
    }
    //플미수병 입력
    else if($("#Sailor_AutoInput").val() == "잠재플미"){
      document.getElementById("POTIP").value = 17;
    }
    else if($("#Sailor_AutoInput").val() == "명중플미"){
      document.getElementById("ACCIP").value = 14;
      document.getElementById("RLDIP").value = 11;
    }
    else if($("#Sailor_AutoInput").val() == "연사플미"){
      document.getElementById("ACCIP").value = 11;
      document.getElementById("RLDIP").value = 14;
    }
    else if($("#Sailor_AutoInput").val() == "어뢰플미"){
      document.getElementById("TORIP").value = 14;
    }
    else if($("#Sailor_AutoInput").val() == "수리플미"){
      document.getElementById("REPIP").value = 14;
    }
    else if($("#Sailor_AutoInput").val() == "보수플미"){
      document.getElementById("RESIP").value = 14;
    }
    else if($("#Sailor_AutoInput").val() == "기관플미"){
      document.getElementById("ENGIP").value = 14;
    }
    else if($("#Sailor_AutoInput").val() == "전투플미"){
      document.getElementById("FIGIP").value = 14;
    }
    else if($("#Sailor_AutoInput").val() == "폭격플미"){
      document.getElementById("BOMIP").value = 14;
    }
}

function Ship_Calc_GuidelineInput_Reset(){
    if(document.getElementById("Ship_Calc_Guideline_YN").checked == true){
      document.getElementById("Ship_Calc_FCSGuidelineInput_Row").style.display = "";
      document.getElementById("Ship_Calc_TargetGuidelineInput_Row").style.display = "";
    }
    else{
      document.getElementById("Ship_Calc_FCSGuidelineInput_Row").style.display = "none";
      document.getElementById("Ship_Calc_TargetGuidelineInput_Row").style.display = "none";
    }
}

function Realabil_Calc_AutoInput(index){
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
  for (i = 0; i < abilindex.length; i++){
    $("#Realabil_Calc_"+abilindex[i][1]+"_Input"+index).val( $("#"+abilindex[i][1]+"Total").html() );
  }

  $("#Realabil_Calc_NUM_Input"+index).val( $("#NUMTotal").html() );
  $("#Realabil_Calc_VET_Input"+index).val( $("#output_vetip6").val() );
  $("#Realabil_Calc_EXP_Input"+index).val( $("#output_expip6").val() );
  $("#Realabil_Calc_NEW_Input"+index).val( $("#output_newip6").val() );

}

function Ship_Calc_AutoInput(index){
    document.getElementById("Ship_Calc_SailorType"+index).innerHTML = document.getElementById("tree_sel").value;
    if(document.getElementById("tree_sel").value == "함장"){
      if(index != 1){
        alert("함장은 함장석이외에 탑승할 수 없습니다")
      }
      document.getElementById("Ship_Calc_POTInput"+index).value = document.getElementById("POTTotal").innerHTML;
    }
    else{
      if(index == 1){
        if(document.getElementById("tree_sel").value != "함장"){
          alert("함장석에 함장이외의 수병은 횟수제프리미엄쉽에만 탑승할 수 있습니다")
        }
        document.getElementById("Ship_Calc_POTInput"+index).value = document.getElementById("POTTotal").innerHTML;
      }
    }
    if(document.getElementById("tree_sel").value == "갑판병"){
      if(index == 1){
        document.getElementById("Ship_Calc_POTInput"+index).value = document.getElementById("POTTotal").innerHTML;
      }
      else{
        document.getElementById("Ship_Calc_POTInput"+index).value = document.getElementById("POTSeamanTotal").innerHTML;
      }
      document.getElementById("Ship_Calc_ENGInput"+index).value = document.getElementById("ENGSeamanTotal").innerHTML;
    }
    if(document.getElementById("tree_sel").value == "기관병"){
      if(index > 5){
        document.getElementById("Ship_Calc_ENGInput"+index).value = document.getElementById("ENGTotal").innerHTML;
      }
    }
    document.getElementById("Ship_Calc_REPInput"+index).value = document.getElementById("REPTotal").innerHTML;
    document.getElementById("Ship_Calc_NUMInput"+index).value = document.getElementById("NUMTotal").innerHTML;
    document.getElementById("Ship_Calc_VETInput"+index).value = document.getElementById("output_vetip6").value;
}

function Guideline_Calc_AutoInput(index){
    document.getElementById("Guideline_Calc_POTInput"+index).value = document.getElementById("POTTotal").innerHTML;
    document.getElementById("Guideline_Calc_REPInput"+index).value = document.getElementById("REPTotal").innerHTML;
    document.getElementById("Guideline_Calc_NUMInput"+index).value = document.getElementById("NUMTotal").innerHTML;
    document.getElementById("Guideline_Calc_VETInput"+index).value = document.getElementById("VET45").innerHTML;
    document.getElementById("Guideline_Calc_EXPInput"+index).value = document.getElementById("NUMTotal").innerHTML - document.getElementById("VET45").innerHTML;
    document.getElementById("Guideline_Calc_FCSInput"+index).value = document.getElementById("FCS_Guideline_Input").value;
    document.getElementById("Guideline_Calc_TargetInput"+index).value = 3000;
}

function Pompom_Reload_Calc_AutoInput(index){
    document.getElementById("Pompom_Reload_Calc_RLDInput"+index).value = document.getElementById("RLDTotal").innerHTML;
    document.getElementById("Pompom_Reload_Calc_REPInput"+index).value = document.getElementById("REPTotal").innerHTML;
    document.getElementById("Pompom_Reload_Calc_NUMInput"+index).value = document.getElementById("NUMTotal").innerHTML;
    document.getElementById("Pompom_Reload_Calc_VETInput"+index).value = document.getElementById("VET45").innerHTML;
    document.getElementById("Pompom_Reload_Calc_EXPInput"+index).value = document.getElementById("NUMTotal").innerHTML - document.getElementById("VET45").innerHTML;
}

function Reload_Calc_AutoInput(index){
    document.getElementById("Reload_Calc_RLDInput"+index).value = document.getElementById("RLDTotal").innerHTML;
    document.getElementById("Reload_Calc_REPInput"+index).value = document.getElementById("REPTotal").innerHTML;
    document.getElementById("Reload_Calc_NUMInput"+index).value = document.getElementById("NUMTotal").innerHTML;
    document.getElementById("Reload_Calc_VETInput"+index).value = document.getElementById("VET45").innerHTML;
    document.getElementById("Reload_Calc_EXPInput"+index).value = document.getElementById("NUMTotal").innerHTML - document.getElementById("VET45").innerHTML;
}

function sailor_calc_inputoutput_reset(){
  //트리변경 -> 늦직IP리셋
  $(".SailorTreeReset").val("");
  //트리변경 -> OUTPUT리셋
  $(".Captin_Input,.Captin_Output,.Gunner_Input,.Gunner_Output,.Gunner_Output_Detail,.Engine_Output,.Sonar_Output,.Submerge_Output,.Torpedo_Input,.Torpedo_Output").hide();
  $(".Basic_output").show();

  //영국유학IP리셋
  $("#RN_Abroad_Input").prop("checked", false);

  if($("#tree_sel").val() == "함장"){
    $(".Captin_Input,.Captin_Output").show();
    if($("#nation_sel").val() == "영국"){
      $("#RN_Abroad_Input").hide();
    }
  }
  if($("#tree_sel").val().match("포")){
    $(".Gunner_Input,.Gunner_Output").show();
    if($("#Gun_ActualReloadtime_Output").is(":checked") == true){
      $(".Gunner_Output_Detail").show();
    }
  }
  if($("#tree_sel").val().match("기관")){
    $(".Engine_Output").show();
  }
  if($("#tree_sel").val().match("음탐")){
    $(".Sonar_Output").show();
  }
  if($("#tree_sel").val().match("잠항")){
    $(".Submerge_Input").show();
    $(".Submerge_Output").show();
  }
  if($("#tree_sel").val().match("어뢰")){
    $(".Torpedo_Input").show();
    $(".Torpedo_Output").show();
  }

  if($("#server_input").val() == "Korea_server"){
    $(".Global_output").hide();
  }
  if($("#server_input").val() == "Global_server"){
    $(".KR_input,.KR_output").hide();
  }
}

function sailor_performance_autoip(){

  //40%,45% 사관수 자동입력
  $("#output_vetip5").val(Math.floor($("#NUMTotal").html()*0.4));
  $("#output_vetip6").val(Math.floor($("#NUMTotal").html()*0.45));

  //숙련병수 자동입력
  for(i=0; i<6; i++){
    if($("#output_vetip"+[i+1]).val() > Math.floor($("#NUMTotal").html()*0.45)){
      $("#output_vetip"+[i+1]).val( Math.floor($("#NUMTotal").html()*0.4) );
    }
    $("#output_expip"+[i+1]).val($("#NUMTotal").html()-$("#output_vetip"+[i+1]).val());  
  }

  //빈혈도 계산 + 수병수입력 자동수정
  sailor_performance_amenia_update();

}

$(document).on("change",".output_sailor_ip",function(){
  sailor_performance_amenia_update();
  sailor_performance_calc();
});

function sailor_performance_amenia_update(){
  for(i=0; i<6; i++){
    if($("#server_input").val() == "Korea_server"){
      if($("#output_vetip"+[i+1]).val()>$("#NUMTotal").html()*0.45){
        alert("입력된 사관수가 전체수병수의 45%를 넘을수 없습니다")
        $("#output_vetip"+[i+1]).val(Math.floor($("#NUMTotal").html()*0.45));
      }
    }
    if($("#server_input").val() == "Global_server"){
      if($("#output_vetip"+[i+1]).val()>$("#NUMTotal").html()*0.5){
        alert("입력된 사관수가 전체수병수의 50%를 넘을수 없습니다")
        $("#output_vetip"+[i+1]).val(Math.floor($("#NUMTotal").html()*0.5));
      }
    }
    if($("#output_vetip"+[i+1]).val()*1+$("#output_expip"+[i+1]).val()*1+$("#output_newip"+[i+1]).val()*1>$("#NUMTotal").html()*1){
      alert("입력된 사관+숙련병+신병의 합이 전체수병수를 넘을수 없습니다")
      if($("#output_vetip"+[i+1]).val()*1+$("#output_expip"+[i+1]).val()*1>$("#NUMTotal").html()*1){
        $("#output_expip"+[i+1]).val($("#NUMTotal").html()*1-$("#output_vetip"+[i+1]).val()*1-$("#output_newip"+[i+1]).val());
      }
      else{
        $("#output_newip"+[i+1]).val($("#NUMTotal").html()*1-$("#output_vetip"+[i+1]).val()*1-$("#output_expip"+[i+1]).val());
      }
    }
    $("#output_amenia"+[i+1]).html(Math.floor(($("#output_vetip"+[i+1]).val()*1+$("#output_expip"+[i+1]).val()*1+$("#output_newip"+[i+1]).val()*1)/$("#NUMTotal").html()*1000)/10);
  }
}

function sailor_performance_calc(){

  const output_vet_number = 6;
  let abilindex = [
    ["잠재", "POT"],
    ["명중", "ACC"],
    ["연사", "RLD"],
    ["어뢰", "TOR"],
    ["수리", "REP"],
    ["보수", "REP"],
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
      sailor_realabil[k][j] = Realabil_Calc($("#"+abilindex[j][1]+"Total").html()*1,$("#output_vetip"+[k+1]).val()*1,$("#output_expip"+[k+1]).val()*1,($("#output_vetip"+[k+1]).val()*1+$("#output_expip"+[k+1]).val()*1+$("#output_newip"+[k+1]).val()*1)/$("#NUMTotal").html());
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
    //구조방어계산
    $("#KR_RestoreRate"+(k+1)).html( KR_RestoreRate_calc( sailor_realabil[k][5]) );
    $("#Global_RestoreRate"+(k+1)).html( Global_RestoreRate_calc( sailor_realabil[k][5]) );
    //Global 포병계산
    $("#Global_GunnerReloadCap"+(k+1)).html( Global_GunReloadCap_calc( sailor_realabil[k][2]) );
    //KR 포병계산
    let reloadtiercalc = 0;
    for(j=0; j<kr_reload_tiercut_data.length; j++){
      if(kr_reload_tiercut_data[j]+70 < sailor_realabil[k][2] ) {
        reloadtiercalc = reloadtiercalc + 1;
      }
    }
    $("#SailorReload"+(k+1)).html( reloadtiercalc );
    $("#NeededSeamanReloadUp"+(k+1)).html( Math.ceil((kr_reload_tiercut_data[reloadtiercalc]/sailor_realabil[k][2])*100-100) );
    $("#AvgGunReload"+(k+1)).html( KR_AvgReloadTime_calc(reloadtiercalc) );
    $("#ActualGunReload"+(k+1)).html( KR_RealReloadTime_calc(KR_AvgReloadTime_calc(reloadtiercalc)) );
    $("#WithSeaman_GunReload"+(k+1)).html( KR_AvgReloadTime_calc(reloadtiercalc+1) );
    $("#WithSeaman_ActualGunReload"+(k+1)).html( KR_RealReloadTime_calc(KR_AvgReloadTime_calc(reloadtiercalc+1)) );
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
        $("#Torpedo_ReloadTime"+(k+1)).html( KR_TorpedoReloadTime_calc(kr_torpedo_tier_data[j][0]) );
        if(j>0 && j<kr_torpedo_tier_data.length-1){
          $("#Torpedo_NeededSeamanReloadUp"+(k+1)).html( Math.ceil(kr_torpedo_tier_data[j+1][1]/sailor_realabil[k][3]*100-100) );
        }
      }
    }

  }
}