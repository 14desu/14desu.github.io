$(document).ready( function() {
  ip_post();
  ip_ban();
});

function ip_post(){

  // 방문자의 IP를 가져오는 API URL
  const IPapiURL = "https://api.ipify.org/?format=json";

  // 방문자 IP 주소를 가져옵니다.
  $.getJSON(IPapiURL, function(data) {

      var visitorIP = data.ip;

      // 방문자의 IP를 구글 스프레드시트에 POST하는 API URL
      var postURL = "https://script.google.com/macros/s/AKfycbxCmtc1qZ23SiaHXspr8-AUidOVflZlgk9VuRdVfI3j0ieS10P1Pm8T-9z4BuXR1Eqt/exec?ip=" + visitorIP;
      
      // POST 요청 보내기
      $.ajax({
          url: postURL,
          method: "POST",
          success: function(response) {
              console.log("POST 요청 성공: " + response);
          },
          error: function(xhr, status, error) {
              console.log("POST 요청 실패: " + error);
          },
          async: true, // 비동기 설정 추가
      });
  });
}

function ip_ban(){

  // 리디렉션할 URL
  const REDIRECT_URL = "https://gall.dcinside.com/mini/board/view/?id=nf&no=27";
  // 방문자의 IP를 가져오는 API URL
  const IPapiURL = "https://api.ipify.org/?format=json";
  
  // 복수 IP 범위를 배열로 선언합니다.
  var blockedIPRanges = [
      //실험
      //"133.32.135.132-133.32.135.132",
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
  
      //빌런 - 청풍
      "123.248.0.0-123.248.255.255",
      //빌런 - 마카오
      "220.86.0.0-220.86.255.255",
      ];
  
    // 방문자 IP 주소를 가져옵니다.
    fetch(IPapiURL)
    .then(response => response.json())
    .then(data => {
        var visitorIP = data.ip;

        // IP 주소를 숫자 배열로 변환합니다.
        var visitorIPArray = visitorIP.split('.').map(Number);

        // 복수 IP 범위를 반복하여 블록합니다.
        blockedIPRanges.forEach(blockedIPRange => {
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
            window.location.href = REDIRECT_URL;
            return false;
        }
        });
    })
    .catch(error => {
        console.error('IP 정보를 가져오는데 실패했습니다.');
        console.error(error);
    });
}
