var origUrl = "https://script.google.com/macros/s/AKfycbwAqd78Yftsnd0xLAs6JfOUNDx2HggsAUgn0L1Cjjp1N__I4L6M/exec?";
var params = {};
var KR_Reload_TierCut_Data = [];
params["nationinput"] = "";
params["treeinput"] = "";


$(document).on("change","#nation_sel",function(){
  params["nationinput"] = $("#nation_sel").val();
  //영국유학함장 리셋
  if($("#nation_sel").val() == "영국"){
    $("#RN_Abroad_Input_Row").hide();
  }
  else{
    if($("#tree_sel").val() == "함장"){
      $("#RN_Abroad_Input_Row").show();
    }
  }
  //국가변경시의 기본정보
  var Nation_Index = [
    ["국가","공홈국가번호", "EBB함포연사","FCS길이","트리갱신용트리거","함선여유율","엔진시간","엔진비율"],
    ["미국", 1,             18.8,         1700,   "UN",               23,16,120],
    ["영국", 2,             19.88,        1600,   "RN",               28,17,120],
    ["일본", 3,             19.6,         1600,   "IN",               22,14,120],
    ["독일", 4,             19.8,         1750,   "KM",               20,14,120],
    ["프랑스", 5,           19.6,         1725,   "MN",               25,15,120],
    ["소련", 6,             18.72,        1728,   "SN",               25,16,122],
    ["이탈리아", 7,         19.6,         1699,   "RM",               28,14,120],
    ];
  //수병트리의 리셋
  $(".TreeReset").hide();
  $(".SailorTreeReset").val("");
  //국가판정>자동IP
  for(i=0; i<Nation_Index.length; i++){
    if($("#nation_sel").val() == Nation_Index[i][0]){
      $(".FCS_Official_Shipyard").attr("href", "https://www.navyfield.co.kr:444/guide/shipyard/fcs.asp?Code1="+Nation_Index[i][1]);
      $(".Engine_Official_Shipyard").attr("href", "https://www.navyfield.co.kr:444/guide/shipyard/engine.asp?Code1="+Nation_Index[i][1]);
      $(".Ship_Official_Shipyard").attr("href", "https://www.navyfield.co.kr:444/guide/shipyard/ship.asp?Code1="+Nation_Index[i][1]);
      $(".Gun_Reloadtime_Input").val(Nation_Index[i][2]);
      $(".FCS_Guideline_Input").val(Nation_Index[i][3]);
      $("."+Nation_Index[i][4]).show();
      $("#Ship_Calc_Ship_BasicOverheatRate_Input").val(Nation_Index[i][5]);
      $("#Ship_Calc_Engine_OverheatTime_Input").val(Nation_Index[i][6]);
      $("#Ship_Calc_Engine_OverheatRate_Input").val(Nation_Index[i][7]);
    }
  }
});


$(document).on("change","#tree_sel",function(){
  //
  params["treeinput"] = $("#tree_sel").val();
  //트리변경 -> 늦직IP리셋
  $(".SailorTreeReset").val("");

  //트리변경 -> OUTPUT리셋
  $(".Captin_Input_Row,.Captin_Output_Row,.Gunner_Input_Row,.Gunner_Output_Row,.Gunner_Output_Detail_Row,.Engine_Output_Row,.Sonar_Output_Row,.Submerge_Output_Row").hide();

  //영국유학IP리셋
  $("#RN_Abroad_Input").prop("checked", false);

  if($("#tree_sel").val() == "함장"){
    $(".Captin_Input_Row,.Captin_Output_Row").show();
    if($("#nation_sel").val() == "영국"){
      $("#RN_Abroad_Input_Row").hide();
    }
  }
  if($("#tree_sel").val().match("포병")){
    $(".Gunner_Input_Row,.Gunner_Output_Row").show();
    if($("#Gun_ActualReloadtime_Output").is(":checked") == true){
      $(".Gunner_Output_Detail_Row").show();
    }
  }
  if($("#tree_sel").val().match("기관")){
    $(".Engine_Output_Row").show();
  }
  if($("#tree_sel").val().match("음탐")){
    $(".Sonar_Output_Row").show();
  }
  if($("#tree_sel").val().match("잠항")){
    $(".Submerge_Output_Row").show();
  }
});

$(document).on("change","#RN_Abroad_Input",function(){
  if($("#RN_Abroad_Input").is(":checked") == true){
    params["nationinput"] = "영국";
  }
  else{
    params["nationinput"] = $("#nation_sel").val();
  }
});
    
function gen_url(){
  var param = "input=" + params["nationinput"] + " - " + params["treeinput"]
  var encoderUrl = encodeURI(origUrl + param);
  return encoderUrl
}

function get_result_sailor(){
  var encoderUrl = gen_url();
  var treedata = [];
  var abildata = [];

  fetch(encoderUrl)
  .then(response => response.json())
  .then(response => {

    treedata = response["data"]["tree"];
    abildata = response["data"]["abil"];
    KR_Reload_TierCut_Data = response["data"]["reloadcut"];

    //abildata 값으로 검색된 전직횟수 판정
    var tree_n = 0;
    for(i=0; i<treedata.length; i++){
      if(abildata[i][0] > 0){
        tree_n = tree_n + 1;
      }
    }
    //판정한 전직횟수로 배열길이 조정
    treedata.length = tree_n;
    abildata.length = tree_n;

    //수병트리/전직Lv정보 output
    document.getElementById("tree3output").style.display = "";
    document.getElementById("tree4output").style.display = "";
    document.getElementById("tree5output").style.display = "";
    document.getElementById("tree6output").style.display = "";
    document.getElementById("tree_1").innerHTML = treedata[0];
    if(tree_n > 1){
      document.getElementById("tree_2").innerHTML = treedata[1];
      if(tree_n > 2){
        document.getElementById("tree_3").innerHTML = treedata[2];
        if(tree_n > 3){
          document.getElementById("tree_4").innerHTML = treedata[3];
          if(tree_n > 4){
            document.getElementById("tree_5").innerHTML = treedata[4];
            if(tree_n > 5){
              document.getElementById("tree_6").innerHTML = treedata[5];
            }
            else{
              document.getElementById("tree6output").style.display = "none";
            }
          }
          else{
            document.getElementById("tree5output").style.display = "none";
            document.getElementById("tree6output").style.display = "none";
          }
        }
        else{
          document.getElementById("tree4output").style.display = "none";
          document.getElementById("tree5output").style.display = "none";
          document.getElementById("tree6output").style.display = "none";
        }
      }
      else{
        document.getElementById("tree3output").style.display = "none";
        document.getElementById("tree4output").style.display = "none";
        document.getElementById("tree5output").style.display = "none";
        document.getElementById("tree6output").style.display = "none";
      }
    }

    document.getElementById("tree_1LV").innerHTML = abildata[0][0];
    if(tree_n > 1){
      document.getElementById("tree_2LV").innerHTML = abildata[1][0];
      if(tree_n > 2){
        document.getElementById("tree_3LV").innerHTML = abildata[2][0];
        if(tree_n > 3){
          document.getElementById("tree_4LV").innerHTML = abildata[3][0];
          if(tree_n > 4){
            document.getElementById("tree_5LV").innerHTML = abildata[4][0];
            if(tree_n > 5){
              document.getElementById("tree_6LV").innerHTML = abildata[5][0];
            }
          }
        }
      }
    }

    //입력Lv가져오기
    var levinput = document.getElementById("LEVIP").value;
    if(levinput > 120){
      alert("수병Lv은 120을 넘을 수 없습니다")
    }

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

    //입력초기어빌가져오기
    var abilgrowth = new Array(12);
    for(i=0; i<AbilIndex.length; i++){
      if(i<11){
        abilgrowth[i] = document.getElementById(AbilIndex[i][1]+"IP").value;
      }
      else if(i=11){
        abilgrowth[i] = 5;
      }
    }

    var abilcalc = Array.from(Array(tree_n), () => Array(12).fill(0));
    var abiltotal = [25,25,25,25,25,25,25,25,25,25,25,55];

    // Lv1 초기누적어빌 반영 *플미/개근/전설 > 초기30
    for(i=0;i<11;i++){
      if(abilgrowth[i] == 14 && i != 0){
        abiltotal[i] = 30;
        if(i==1||i==2){
          abiltotal[1] = 30;
          abiltotal[2] = 30;
        }
      }
      else if(abilgrowth[i] == 17 && i == 0){
        abiltotal[i] = 30;
      }
      else if(document.getElementById("AUTOIP").value == "개근" || document.getElementById("AUTOIP").value == "전설보조" || document.getElementById("AUTOIP").value == "전설특무" ){
        abiltotal[i] = abiltotal[i] + (abilgrowth[i] - 9) * (89);
        abilgrowth[i] = 9;
      }
    }

    //강화여부체크 > 적용
    for(i=0; i<AbilIndex.length; i++){
      if(document.getElementById("boostip").value == AbilIndex[i][0]+1+"강"){
        abilgrowth[i] = abilgrowth[i]*1 + 1;
        abiltotal[i] = abiltotal[i]*1 + 1;
      }
      if(document.getElementById("boostip").value == AbilIndex[i][0]+2+"강"){
        abilgrowth[i] = abilgrowth[i]*1 + 2;
        abiltotal[i] = abiltotal[i]*1 + 2;
      }
    }

    //국가보너스 어빌 계산

    if(params["nationinput"] == "미국"){
      abiltotal[9] = abiltotal[9] + 5; }
    else if(params["nationinput"] == "영국"){
      abiltotal[5] = abiltotal[5] + 3;
      abiltotal[6] = abiltotal[6] + 3; }
    else if(params["nationinput"] == "일본"){
      abiltotal[3] = abiltotal[3] + 2; }
    else if(params["nationinput"] == "독일"){
      abiltotal[1] = abiltotal[1] + 4;
      abiltotal[2] = abiltotal[2] + 4;
      abiltotal[7] = abiltotal[7] + 2;
      abiltotal[9] = abiltotal[9] + 2; }
    else if(params["nationinput"] == "프랑스"){
      abiltotal[6] = abiltotal[6] + 2; }
    else if(params["nationinput"] == "소련"){
      abiltotal[1] = abiltotal[1] + 4;
      abiltotal[2] = abiltotal[2] + 4;
      abiltotal[7] = abiltotal[7] + 2;
      abiltotal[9] = abiltotal[9] + 2; }
    else if(params["nationinput"] == "이탈리아"){
      abiltotal[2] = abiltotal[2] + 8;
      abiltotal[9] = abiltotal[9] + 2; }

    //입력초기어빌분 계산
    for(r=0;r<12;r++){
      abiltotal[r] = abiltotal[r] + ( (levinput*1-1)*abilgrowth[r]);
    }

    //늦직입력분 반영

    var treelev = new Array(6);
    treelev[0] = document.getElementById("SailorTree1Lv").value;
    treelev[1] = document.getElementById("SailorTree2Lv").value;
    treelev[2] = document.getElementById("SailorTree3Lv").value;
    treelev[3] = document.getElementById("SailorTree4Lv").value;
    treelev[4] = document.getElementById("SailorTree5Lv").value;
    treelev[5] = document.getElementById("SailorTree6Lv").value;

    for(i=0; i<tree_n; i++){
      if(treelev[i] == ""){
        continue;
      }
      if(abildata[i][0] > treelev[i]){
        alert("늦직Lv은 본래의 전직Lv보다 더 높아야 합니다")
      }
      abildata[i][0] = treelev[i];
    }
    
    //늦직입력 - 전직안하는 트리분 반영
    for(i=tree_n; i>1; i--){
      if(treelev[i-1] == "" && treelev[i-2] != ""){
        tree_n = i-1;
      }
    }

    // 수병트리영향분 계산
    for(i=0; i<tree_n; i++){
      if(levinput*1 < abildata[i][0]){
        continue;
      }
      for(r=0; r<12; r++){
        if(abildata[i][r+1] == ""){
          abildata[i][r+1] = 0;
        }
        abilgrowth[r] = abilgrowth[r]*1 + abildata[i][r+1]*1;
        abilcalc[i][r] = abilcalc[i][r] + ((levinput*1-abildata[i][0]*1)*abildata[i][r+1]);
      }
    }

    // 입력초기어빌 + 수병트리영향분 합산
    for(i=0; i<tree_n; i++){
      for(r=0; r<12; r++){
        abiltotal[r] = abiltotal[r] + abilcalc[i][r];
        if(abiltotal[r] < 0){
          abiltotal[r] = 0;
        }
      }
    }

    //영국 갑판병 보너스 어빌
    if(params["nationinput"] == "영국"){
      if(params["treeinput"] == "갑판병"){
        for(r=0; r<11; r++){
          abiltotal[r] = abiltotal[r] + 50;
        }
      }
    }

    // 수병 성장어빌/누적어빌/수병수 계산결과 output
    for(i=0; i<AbilIndex.length; i++){
      //성장어빌
      document.getElementById(AbilIndex[i][1]+"Growth").innerHTML = abilgrowth[i];
      //누적어빌
      document.getElementById(AbilIndex[i][1]+"Total").innerHTML = abiltotal[i];
      if(params["treeinput"] == "갑판병"){
        if(i<AbilIndex.length-1){
          //갑판어빌
          document.getElementById(AbilIndex[i][1]+"SeamanTotal").innerHTML = Math.floor(abiltotal[i]*0.07);
          //갑판보정율
          if(AbilIndex[i][0] == "수리" || AbilIndex[i][0] == "보수"){
            document.getElementById(AbilIndex[i][1]+"SeamanRate").innerHTML = "-";
          }
          else{
            document.getElementById(AbilIndex[i][1]+"SeamanRate").innerHTML = Math.floor(abiltotal[i]/300);
          }
        }
      }
      else{
        if(i<AbilIndex.length-1){
          document.getElementById(AbilIndex[i][1]+"SeamanTotal").innerHTML = "";
          document.getElementById(AbilIndex[i][1]+"SeamanRate").innerHTML = "";
        }
      }
    }

    //40% 45% 사관숫자 output
    document.getElementById("VET40").innerHTML = Math.floor(abiltotal[11]*0.4);
    document.getElementById("VET45").innerHTML = Math.floor(abiltotal[11]*0.45);


    var Veteran_Output = [
      [document.getElementById("VeteranIP").value, 100],
      [180, 180],
      [250, 250],
      [300, 300],
      [document.getElementById("VET40").innerHTML, 40],
      [document.getElementById("VET45").innerHTML, 45]
    ];
    
    //함장목표가이드라인길이
    var BBCaptin_Target_Guideline = (document.getElementById("Target_Guideline_Input").value - document.getElementById("FCS_Guideline_Input").value);
    document.getElementById("Target_Guildline").innerHTML = document.getElementById("Target_Guideline_Input").value;

    for(i=0; i<Veteran_Output.length; i++){
      //수리속도계산
      document.getElementById("KR_RepairSpeed_Row"+Veteran_Output[i][1]).innerHTML = KR_RepairSpeed_calc(Realabil_Calc(abiltotal[5],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1));
      //함장수리속도계산
      if( BBCaptin_Target_Guideline*1000 < Realabil_Calc(abiltotal[0],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1) ){
      document.getElementById("KR_RepairSpeed_BBCaptin"+Veteran_Output[i][1]).innerHTML = KR_RepairSpeed_calc(Realabil_Calc(abiltotal[5],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],BBCaptin_Target_Guideline*1000/Realabil_Calc(abiltotal[0],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1)));
      }
      else{document.getElementById("KR_RepairSpeed_BBCaptin"+Veteran_Output[i][1]).innerHTML = "-";}
      //구조방어계산
      document.getElementById("KR_RestoreRate"+Veteran_Output[i][1]).innerHTML = KR_RestoreRate_calc(Realabil_Calc(abiltotal[6],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1));
      //기관오버힛시간계산
      document.getElementById("KR_OverheatTime"+Veteran_Output[i][1]).innerHTML = KR_OverheatTime_calc(Realabil_Calc(abiltotal[7],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1));
      //기관오버힛증가율계산
      document.getElementById("KR_OverheatRate"+Veteran_Output[i][1]).innerHTML = KR_OverheatRate_calc(Realabil_Calc(abiltotal[7],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1));
      //음탐만시야계산
      document.getElementById("KR_SonarRange"+Veteran_Output[i][1]).innerHTML = KR_SonarRange_calc(Realabil_Calc(abiltotal[0],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1));
      //산소충전티어
      var oxytier = KR_OxyTier_calc(Realabil_Calc(abiltotal[0],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1));
      //산소충전티어업 필요갑판보정
      var oxyu = Math.ceil(((oxytier+1)*250000/Realabil_Calc(abiltotal[0],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1))*100-100);
      //6차잠 산소충전시간
      var oxytime = KR_OxyTime_calc(6000,KR_OxyCharge_calc(oxytier));
      var oxyutime = KR_OxyTime_calc(6000,KR_OxyCharge_calc(oxytier+1));

      document.getElementById("KR_OxyCharge"+Veteran_Output[i][1]).innerHTML = KR_OxyCharge_calc(oxytier)/25;
      document.getElementById("KR_OxyChargeTime"+Veteran_Output[i][1]).innerHTML = oxytime;
      document.getElementById("KR_NeededSeaman_OxyChargeUp"+Veteran_Output[i][1]).innerHTML = oxyu;
      document.getElementById("KR_WithSeaman_OxyChargeTime"+Veteran_Output[i][1]).innerHTML = oxyutime;

      var ReloadTierCalc = 0;
        for(j=0; j<KR_Reload_TierCut_Data.length; j++){
          if(KR_Reload_TierCut_Data[j]+70 < Realabil_Calc(abiltotal[2],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1)){
            ReloadTierCalc = ReloadTierCalc + 1;
          }
        }
      document.getElementById("SailorReload"+Veteran_Output[i][1]).innerHTML = ReloadTierCalc;
      document.getElementById("NeededSeamanReloadUp"+Veteran_Output[i][1]).innerHTML = Math.ceil(KR_Reload_TierCut_Data[ReloadTierCalc]/Realabil_Calc(abiltotal[2],Veteran_Output[i][0],abiltotal[11]-Veteran_Output[i][0],1)*100-100);
      document.getElementById("AvgGunReload"+Veteran_Output[i][1]).innerHTML = KR_AvgReloadTime_calc(ReloadTierCalc);
      document.getElementById("ActualGunReload"+Veteran_Output[i][1]).innerHTML = KR_RealReloadTime_calc(KR_AvgReloadTime_calc(ReloadTierCalc));
      document.getElementById("WithSeaman_GunReload"+Veteran_Output[i][1]).innerHTML = KR_AvgReloadTime_calc(ReloadTierCalc+1);
      document.getElementById("WithSeaman_ActualGunReload"+Veteran_Output[i][1]).innerHTML = KR_RealReloadTime_calc(KR_AvgReloadTime_calc(ReloadTierCalc+1));
    }
  }
  );
}


function autoabilip(e){
  input = e.value;
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
  if(input == "개근"){
    document.getElementById("ACCIP").value = 14;
    document.getElementById("RLDIP").value = 14;
  }
  else if(input == "전설보조"){
    document.getElementById("REPIP").value = 14;
    document.getElementById("RESIP").value = 14;
    document.getElementById("ENGIP").value = 14;
  }
  else if(input == "전설특무"){
    document.getElementById("AIRIP").value = 14;
    document.getElementById("FIGIP").value = 14;
    document.getElementById("BOMIP").value = 14;
  }
  //플미수병 입력
  else if(input == "잠재플미"){
    document.getElementById("POTIP").value = 17;
  }
  else if(input == "명중플미"){
    document.getElementById("ACCIP").value = 14;
    document.getElementById("RLDIP").value = 11;
  }
  else if(input == "연사플미"){
    document.getElementById("ACCIP").value = 11;
    document.getElementById("RLDIP").value = 14;
  }
  else if(input == "어뢰플미"){
    document.getElementById("TORIP").value = 14;
  }
  else if(input == "수리플미"){
    document.getElementById("REPIP").value = 14;
  }
  else if(input == "보수플미"){
    document.getElementById("RESIP").value = 14;
  }
  else if(input == "기관플미"){
    document.getElementById("ENGIP").value = 14;
  }
  else if(input == "전투플미"){
    document.getElementById("FIGIP").value = 14;
  }
  else if(input == "폭격플미"){
    document.getElementById("BOMIP").value = 14;
  }

}

function Reload_Calc_AutoInput(index){
  document.getElementById("Reload_Calc_RLDInput"+index).value = document.getElementById("RLDTotal").innerHTML;
  document.getElementById("Reload_Calc_REPInput"+index).value = document.getElementById("REPTotal").innerHTML;
  document.getElementById("Reload_Calc_NUMInput"+index).value = document.getElementById("NUMTotal").innerHTML;
  document.getElementById("Reload_Calc_VETInput"+index).value = document.getElementById("VET45").innerHTML;
  document.getElementById("Reload_Calc_EXPInput"+index).value = document.getElementById("NUMTotal").innerHTML - document.getElementById("VET45").innerHTML;
}

function get_result_reload(){
    var encoderUrl = gen_url();

    fetch(encoderUrl)
    .then(response => response.json())
    .then(response => {

      KR_Reload_TierCut_Data = response["data"]["reloadcut"];

      //입력초기어빌가져오기
      var reloadabilip1 = document.getElementById("Reload_Calc_RLDInput1").value*1;
      var reloadabilip2 = document.getElementById("Reload_Calc_RLDInput2").value*1;

      var repairabilip1 = document.getElementById("Reload_Calc_REPInput1").value*1;
      var repairabilip2 = document.getElementById("Reload_Calc_REPInput2").value*1;

      var sailornumip1 = document.getElementById("Reload_Calc_NUMInput1").value*1;
      var sailornumip2 = document.getElementById("Reload_Calc_NUMInput2").value*1;
      var vetnumip1 = document.getElementById("Reload_Calc_VETInput1").value*1;
      var vetnumip2 = document.getElementById("Reload_Calc_VETInput2").value*1;
      var expnumip1 = document.getElementById("Reload_Calc_EXPInput1").value*1;
      var expnumip2 = document.getElementById("Reload_Calc_EXPInput2").value*1;
      var newnumip1 = document.getElementById("Reload_Calc_NEWInput1").value*1;
      var newnumip2 = document.getElementById("Reload_Calc_NEWInput2").value*1;

      //입력Lv가져오기
      var mateip = [];
      var mate = [];
      var mate_n = 0;
      var matetotal_calc = 0;
      mateip[0] = document.getElementById("mateabil1").value*1;
      mateip[1] = document.getElementById("mateabil2").value*1;
      mateip[2] = document.getElementById("mateabil3").value*1;

      for(i=0; i<mateip.length; i++){
          if(mateip[i] > 200){
              alert("갑판병 어빌을 올바르게 입력하십시오")
          }
          if(mateip[i] > 0){
              mate_n = mate_n + 1 ;
              mate[i] = Math.floor(mateip[i]/21);
              matetotal_calc = matetotal_calc + mate[i];
          }
      }
      document.getElementById("maten").innerHTML = mate_n;

      var sailorratio1 = (vetnumip1 + expnumip1 + newnumip1) / (sailornumip1);
      document.getElementById("SR1").innerHTML = Math.floor(sailorratio1*1000) / 10 ;
      if(sailorratio1 > 1){
              alert("포병1의 수병수가 사관/숙련병/신병의 합보다 많습니다")
      }
      var sailorratio2 = (vetnumip2 + expnumip2 + newnumip2) / (sailornumip2);
      document.getElementById("SR2").innerHTML = Math.floor(sailorratio2*1000) / 10 ;
      if(sailorratio2 > 1){
              alert("포병2의 수병수가 사관/숙련병/신병의 합보다 많습니다")
      }

      //수리속도
      document.getElementById("RS1").innerHTML = Math.floor(Math.floor(repairabilip1*(vetnumip1*4 + expnumip1)*sailorratio1/480)/25.6)/10;
      document.getElementById("RS2").innerHTML = Math.floor(Math.floor(repairabilip2*(vetnumip2*4 + expnumip2)*sailorratio2/480)/25.6)/10;


      //연사어빌 배열준비 + 리얼어빌ip
      var reloadcalc = new Array(2);
          reloadcalc[0] = reloadabilip1 * ( vetnumip1 * 4 + expnumip1 ) * sailorratio1;
          reloadcalc[1] = reloadabilip2 * ( vetnumip2 * 4 + expnumip2 ) * sailorratio2;

      var reloadcalcm = new Array(2);


      if(mate_n > 0){
          document.getElementById("matetotal").innerHTML = Math.floor(matetotal_calc/Math.sqrt(mate_n));
          reloadcalcm[0] = reloadcalc[0] * (Math.floor(matetotal_calc/Math.sqrt(mate_n))+100) / 100 ;
          reloadcalcm[1] = reloadcalc[1] * (Math.floor(matetotal_calc/Math.sqrt(mate_n))+100) / 100 ;
      }


      var reload_ip1 = document.getElementById("gunreload1").value*1;
      var reload_ip2 = document.getElementById("gunreload2").value*1;

      if(document.getElementById("guneh1").value == "3%연사강화"){
        reload_ip1 = reload_ip1*0.97;
      }
      else if(document.getElementById("guneh1").value == "9%연사강화"){
        reload_ip1 = reload_ip1*0.91;
      }

      if(document.getElementById("guneh2").value == "3%연사강화"){
        reload_ip2 = reload_ip2*0.97;
      }
      else if(document.getElementById("guneh2").value == "9%연사강화"){
        reload_ip2 = reload_ip2*0.91;
      }

      //연사어빌컷 구간 판정용 배열준비
      var reloadcutcalc = new Array(2);
      for(i=0; i<reloadcutcalc.length; i++){
          reloadcutcalc[i] = 0;
      }

      //연사구간판정
      for(i=0; i<reloadcalc.length; i++){
          for(j=0; j<KR_Reload_TierCut_Data.length; j++){
              if(KR_Reload_TierCut_Data[j]+70 < reloadcalc[i]){
                      reloadcutcalc[i] = reloadcutcalc[i] + 1;
              }
          }
      }
      var reloadcutcalcm = new Array(2);
      for(i=0; i<reloadcutcalcm.length; i++){
          reloadcutcalcm[i] = 0;
      }

      //연사구간판정
      for(i=0; i<reloadcalcm.length; i++){
          for(j=0; j<KR_Reload_TierCut_Data.length; j++){
              if(KR_Reload_TierCut_Data[j]+70 < reloadcalcm[i]){
                      reloadcutcalcm[i] = reloadcutcalcm[i] + 1;
              }
          }
      }

      //연사구간
      if(reloadcalc[0]>0){
      document.getElementById("RC1").innerHTML = reloadcutcalc[0];
      document.getElementById("RU1").innerHTML = Math.ceil(KR_Reload_TierCut_Data[reloadcutcalc[0]]/reloadcalc[0]*100 - 100);
        if(mate_n > 0){
        document.getElementById("RCM1").innerHTML = reloadcutcalcm[0];
        }
        if(reload_ip1 > 0){
        document.getElementById("reloadT11").innerHTML = Math.round(Math.floor(reload_ip1*25*0.01*(101 - reloadcutcalc[0]))*1.3 + 1.87)/25;
        document.getElementById("reloadTM11").innerHTML = Math.round(Math.floor(reload_ip1*25*0.01*(101 - reloadcutcalcm[0]))*1.3 + 1.87)/25;
        }
        if(reload_ip2 > 0){
        document.getElementById("reloadT21").innerHTML = Math.round(Math.floor(reload_ip2*25*0.01*(101 - reloadcutcalc[0]))*1.3 + 1.87)/25;
        document.getElementById("reloadTM21").innerHTML = Math.round(Math.floor(reload_ip2*25*0.01*(101 - reloadcutcalcm[0]))*1.3 + 1.87)/25;
        }
      }
      if(reloadcalc[1]>0){
      document.getElementById("RC2").innerHTML = reloadcutcalc[1];
      document.getElementById("RU2").innerHTML = Math.ceil(KR_Reload_TierCut_Data[reloadcutcalc[1]]/reloadcalc[1]*100 - 100);
          if(mate_n > 0){
          document.getElementById("RCM2").innerHTML = reloadcutcalcm[1];
          }
          if(reload_ip1 > 0){
          document.getElementById("reloadT12").innerHTML = Math.round(Math.floor(reload_ip1*25*0.01*(101 - reloadcutcalc[1]))*1.3 + 1.87)/25;
          document.getElementById("reloadTM12").innerHTML = Math.round(Math.floor(reload_ip1*25*0.01*(101 - reloadcutcalcm[1]))*1.3 + 1.87)/25;
          }
          if(reload_ip2 > 0){
          document.getElementById("reloadT22").innerHTML = Math.round(Math.floor(reload_ip2*25*0.01*(101 - reloadcutcalc[1]))*1.3 + 1.87)/25;
          document.getElementById("reloadTM22").innerHTML = Math.round(Math.floor(reload_ip2*25*0.01*(101 - reloadcutcalcm[1]))*1.3 + 1.87)/25;
          }
      }

    }
  );
}

function Pompom_Reload_Calc_AutoInput(index){
  document.getElementById("Pompom_Reload_Calc_RLDInput"+index).value = document.getElementById("RLDTotal").innerHTML;
  document.getElementById("Pompom_Reload_Calc_REPInput"+index).value = document.getElementById("REPTotal").innerHTML;
  document.getElementById("Pompom_Reload_Calc_NUMInput"+index).value = document.getElementById("NUMTotal").innerHTML;
  document.getElementById("Pompom_Reload_Calc_VETInput"+index).value = document.getElementById("VET45").innerHTML;
  document.getElementById("Pompom_Reload_Calc_EXPInput"+index).value = document.getElementById("NUMTotal").innerHTML - document.getElementById("VET45").innerHTML;
}

function get_result_pompom(){

  var RLD = document.getElementById("Pompom_Reload_Calc_RLDInput1").value;
  var REP = document.getElementById("Pompom_Reload_Calc_REPInput1").value;
  var NUM = document.getElementById("Pompom_Reload_Calc_NUMInput1").value;
  var VET = document.getElementById("Pompom_Reload_Calc_VETInput1").value;
  var EXP = document.getElementById("Pompom_Reload_Calc_EXPInput1").value;
  var NEW = document.getElementById("Pompom_Reload_Calc_NEWInput1").value;
  var PPCUT = 2710070;

  // 수병빈혈도 계산
  var NUMR = (VET*1+EXP*1+NEW*1)/NUM*1;
  var SR = (VET*4+EXP*1)*NUMR*1;

  // 에러메세지 출력
  if(RLD == ""){
      alert("연사누적어빌을 입력해 주세요")
  }
  if(NUMR > 1){
      alert("[사관수+숙련병수+신병수]가 총수병수 보다 많습니다")
  }
  if(VET > NUM*0.45){
      alert("경고 : 사관수가 한도(총수병수의 45%)보다 많습니다")
  }

  document.getElementById("RLDIVR1").innerHTML = Math.floor(RLD*SR/PPCUT*1000)/10;
  document.getElementById("REPS1").innerHTML = Math.floor(Math.floor(REP*SR/480)/25.6)/10;

  var EXPT2 = Math.ceil(Math.sqrt(PPCUT*NUM/RLD+VET*VET*2.25)-VET*2.5);
  if(NUM*1<VET*1+EXPT2*1){
      EXPT2 = NUM - VET;
  }
  var NUMR2 = (VET*1+EXPT2*1)/NUM*1;
  var SR2 = (VET*4+EXPT2)*NUMR2*1;

  document.getElementById("RLDIVR2").innerHTML = Math.floor(RLD*SR2/PPCUT*1000)/10;
  document.getElementById("VETT").innerHTML = VET;
  document.getElementById("EXPT").innerHTML = EXPT2;
  document.getElementById("REPS2").innerHTML = Math.floor(Math.floor(REP*SR2/480)/25.6)/10;
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

function get_result_guideline(){

  var POT = document.getElementById("Guideline_Calc_POTInput1").value;
  var REP = document.getElementById("Guideline_Calc_REPInput1").value;
  var NUM = document.getElementById("Guideline_Calc_NUMInput1").value;
  var VET = document.getElementById("Guideline_Calc_VETInput1").value;
  var EXP = document.getElementById("Guideline_Calc_EXPInput1").value;
  var NEW = document.getElementById("Guideline_Calc_NEWInput1").value;
  var FCS = document.getElementById("Guideline_Calc_FCSInput1").value;
  var TARGET = document.getElementById("Guideline_Calc_TargetInput1").value;

  // 수병빈혈도 계산
  var NUMR = (VET*1+EXP*1+NEW*1)/NUM*1;
  var SR = (VET*4+EXP*1)*NUMR*1;

  // 에러메세지 출력
  if(POT == ""){
      alert("잠재누적어빌을 입력해 주세요")
  }
  if(NUMR > 1){
      alert("[사관수+숙련병수+신병수]가 총수병수 보다 많습니다")
  }
  if(VET > NUM*0.45){
      alert("경고 : 사관수가 한도(총수병수의 45%)보다 많습니다")
  }
  if(FCS == ""){
      alert("FCS 기본가이드라인 길이를 입력해 주세요")
  }

  // 함장빨랫줄 계산
  document.getElementById("guideT").innerHTML = FCS*1+Math.floor(POT*SR/2000)*2;
  document.getElementById("guideFCS").innerHTML = FCS*1;
  document.getElementById("guideSailor").innerHTML = Math.floor(POT*SR/2000)*2;
  document.getElementById("GLREPS1").innerHTML = Math.floor(Math.floor(REP*SR/480)/25.6)/10;


  var TARGETS = TARGET - FCS;

  var EXPT2 = Math.ceil(Math.sqrt(TARGETS*NUM*1000/POT+VET*VET*2.25)-VET*2.5);
  if(NUM*1<VET*1+EXPT2*1){
      EXPT2 = NUM - VET;
  }
  var NUMR2 = (VET*1+EXPT2*1)/NUM*1;
  var SR2 = (VET*4+EXPT2)*NUMR2*1;

  document.getElementById("guideT2").innerHTML = FCS*1+Math.floor(POT*SR2/2000)*2;
  document.getElementById("GLVETT").innerHTML = VET;
  document.getElementById("GLEXPT").innerHTML = EXPT2;
  document.getElementById("GLREPS2").innerHTML = Math.floor(Math.floor(REP*SR2/480)/25.6)/10;

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
  document.getElementById("Ship_Calc_VETInput"+index).value = document.getElementById("VET45").innerHTML;
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


function Get_Result_Ship_Calc(){

  var POTabil = new Array(14);
  var REPabil = new Array(14);
  var ENGabil = new Array(14);
  var Sailor_TYPE = new Array(14);
  var Sailor_NUM = new Array(14);
  var Sailor_VET = new Array(14);
  var Sailor_amenia = new Array(14);

  for(i=0; i<14; i++){
    POTabil[i] = document.getElementById("Ship_Calc_POTInput"+(i+1)).value;
    REPabil[i] = document.getElementById("Ship_Calc_REPInput"+(i+1)).value;
    ENGabil[i] = document.getElementById("Ship_Calc_ENGInput"+(i+1)).value;
    Sailor_TYPE[i] = document.getElementById("Ship_Calc_SailorType"+(i+1)).innerHTML;
    Sailor_NUM[i] = document.getElementById("Ship_Calc_NUMInput"+(i+1)).value;
    Sailor_VET[i] = document.getElementById("Ship_Calc_VETInput"+(i+1)).value;
    Sailor_amenia[i] = 1;
  }

  //함장
  var Target_Captin_Guideline = document.getElementById("Ship_Calc_TargetGuidelineInput").value - document.getElementById("Ship_Calc_FCSGuidelineInput").value;

  if(document.getElementById("Ship_Calc_Guideline_YN").checked == true){
    if(Target_Captin_Guideline*1000 < Realabil_Calc(POTabil[0],Sailor_VET[0],Sailor_NUM[0]-Sailor_VET[0],1)){
      Sailor_amenia[0] = Target_Captin_Guideline*1000 / Realabil_Calc(POTabil[0],Sailor_VET[0],Sailor_NUM[0]-Sailor_VET[0],1);
    }
  }

  //수리속도 계산
  var REPtotal = 0;
  var outputindex = 0;
  for(i=0; i<REPabil.length; i++){
    if(REPabil[i] > 0){
      outputindex = i + 1 ;
      document.getElementById("Ship_Calc_RepairSpeed_Output"+outputindex).innerHTML = KR_RepairSpeed_calc(Realabil_Calc(REPabil[i],Sailor_VET[i],Sailor_NUM[i]-Sailor_VET[i],Sailor_amenia[i]));
      REPtotal = REPtotal + Realabil_Calc(REPabil[i],Sailor_VET[i],Sailor_NUM[i]-Sailor_VET[i],Sailor_amenia[i]);
    }
  }

  //기관 계산
  var ENGTotal = 0;
  var ENGCount = 0;
  var ENGSeamanTotal = 0;
  var ENGSeamanCount = 0;
  for(i=0; i<ENGabil.length; i++){
    
    if(ENGabil[i] > 0){
      if(Sailor_TYPE[i] == "갑판병"){
        ENGSeamanTotal = ENGSeamanTotal + Math.floor(ENGabil[i]/21);
        ENGSeamanCount = ENGSeamanCount + 1;
      }
      if(Sailor_TYPE[i] == "기관병" && i > 4){
        outputindex = i + 1 ;
        document.getElementById("Ship_Calc_OverheatTime_Output"+outputindex).innerHTML = KR_OverheatTime_calc(Realabil_Calc(ENGabil[i],Sailor_VET[i],Sailor_NUM[i]-Sailor_VET[i],Sailor_amenia[i]));
        document.getElementById("Ship_Calc_OverheatRate_Output"+outputindex).innerHTML = KR_OverheatRate_calc(Realabil_Calc(ENGabil[i],Sailor_VET[i],Sailor_NUM[i]-Sailor_VET[i],Sailor_amenia[i]));
        ENGTotal = ENGTotal + Realabil_Calc(ENGabil[i],Sailor_VET[i],Sailor_NUM[i]-Sailor_VET[i],Sailor_amenia[i]);
        ENGCount = ENGCount + 1;
      }
    }
  }

  if(ENGCount > 0){
    var ENGPenaltyTotal = ENGTotal / Math.sqrt(ENGCount);
  }

  if(ENGSeamanCount > 0){
    var Ship_ENGSeamanRate = Math.floor( ENGSeamanTotal / Math.sqrt(ENGSeamanCount) );
    ENGTotal = ENGTotal * ( 1 + Ship_ENGSeamanRate/100);
  }

  document.getElementById("Ship_Calc_OverheatSpeed_Output").innerHTML = KR_OverheatSpeed_calc(document.getElementById("Ship_Calc_ShipBasicSpeed_Input").value,KR_OverheatRate_calc(ENGPenaltyTotal),document.getElementById("Ship_Calc_Ship_BasicOverheatRate_Input").value,document.getElementById("Ship_Calc_Engine_OverheatRate_Input").value);
  document.getElementById("Ship_Calc_OverheatTime_Output").innerHTML = Math.floor(document.getElementById("Ship_Calc_Engine_OverheatTime_Input").value * 0.8) + KR_OverheatTime_calc(ENGTotal);
  document.getElementById("Ship_Calc_RepairSpeed_Output").innerHTML = 25 + KR_RepairSpeed_calc(REPtotal);
}

function Realabil_Calc_AutoInput(index){
  document.getElementById("Realabil_Calc_POT_Input"+index).value = document.getElementById("POTTotal").innerHTML;
  document.getElementById("Realabil_Calc_ACC_Input"+index).value = document.getElementById("ACCTotal").innerHTML;
  document.getElementById("Realabil_Calc_RLD_Input"+index).value = document.getElementById("RLDTotal").innerHTML;
  document.getElementById("Realabil_Calc_TOR_Input"+index).value = document.getElementById("TORTotal").innerHTML;
  document.getElementById("Realabil_Calc_REP_Input"+index).value = document.getElementById("REPTotal").innerHTML;
  document.getElementById("Realabil_Calc_ENG_Input"+index).value = document.getElementById("ENGTotal").innerHTML;
  document.getElementById("Realabil_Calc_FIG_Input"+index).value = document.getElementById("FIGTotal").innerHTML;
  document.getElementById("Realabil_Calc_BOM_Input"+index).value = document.getElementById("BOMTotal").innerHTML;
  document.getElementById("Realabil_Calc_NUM_Input"+index).value = document.getElementById("NUMTotal").innerHTML;
  document.getElementById("Realabil_Calc_VET_Input"+index).value = document.getElementById("VET45").innerHTML;
  document.getElementById("Realabil_Calc_EXP_Input"+index).value = document.getElementById("NUMTotal").innerHTML - document.getElementById("VET45").innerHTML;
}

function Get_Result_Realabil_Calc(){
  var AbilIndex = [
    ["잠재", "POT"],
    ["명중", "ACC"],
    ["연사", "RLD"],
    ["어뢰", "TOR"],
    ["수리", "REP"],
    ["기관", "ENG"],
    ["전투", "FIG"],
    ["폭격", "BOM"],
    ];
  var SailorIndex = [
    ["수병수", "NUM"],
    ["사관", "VET"],
    ["숙련병", "EXP"],
    ["신병", "NEW"],
    ];

  //수병가져오기
  var Sailortotal = new Array(4);
  for (i = 0; i < Sailortotal.length; i++){
    Sailortotal[i] = new Array(5);
  }
  for (i = 0; i < Sailortotal.length; i++){
    Sailortotal[i][0] = document.getElementById("Realabil_Calc_"+SailorIndex[i][1]+"_Input1").value;
    Sailortotal[i][1] = document.getElementById("Realabil_Calc_"+SailorIndex[i][1]+"_Input2").value;
  }
  for (i = 0; i < 2; i++){
    Sailortotal[3][i+2] = Math.round((Sailortotal[1][i]*1+Sailortotal[2][i]*1+Sailortotal[3][i]*1)/Sailortotal[0][i]*1000)/10;
    Sailortotal[2][i+2] = Math.round(Sailortotal[2][i]*1 * Sailortotal[3][i+2]/100);
    Sailortotal[1][i+2] = Math.round(Sailortotal[1][i]*4 * Sailortotal[3][i+2]/100);
    Sailortotal[0][i+2] = Sailortotal[2][i+2]*1 + Sailortotal[1][i+2]*1;
  }
  for (i = 0; i < Sailortotal.length; i++){
    if(Sailortotal[i][2] > 0){
      Sailortotal[i][4] = Math.floor(Sailortotal[i][3]/Sailortotal[i][2]*100*10)/10;
    }
    else{
      Sailortotal[i][4] = "-";
    }
  }


  //어빌가져오기
  var Abiltotal = new Array(8);
  for (i = 0; i < Abiltotal.length; i++){
    Abiltotal[i] = new Array(5);
  }
  for (i = 0; i < Abiltotal.length; i++){
    Abiltotal[i][0] = document.getElementById("Realabil_Calc_"+AbilIndex[i][1]+"_Input1").value;
    Abiltotal[i][1] = document.getElementById("Realabil_Calc_"+AbilIndex[i][1]+"_Input2").value;
    Abiltotal[i][2] = Math.round( Abiltotal[i][0] * Sailortotal[0][2] );
    Abiltotal[i][3] = Math.round( Abiltotal[i][1] * Sailortotal[0][3] );
    if(Abiltotal[i][2] > 0){
      Abiltotal[i][4] = Math.floor(Abiltotal[i][3]/Abiltotal[i][2]*100*10)/10;
    }
    else{
      Abiltotal[i][4] = "-";
    }
  }


  //계산결과 출력
  for (i = 0; i < Abiltotal.length; i++){
    document.getElementById("Realabil_Calc_"+AbilIndex[i][1]+"_Output1").innerHTML = Abiltotal[i][2];
    document.getElementById("Realabil_Calc_"+AbilIndex[i][1]+"_Output2").innerHTML = Abiltotal[i][3];
    document.getElementById("Realabil_Calc_"+AbilIndex[i][1]+"Rate_Output").innerHTML = Abiltotal[i][4]+"%";
  }
  for (i = 0; i < Sailortotal.length; i++){
    if(i < Sailortotal.length -1 ){
      document.getElementById("Realabil_Calc_"+SailorIndex[i][1]+"_Output1").innerHTML = Sailortotal[i][2];
      document.getElementById("Realabil_Calc_"+SailorIndex[i][1]+"_Output2").innerHTML = Sailortotal[i][3];
      document.getElementById("Realabil_Calc_"+SailorIndex[i][1]+"Rate_Output").innerHTML = Sailortotal[i][4]+"%";
    }
    else{
      document.getElementById("Realabil_Calc_"+SailorIndex[i][1]+"_Output1").innerHTML = Sailortotal[i][2]+"%";
      document.getElementById("Realabil_Calc_"+SailorIndex[i][1]+"_Output2").innerHTML = Sailortotal[i][3]+"%";
      document.getElementById("Realabil_Calc_"+SailorIndex[i][1]+"Rate_Output").innerHTML = "← 수병빈혈도";
    }
  }
}

