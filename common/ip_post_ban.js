$(document).ready(function () {
  ip_post();
  ip_ban();
});


/* function ip_post() {
  const IPapiURL = "https://api.ipify.org/?format=json";
  
  $.getJSON(IPapiURL, function(data) {
    var visitorIP = data.ip;
    var postURL = "https://script.google.com/macros/s/AKfycby0bB4u2olmoKtF7uoEmvHP75RmEmzzECLZFd6P9bs_RU4xJnXErbHxdZwOXUEwP0oUhg/exec";
    
    $.post(postURL, { ip: visitorIP })
      .done(function() {
        console.log("POST 요청 성공");
      })
      .fail(function(error) {
        console.error(error);
      });
  })
  .fail(function(error) {
    console.error(error);
  });
}
 */

function ip_post() {
  const IPapiURLs = [
    "https://api.ipify.org/?format=json&ipv=4",
    "https://ipinfo.io/json",
    "https://api.db-ip.com/v2/free/self",
    "https://ipv4.icanhazip.com/",
    "https://ipv4.wtfismyip.com/text",
  ];

  const postURL = "https://script.google.com/macros/s/AKfycbzJMjbx7zJJ3IAF2G4KpLgigjJyUGz6XN3cD3SAx0H7SYAnzWj2KnvWJcFKdZtXI1Zv9g/exec";

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
    "123.248.0.3-123.248.255.3",
    //빌런 - 마카오
    "220.86.60.1-220.86.60.1",
    //빌런 - 182.237 유동 2023.03.12 / https://gall.dcinside.com/board/view/?id=nf&no=368074
    "182.237.0.1-182.237.255.255",

  ];

  // 방문자 IP 주소 배열을 가져옵니다.
  const IPapiURLs = [
    "https://api.ipify.org/?format=json&ipv=4",
    "https://ipinfo.io/json",
    "https://api.db-ip.com/v2/free/self",
    "https://ipv4.icanhazip.com/",
    "https://ipv4.wtfismyip.com/text",
  ];

  // 복수 IP 주소를 반복하여 블록합니다.
  $.each(IPapiURLs, function (index, IPapiURL) {
    $.getJSON(IPapiURL, function (data) {
      var visitorIP = data.ip || data.ip_address || data.ipAddress || data.query || data;

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
          window.location.href = REDIRECT_URL;
          return false;
        }
      });
    });
  });

}