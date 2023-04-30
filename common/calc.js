var kr_reload_tiercut_data = [];

function kr_gun_reload_api() {

  const kr_gun_reload_api_url = "https://script.google.com/macros/s/AKfycbw3hnJeu0hTgLTatg1JbBONJ3R3GQNzvzNW16TYpoBHzhOKyQmgewQZ5H3cS-KY1Cf-/exec";

  fetch(kr_gun_reload_api_url)
    .then(response => response.json())
    .then(data => {
      kr_reload_tiercut_data = data["data"]["kr_gun_reloadcut"];
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
}

$(document).ready(function () {
  kr_gun_reload_api();
});

const kr_torpedo_tier_data = [
  ["-", 0, 3761097],
  [90, 3761097, 4562019],
  [92, 4563357, 5762180],
  [94, 5762746, 7695914],
  [96, 7784227, 10564236],
];

function get_result_sailor() {

  if (ip_bancheck_status) {
    alert("정상적인 접근이 아닙니다")
    window.location.href = REDIRECT_URL;
    return false;
  }

  const sailor_calc_api_url = "https://script.google.com/macros/s/AKfycbykbttF_KVQpDaShXtmvIv0zfw7VPD64G7xzgVG7GB7NQvQx5Qb25Ku88SHjOw_8jvHwA/exec?input=" + $("#nation_sel").val() + " - " + $("#tree_sel").val();

  let treedata = [];
  let abildata = [];

  $.getJSON(sailor_calc_api_url, function (response) {

    treedata = response["data"]["sailortree"];
    abildata = response["data"]["sailorabil"];

    //abildata 값으로 검색된 전직횟수 판정
    let tree_n = 0;
    for (i = 0; i < treedata.length; i++) {
      if (abildata[i][0] > 0) {
        tree_n = tree_n + 1;
      }
    }

    //판정한 전직횟수로 배열길이 조정
    treedata.length = tree_n;
    abildata.length = tree_n;

    //늦직입력분 반영
    var treelev = new Array(tree_n);

    //수병트리/전직Lv정보 output
    $(".treeoutputrow").hide();
    for (i = 0; i < tree_n; i++) {
      $("#tree" + [i+1] + "output").show();
      $("#tree_" + [i+1]).html(treedata[i]);
      $("#tree_" + [i+1] + "LV").html(abildata[i][0]);
      treelev[i] = $("#job_change_level_input" + [i+1]).val();
    }

    //입력Lv체크 알람
    if ($("#LEVIP").val() > 120 && $("#server_input").val() == "Korea_server") {
      alert("수병Lv은 120을 넘을 수 없습니다")
      $("#LEVIP").val(120);
    }
    else if ($("#LEVIP").val() > 125 && $("#server_input").val() == "Global_server") {
      alert("수병Lv은 125을 넘을 수 없습니다")
      $("#LEVIP").val(125);
    }

    //입력Lv가져오기
    let levinput = $("#LEVIP").val();

    let AbilIndex = [
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
    for (i = 0; i < AbilIndex.length; i++) {
      if (i < 11) {
        abilgrowth[i] = document.getElementById(AbilIndex[i][1] + "IP").value;
      }
      else if (i = 11) {
        abilgrowth[i] = 5;
      }
    }

    var abilcalc = Array.from(Array(tree_n), () => Array(12).fill(0));
    var abiltotal = [27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 55];

    // Lv1 초기누적어빌 반영 *플미/개근/전설 > 초기30
    for (i = 0; i < 11; i++) {
      if (abilgrowth[i] == 14 && i != 0) {
        abiltotal[i] = 30;
        if (i == 1 || i == 2) {
          abiltotal[1] = 30;
          abiltotal[2] = 30;
        }
      }
      else if (abilgrowth[i] == 17 && i == 0) {
        abiltotal[i] = 30;
      }
      else if ($("#Sailor_AutoInput").val() == "개근" || $("#Sailor_AutoInput").val() == "전설보조" || $("#Sailor_AutoInput").val() == "전설특무") {
        abiltotal[i] = abiltotal[i] + (abilgrowth[i] - 9) * (89);
        abilgrowth[i] = 9;
      }
    }

    //강화여부체크 > 적용
    for (i = 0; i < AbilIndex.length; i++) {
      if ($("#boost_input").val() == AbilIndex[i][1] + "boost" + 1) {
        abilgrowth[i] = abilgrowth[i] * 1 + 1;
        abiltotal[i] = abiltotal[i] * 1 + 1;
      }
      if ($("#boost_input").val() == AbilIndex[i][1] + "boost" + 2) {
        abilgrowth[i] = abilgrowth[i] * 1 + 2;
        abiltotal[i] = abiltotal[i] * 1 + 2;
      }
    }

    //국가보너스 어빌 계산
    if ($("#nation_sel").val() == "미국") {
      abiltotal[9] = abiltotal[9] + 5;
    }
    else if ($("#nation_sel").val() == "영국") {
      abiltotal[5] = abiltotal[5] + 3;
      abiltotal[6] = abiltotal[6] + 3;
    }
    else if ($("#nation_sel").val() == "일본") {
      abiltotal[3] = abiltotal[3] + 2;
    }
    else if ($("#nation_sel").val() == "독일") {
      abiltotal[1] = abiltotal[1] + 4;
      abiltotal[2] = abiltotal[2] + 4;
      abiltotal[7] = abiltotal[7] + 2;
      abiltotal[9] = abiltotal[9] + 2;
    }
    else if ($("#nation_sel").val() == "프랑스") {
      abiltotal[6] = abiltotal[6] + 2;
    }
    else if ($("#nation_sel").val() == "소련") {
      abiltotal[1] = abiltotal[1] + 4;
      abiltotal[2] = abiltotal[2] + 4;
      abiltotal[7] = abiltotal[7] + 2;
      abiltotal[9] = abiltotal[9] + 2;
    }
    else if ($("#nation_sel").val() == "이탈리아") {
      abiltotal[2] = abiltotal[2] + 8;
      abiltotal[9] = abiltotal[9] + 2;
    }

    //입력초기어빌분 계산
    for (r = 0; r < 12; r++) {
      abiltotal[r] = abiltotal[r] + ((levinput * 1 - 1) * abilgrowth[r]);
    }



    for (i = 0; i < tree_n; i++) {
      if (treelev[i] == "") {
        continue;
      }
      if (abildata[i][0] > treelev[i]) {
        alert("늦직Lv은 본래의 전직Lv보다 더 높아야 합니다")
        $("#job_change_level_input" + [i+1]).val(abildata[i][0]);
      }
      if (abildata[i][0] < treelev[i]) {
        abildata[i][0] = treelev[i];
      }
    }

    //늦직입력 - 전직안하는 트리분 반영
    for (i = 1; i < tree_n; i++) {
      if (treelev[i] == "" && treelev[i - 1] != ""){
        abildata.length = i;
      }
    }

    // 수병트리영향분 계산
    for (i = 0; i < abildata.length; i++) {
      if (levinput * 1 < abildata[i][0]) {
        continue;
      }
      for (r = 0; r < 12; r++) {
        if (abildata[i][r + 1] == "") {
          abildata[i][r + 1] = 0;
        }
        abilgrowth[r] = abilgrowth[r] * 1 + abildata[i][r + 1] * 1;
        abilcalc[i][r] = abilcalc[i][r] + ((levinput * 1 - abildata[i][0] * 1) * abildata[i][r + 1]);
      }
    }

    // 입력초기어빌 + 수병트리영향분 합산
    for (i = 0; i < tree_n; i++) {
      for (r = 0; r < 12; r++) {
        abiltotal[r] = abiltotal[r] + abilcalc[i][r];
        if (abiltotal[r] < 0) {
          abiltotal[r] = 0;
        }
      }
    }

    //영국 갑판병 보너스 어빌
    if ($("#nation_sel").val() == "영국") {
      if ($("#tree_sel").val() == "갑판병") {
        for (r = 0; r < 11; r++) {
          abiltotal[r] = abiltotal[r] + 50;
        }
      }
    }

    if ($("#boost_input").val() == "boost20") {
      for (j = 0; j < 11; j++) {
        abilgrowth[j] = Math.floor(abilgrowth[j] * 1.225);
        abiltotal[j] = Math.floor(abiltotal[j] * 1.225);
      }
    }

    // 수병 성장어빌/누적어빌/수병수 계산결과 output
    for (i = 0; i < AbilIndex.length; i++) {

      //성장어빌&누적어빌
      $("#" + AbilIndex[i][1] + "Growth").html(abilgrowth[i]);
      $("#" + AbilIndex[i][1] + "Total").html(abiltotal[i]);

      if ($("#tree_sel").val() == "갑판병") {
        if (i < AbilIndex.length - 1) {
          //갑판어빌
          $("#" + AbilIndex[i][1] + "SeamanTotal").html(Math.floor(abiltotal[i] * 0.07));
          //갑판보정율
          if ($("#server_input").val() == "Korea_server") {
            $("#" + AbilIndex[i][1] + "SeamanRate").html(Math.floor(abiltotal[i] / 300));
          }
          if ($("#server_input").val() == "Global_server") {
            $("#" + AbilIndex[i][1] + "SeamanRate").html("");
          }
        }
      }
      else {
        if (i < AbilIndex.length - 1) {
          $("#" + AbilIndex[i][1] + "SeamanTotal").html("");
          $("#" + AbilIndex[i][1] + "SeamanRate").html("");
        }
      }
    }

    sailor_performance_autoip();
    sailor_performance_calc();

  }
  );
}

function get_result_reload() {
  var encoderUrl = gen_url();

  fetch(encoderUrl)
    .then(response => response.json())
    .then(response => {

      kr_reload_tiercut_data = response["data"]["reloadcut"];

      //입력초기어빌가져오기
      var reloadabilip1 = document.getElementById("Reload_Calc_RLDInput1").value * 1;
      var reloadabilip2 = document.getElementById("Reload_Calc_RLDInput2").value * 1;

      var repairabilip1 = document.getElementById("Reload_Calc_REPInput1").value * 1;
      var repairabilip2 = document.getElementById("Reload_Calc_REPInput2").value * 1;

      var sailornumip1 = document.getElementById("Reload_Calc_NUMInput1").value * 1;
      var sailornumip2 = document.getElementById("Reload_Calc_NUMInput2").value * 1;
      var vetnumip1 = document.getElementById("Reload_Calc_VETInput1").value * 1;
      var vetnumip2 = document.getElementById("Reload_Calc_VETInput2").value * 1;
      var expnumip1 = document.getElementById("Reload_Calc_EXPInput1").value * 1;
      var expnumip2 = document.getElementById("Reload_Calc_EXPInput2").value * 1;
      var newnumip1 = document.getElementById("Reload_Calc_NEWInput1").value * 1;
      var newnumip2 = document.getElementById("Reload_Calc_NEWInput2").value * 1;

      //입력Lv가져오기
      var mateip = [];
      var mate = [];
      var mate_n = 0;
      var matetotal_calc = 0;
      mateip[0] = document.getElementById("mateabil1").value * 1;
      mateip[1] = document.getElementById("mateabil2").value * 1;
      mateip[2] = document.getElementById("mateabil3").value * 1;

      for (i = 0; i < mateip.length; i++) {
        if (mateip[i] > 200) {
          alert("갑판병 어빌을 올바르게 입력하십시오")
        }
        if (mateip[i] > 0) {
          mate_n = mate_n + 1;
          mate[i] = Math.floor(mateip[i] / 21);
          matetotal_calc = matetotal_calc + mate[i];
        }
      }

      document.getElementById("maten").innerHTML = mate_n;

      var sailorratio1 = (vetnumip1 + expnumip1 + newnumip1) / (sailornumip1);
      document.getElementById("SR1").innerHTML = Math.floor(sailorratio1 * 1000) / 10;
      if (sailorratio1 > 1) {
        alert("포병1의 수병수가 사관/숙련병/신병의 합보다 많습니다")
      }
      var sailorratio2 = (vetnumip2 + expnumip2 + newnumip2) / (sailornumip2);
      document.getElementById("SR2").innerHTML = Math.floor(sailorratio2 * 1000) / 10;
      if (sailorratio2 > 1) {
        alert("포병2의 수병수가 사관/숙련병/신병의 합보다 많습니다")
      }

      //수리속도
      document.getElementById("RS1").innerHTML = Math.floor(Math.floor(repairabilip1 * (vetnumip1 * 4 + expnumip1) * sailorratio1 / 480) / 25.6) / 10;
      document.getElementById("RS2").innerHTML = Math.floor(Math.floor(repairabilip2 * (vetnumip2 * 4 + expnumip2) * sailorratio2 / 480) / 25.6) / 10;


      //연사어빌 배열준비 + 리얼어빌ip
      var reloadcalc = new Array(2);
      reloadcalc[0] = reloadabilip1 * (vetnumip1 * 4 + expnumip1) * sailorratio1;
      reloadcalc[1] = reloadabilip2 * (vetnumip2 * 4 + expnumip2) * sailorratio2;

      var reloadcalcm = new Array(2);


      if (mate_n > 0) {
        document.getElementById("matetotal").innerHTML = Math.floor(matetotal_calc / Math.sqrt(mate_n));
        reloadcalcm[0] = reloadcalc[0] * (Math.floor(matetotal_calc / Math.sqrt(mate_n)) + 100) / 100;
        reloadcalcm[1] = reloadcalc[1] * (Math.floor(matetotal_calc / Math.sqrt(mate_n)) + 100) / 100;
      }


      var reload_ip1 = document.getElementById("gunreload1").value * 1;
      var reload_ip2 = document.getElementById("gunreload2").value * 1;

      if (document.getElementById("guneh1").value == "3%연사강화") {
        reload_ip1 = reload_ip1 * 0.97;
      }
      else if (document.getElementById("guneh1").value == "9%연사강화") {
        reload_ip1 = reload_ip1 * 0.91;
      }

      if (document.getElementById("guneh2").value == "3%연사강화") {
        reload_ip2 = reload_ip2 * 0.97;
      }
      else if (document.getElementById("guneh2").value == "9%연사강화") {
        reload_ip2 = reload_ip2 * 0.91;
      }

      //연사어빌컷 구간 판정용 배열준비
      var reloadcutcalc = new Array(2);
      for (i = 0; i < reloadcutcalc.length; i++) {
        reloadcutcalc[i] = 0;
      }

      //연사구간판정
      for (i = 0; i < reloadcalc.length; i++) {
        for (j = 0; j < kr_reload_tiercut_data.length; j++) {
          if (kr_reload_tiercut_data[j] + 70 < reloadcalc[i]) {
            reloadcutcalc[i] = reloadcutcalc[i] + 1;
          }
        }
      }
      var reloadcutcalcm = new Array(2);
      for (i = 0; i < reloadcutcalcm.length; i++) {
        reloadcutcalcm[i] = 0;
      }

      //연사구간판정
      for (i = 0; i < reloadcalcm.length; i++) {
        for (j = 0; j < kr_reload_tiercut_data.length; j++) {
          if (kr_reload_tiercut_data[j] + 70 < reloadcalcm[i]) {
            reloadcutcalcm[i] = reloadcutcalcm[i] + 1;
          }
        }
      }

      //연사구간
      if (reloadcalc[0] > 0) {
        document.getElementById("RC1").innerHTML = reloadcutcalc[0];
        document.getElementById("RU1").innerHTML = Math.ceil(kr_reload_tiercut_data[reloadcutcalc[0]] / reloadcalc[0] * 100 - 100);
        if (mate_n > 0) {
          document.getElementById("RCM1").innerHTML = reloadcutcalcm[0];
        }
        if (reload_ip1 > 0) {
          document.getElementById("reloadT11").innerHTML = Math.round(Math.floor(reload_ip1 * 25 * 0.01 * (101 - reloadcutcalc[0])) * 1.3 + 1.87) / 25;
          document.getElementById("reloadTM11").innerHTML = Math.round(Math.floor(reload_ip1 * 25 * 0.01 * (101 - reloadcutcalcm[0])) * 1.3 + 1.87) / 25;
        }
        if (reload_ip2 > 0) {
          document.getElementById("reloadT21").innerHTML = Math.round(Math.floor(reload_ip2 * 25 * 0.01 * (101 - reloadcutcalc[0])) * 1.3 + 1.87) / 25;
          document.getElementById("reloadTM21").innerHTML = Math.round(Math.floor(reload_ip2 * 25 * 0.01 * (101 - reloadcutcalcm[0])) * 1.3 + 1.87) / 25;
        }
      }
      if (reloadcalc[1] > 0) {
        document.getElementById("RC2").innerHTML = reloadcutcalc[1];
        document.getElementById("RU2").innerHTML = Math.ceil(kr_reload_tiercut_data[reloadcutcalc[1]] / reloadcalc[1] * 100 - 100);
        if (mate_n > 0) {
          document.getElementById("RCM2").innerHTML = reloadcutcalcm[1];
        }
        if (reload_ip1 > 0) {
          document.getElementById("reloadT12").innerHTML = Math.round(Math.floor(reload_ip1 * 25 * 0.01 * (101 - reloadcutcalc[1])) * 1.3 + 1.87) / 25;
          document.getElementById("reloadTM12").innerHTML = Math.round(Math.floor(reload_ip1 * 25 * 0.01 * (101 - reloadcutcalcm[1])) * 1.3 + 1.87) / 25;
        }
        if (reload_ip2 > 0) {
          document.getElementById("reloadT22").innerHTML = Math.round(Math.floor(reload_ip2 * 25 * 0.01 * (101 - reloadcutcalc[1])) * 1.3 + 1.87) / 25;
          document.getElementById("reloadTM22").innerHTML = Math.round(Math.floor(reload_ip2 * 25 * 0.01 * (101 - reloadcutcalcm[1])) * 1.3 + 1.87) / 25;
        }
      }

    }
    );
}

function get_result_pompom() {

  var RLD = document.getElementById("Pompom_Reload_Calc_RLDInput1").value;
  var REP = document.getElementById("Pompom_Reload_Calc_REPInput1").value;
  var NUM = document.getElementById("Pompom_Reload_Calc_NUMInput1").value;
  var VET = document.getElementById("Pompom_Reload_Calc_VETInput1").value;
  var EXP = document.getElementById("Pompom_Reload_Calc_EXPInput1").value;
  var NEW = document.getElementById("Pompom_Reload_Calc_NEWInput1").value;
  var PPCUT = 2710070;

  // 수병빈혈도 계산
  var NUMR = (VET * 1 + EXP * 1 + NEW * 1) / NUM * 1;
  var SR = (VET * 4 + EXP * 1) * NUMR * 1;

  // 에러메세지 출력
  if (RLD == "") {
    alert("연사누적어빌을 입력해 주세요")
  }
  if (NUMR > 1) {
    alert("[사관수+숙련병수+신병수]가 총수병수 보다 많습니다")
  }
  if (VET > NUM * 0.45) {
    alert("경고 : 사관수가 한도(총수병수의 45%)보다 많습니다")
  }

  document.getElementById("RLDIVR1").innerHTML = Math.floor(RLD * SR / PPCUT * 1000) / 10;
  document.getElementById("REPS1").innerHTML = Math.floor(Math.floor(REP * SR / 480) / 25.6) / 10;

  var EXPT2 = Math.ceil(Math.sqrt(PPCUT * NUM / RLD + VET * VET * 2.25) - VET * 2.5);
  if (NUM * 1 < VET * 1 + EXPT2 * 1) {
    EXPT2 = NUM - VET;
  }
  var NUMR2 = (VET * 1 + EXPT2 * 1) / NUM * 1;
  var SR2 = (VET * 4 + EXPT2) * NUMR2 * 1;

  document.getElementById("RLDIVR2").innerHTML = Math.floor(RLD * SR2 / PPCUT * 1000) / 10;
  document.getElementById("VETT").innerHTML = VET;
  document.getElementById("EXPT").innerHTML = EXPT2;
  document.getElementById("REPS2").innerHTML = Math.floor(Math.floor(REP * SR2 / 480) / 25.6) / 10;
}

function get_result_guideline() {

  var POT = document.getElementById("Guideline_Calc_POTInput1").value;
  var REP = document.getElementById("Guideline_Calc_REPInput1").value;
  var NUM = document.getElementById("Guideline_Calc_NUMInput1").value;
  var VET = document.getElementById("Guideline_Calc_VETInput1").value;
  var EXP = document.getElementById("Guideline_Calc_EXPInput1").value;
  var NEW = document.getElementById("Guideline_Calc_NEWInput1").value;
  var FCS = document.getElementById("Guideline_Calc_FCSInput1").value;
  var TARGET = document.getElementById("Guideline_Calc_TargetInput1").value;

  // 수병빈혈도 계산
  var NUMR = (VET * 1 + EXP * 1 + NEW * 1) / NUM * 1;
  var SR = (VET * 4 + EXP * 1) * NUMR * 1;

  // 에러메세지 출력
  if (POT == "") {
    alert("잠재누적어빌을 입력해 주세요")
  }
  if (NUMR > 1) {
    alert("[사관수+숙련병수+신병수]가 총수병수 보다 많습니다")
  }
  if (VET > NUM * 0.45) {
    alert("경고 : 사관수가 한도(총수병수의 45%)보다 많습니다")
  }
  if (FCS == "") {
    alert("FCS 기본가이드라인 길이를 입력해 주세요")
  }

  // 함장빨랫줄 계산
  document.getElementById("guideT").innerHTML = FCS * 1 + Math.floor(POT * SR / 2000) * 2;
  document.getElementById("guideFCS").innerHTML = FCS * 1;
  document.getElementById("guideSailor").innerHTML = Math.floor(POT * SR / 2000) * 2;
  document.getElementById("GLREPS1").innerHTML = Math.floor(Math.floor(REP * SR / 480) / 25.6) / 10;


  var TARGETS = TARGET - FCS;

  var EXPT2 = Math.ceil(Math.sqrt(TARGETS * NUM * 1000 / POT + VET * VET * 2.25) - VET * 2.5);
  if (NUM * 1 < VET * 1 + EXPT2 * 1) {
    EXPT2 = NUM - VET;
  }
  var NUMR2 = (VET * 1 + EXPT2 * 1) / NUM * 1;
  var SR2 = (VET * 4 + EXPT2) * NUMR2 * 1;

  document.getElementById("guideT2").innerHTML = FCS * 1 + Math.floor(POT * SR2 / 2000) * 2;
  document.getElementById("GLVETT").innerHTML = VET;
  document.getElementById("GLEXPT").innerHTML = EXPT2;
  document.getElementById("GLREPS2").innerHTML = Math.floor(Math.floor(REP * SR2 / 480) / 25.6) / 10;

}

function Get_Result_Ship_Calc() {

  if (ip_bancheck_status) {
    alert("정상적인 접근이 아닙니다")
    window.location.href = REDIRECT_URL;
    return false;
  }

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
    var Ship_ENGSeamanRate = Math.floor(ENGSeamanTotal / Math.sqrt(ENGSeamanCount));
    ENGTotal = ENGTotal * (1 + Ship_ENGSeamanRate / 100);
  }

  if (ENGCount > 0) {
    var ENGPenaltyTotal = ENGTotal / Math.sqrt(ENGCount);
  }

  document.getElementById("Ship_Calc_OverheatSpeed_Output").innerHTML = KR_OverheatSpeed_calc(document.getElementById("Ship_Calc_ShipBasicSpeed_Input").value, KR_OverheatRate_calc(ENGPenaltyTotal), document.getElementById("Ship_Calc_Ship_BasicOverheatRate_Input").value, document.getElementById("Ship_Calc_Engine_OverheatRate_Input").value);
  document.getElementById("Ship_Calc_OverheatTime_Output").innerHTML = Math.floor(document.getElementById("Ship_Calc_Engine_OverheatTime_Input").value * 0.8) + KR_OverheatTime_calc(ENGTotal);
  document.getElementById("Ship_Calc_RepairSpeed_Output").innerHTML = 25 + KR_RepairSpeed_calc(REPtotal);
  document.getElementById("Ship_Calc_Seaman_CorrectionRate_Output").innerHTML = Ship_ENGSeamanRate;

}

function Get_Result_Realabil_Calc() {

  if (ip_bancheck_status) {
    alert("정상적인 접근이 아닙니다")
    window.location.href = REDIRECT_URL;
    return false;
  }

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