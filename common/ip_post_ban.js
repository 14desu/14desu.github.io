
var ip_bancheck_status = false;

$(document).ready(function () {
  ip_post();
  ip_ban();
});


function ip_post() {
  const IPapiURLs = [
    "https://api.ipify.org/?format=json&ipv=4",
    "https://ip-api.io/api/json",
    "https://api.db-ip.com/v2/free/self",
  ];

  const postURL = "https://script.google.com/macros/s/AKfycby8HcB-VUlxlFwzFqjF2cjrZxqvWsDTg-go8O0OzWvRv54nwMZfsuPNTd5VHtfz4Nc/exec";

  tryAPI(0);

  function tryAPI(apiIndex) {
    if (apiIndex >= IPapiURLs.length) {
      console.error("모든 API에 접속할 수 없습니다.");
      return;
    }

    $.getJSON(IPapiURLs[apiIndex])
      .done(function (data) {
        var visitorIP = data.ip || data.ip_address || data.ipAddress || data.query || data;
        $.post(postURL, { ip: visitorIP })
          .done(function () {
            console.log("POST 요청 성공");
          })
          .fail(function (error) {
            console.error(error);
          });
      })
      .fail(function (error) {
        console.error(error);
        tryAPI(apiIndex + 1);
      });
  }
}


function ip_ban() {

  // 리디렉션할 URL
  const REDIRECT_URL = "https://gall.dcinside.com/mini/board/view/?id=nf&no=27";

  // 복수 IP 범위를 배열로 선언합니다.
  var blockedIPRanges = [

    //실험
    //"133.32.135.132-133.32.136.132",
/* 
    //SKT 3G
    "211.234.128.0-211.234.239.255",
    //SKT 3G+4G
    "203.226.192.0-203.226.252.255",
    //SKT 4G
    "27.160.0.0-27.183.255.255",
    //SKT 4G+5G
    "223.32.0.0-223.63.255.255",
    //KT 3G+4G+5G
    "39.7.0.0-39.7.255.255",
    "110.70.0.0-110.70.255.255",
    //KT 3G+4G
    "175.223.0.0-175.223.255.255",
    "211.246.0.0-211.246.255.255",
    //KT 4G+5G
    "118.235.0.0-118.235.255.255",
    //LGU+ 3G
    "61.43.0.0-61.43.255.255",
    "211.234.0.0-211.234.95.255",
    //LGU+ 4G
    "106.102.0.0-106.102.255.255",
    "117.111.0.0-117.111.255.255",
    "211.36.128.0-211.36.159.255",
    "211.36.224.0-211.36.255.255",
    //LGU+ 5G
    "106.101.0.0-106.101.255.255",
 */

    //VPN
    "168.119.0.0-168.119.255.255", //DE
    "50.18.0.0-50.18.255.255", //US
    "74.125.0.0-74.125.255.255", //US
    "66.249.0.0-66.249.255.255", //US 182.222와 연관가능성
    "195.154.0.0-195.154.255.255", //FR
    "192.42.0.0-192.42.255.255", //NL

    "123.248.0.3-123.248.255.3", //청풍
    "220.86.60.1-220.86.60.1", //마카오
    "210.90.0.0-210.90.255.255", //몬스터쉽 https://www.navyfield.co.kr:444/board/view.asp?Num=424296&Sort=A01
    
    "220.119.0.1-220.119.255.255", //빌런 - 220.119 유동 2023.03.06 / https://gall.dcinside.com/board/view/?id=nf&no=368046
    "182.218.0.1-182.218.255.255", //빌런 - 182.218 유동 2023.03.09 / https://gall.dcinside.com/board/view/?id=nf&no=368043
    "182.237.0.1-182.237.255.255", //빌런 - 182.237 유동 2023.03.12 / https://gall.dcinside.com/board/view/?id=nf&no=368074
    "117.111.0.0-117.111.255.255",
    "61.75.0.0-61.75.255.255", //빌런 - 117.111 → 61.75 유동닉ㅇ 2023.03.12 / https://gall.dcinside.com/board/view/?id=nf&no=368081 https://gall.dcinside.com/board/view/?id=nf&no=368063
    "59.22.0.0-59.22.255.255", //빌런 - 59.22 유동 2022.11.10 / https://gall.dcinside.com/board/view/?id=nf&no=367609
    "61.99.0.0-61.99.255.255", //빌런 - 61.99 유동 2023.03.12 / https://gall.dcinside.com/board/view/?id=nf&no=368074 https://gall.dcinside.com/board/view/?id=nf&no=367609
    "1.216.0.0-1.216.255.255", //빌런 - 1.216 유동 2023.03.08 / https://gall.dcinside.com/board/view/?id=nf&no=368063
    "182.222.3.0-182.222.3.255", //빌런 - 182.222 유동/새벽4:49 어그로 2023.03.19 / https://gall.dcinside.com/board/view/?id=nf&no=368094

  ];

  // 방문자 IP 주소 배열을 가져옵니다.
  const IPapiURLs = [
    "https://api.ipify.org/?format=json&ipv=4",
    "https://ip-api.io/api/json",
    "https://api.db-ip.com/v2/free/self",
  ];

  // 복수 IP 주소를 반복하여 블록합니다.
  $.each(IPapiURLs, function (index, IPapiURL) {
    $.getJSON(IPapiURL, function (data) {
      var visitorIP = data.query || data.ip || data.ip_address || data.ipAddress || data;
  
      if(IPapiURL == "https://ip-api.io/api/json"){
        if ( data.suspiciousFactors.isProxy || data.suspiciousFactors.isTorNode) {
          alert("정상적인 접근이 아닙니다")
          ip_bancheck_status = true;
          window.location.href = REDIRECT_URL;
          return false;
        }
      }
  
      // IP 주소를 숫자 배열로 변환합니다.
      var visitorIPArray = visitorIP.split('.').map(Number);

      // 복수 IP 범위를 반복하여 블록합니다.
      $.each(blockedIPRanges, function (index, blockedIPRange) {
        var blockedIPRangeArray = blockedIPRange.split('-');

        // 시작 IP 주소와 끝 IP 주소를 숫자 배열로 변환합니다.
        var startIPArray = blockedIPRangeArray[0].split('.').map(Number);
        var endIPArray = blockedIPRangeArray[1].split('.').map(Number);

        // 방문자 IP 주소가 블록된 IP 범위에 속하는지 확인합니다.
        var isBlocked = true;
        for (var i = 0; i < 4; i++) {
          if (visitorIPArray[i] < startIPArray[i] || visitorIPArray[i] > endIPArray[i]) {
            isBlocked = false;
            break;
          }
        }

        // 만약 블록된 IP 범위에 속하는 경우 페이지를 리로드하지 않고 경고창을 띄웁니다.
        if (isBlocked) {
          alert("정상적인 접근이 아닙니다")
          ip_bancheck_status = true;
          window.location.href = REDIRECT_URL;
          return false;
        }
        
      });

    });

  });
  
}