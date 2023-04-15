function Realabil_Calc(abil,vet,exp,amenia){
  return abil * (vet * 4 + exp) * amenia;
}

function KR_RepairSpeed_calc(realabil){
  return Math.floor(Math.floor(realabil/480)/25.6)/10;
}

function kr_guideline_calc(realabil){
  return Math.floor(realabil/2000)*2 + $("#FCS_Guideline_Input").val()*1;
}

function Global_RepairSpeed_calc(realabil){
  return Math.floor(realabil/13630)/10;
}

function KR_RestoreRate_calc(realabil){
  return Math.floor(Math.floor(realabil/480)/16);
}

function Global_RestoreRate_calc(realabil){
  return Math.floor(realabil/8537);
}

function Global_GunReloadCap_calc(realabil){
  return Math.floor(realabil/1950)/10;
}

function KR_OverheatTime_calc(realabil){
  return Math.round(realabil/10000)/10;
}

function KR_OverheatRate_calc(realabil){
  return Math.floor(Math.floor(realabil/8000)/2)/10;
}

function KR_OverheatSpeed_calc(Ship_BasicSpeed,Sailor_Overheat_Rate,Ship_Overheat_Rate,Engine_Overheat_Rate){
  return Math.floor( Ship_BasicSpeed * ( 1 + Sailor_Overheat_Rate/100 + Ship_Overheat_Rate/100*Engine_Overheat_Rate/100) * 10 ) / 10;
}

function KR_SonarRange_calc(realabil){
  return Math.floor(realabil/3000)/10;
}

function KR_OxyTier_calc(realabil){
  return Math.floor(realabil/250000);
}

function KR_OxyCharge_calc(oxytier){
  if(oxytier > 3)       { return Math.floor(oxytier*25*0.122+30); }
  else if(oxytier = 3)  { return 36; }
  else if(oxytier = 2)  { return 32; }
  else if(oxytier = 1)  { return "no data";  }
  else if(oxytier = 0)  { return 12;  }
}

function KR_OxyTime_calc(SubmarinOxyTank,OxyCharge){
  return Math.ceil(SubmarinOxyTank/OxyCharge)*24/25;
}

function KR_AvgReloadTime_calc(ReloadTier){
  var GunReloadTime = $("#Gun_Reloadtime_Input").val() * $("#gun_enforce_input").val();
  return Math.round(Math.floor(GunReloadTime*25*0.01*(101 - ReloadTier))*1.3 + 1.87)/25;
}

function KR_RealReloadTime_calc(AvgReloadtime){
  var AvgReloadtimeFrame = Math.round(AvgReloadtime*25);
  var ReloadQuotion = Math.floor(AvgReloadtimeFrame/6)*6/25;
  var ReloadRemainder = Math.round(AvgReloadtimeFrame - ReloadQuotion*25);
  if (ReloadRemainder == 0)  { return ReloadQuotion; }
  else if (ReloadRemainder == 1 || ReloadRemainder == 5 ){ return ReloadQuotion + " x" + (6-ReloadRemainder) + "<br>" + Math.round(ReloadQuotion*25+6)/25 + " x" + ReloadRemainder; }
  else if (ReloadRemainder == 2 || ReloadRemainder == 4 ){ return ReloadQuotion + " x" + (6-ReloadRemainder)/2 + "<br>" + Math.round(ReloadQuotion*25+6)/25 + " x" + ReloadRemainder/2; }
  else if (ReloadRemainder == 3 ){ return ReloadQuotion + " x" + (6-ReloadRemainder)/3 + "<br>" + Math.round(ReloadQuotion*25+6)/25 + " x" + ReloadRemainder/3; }
}

function KR_TorpedoReloadTime_calc(TorpedoTier){
  if(TorpedoTier>0){
    var TorpedoReloadTime = document.getElementById("Torpedo_Reloadtime_Input").value;
    return (Math.ceil(TorpedoReloadTime*25*0.01*(100 - TorpedoTier)/6+ 0.1)+1)*6/25;
  }
  if(TorpedoTier="-"){
    return "-";
  }
}
