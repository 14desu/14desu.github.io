
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

function active_user_ip_post() {
  const IPapiURLs = [
    "https://api.ipify.org/?format=json&ipv=4",
    "https://ip-api.io/api/json",
    "https://api.db-ip.com/v2/free/self",
  ];

  const postURL = "https://script.google.com/macros/s/AKfycbzdQXog9jC80qvzs3gqq8yYI6DfcsS7EKTPLfw6m8jwzFcMwlkNoEj-RwKsa8qlSRi7mg/exec";

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
  const REDIRECT_URL = "https://14desu.github.io/";

  const block_ip_list_API = "https://script.google.com/macros/s/AKfycbyrogmtba7kOgYJphvYfTBk-TKb2fB93wXDuJxD9dBUt2Yhn_txgr5IQUaiJITqMsd2Ww/exec";
  const block_ip_log_POST = "https://script.google.com/macros/s/AKfycbzcUEt8PBrn8Gtk-_j7roWQ67zWsa9vtIUV14_X4GlRnr9t0ooSS6Pf70eGJvNg0DAjXw/exec";

  var blockedIPRanges = [];

  $.getJSON(block_ip_list_API, function (list) {

    blockedIPRanges = list.blockip;

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

        if (IPapiURL == "https://ip-api.io/api/json") {
          if (data.suspiciousFactors.isProxy || data.suspiciousFactors.isTorNode) {
            alert("정상적인 접근이 아닙니다")
            $.post(block_ip_log_POST, { ip: visitorIP })
            .done(function () {
              console.log("block ip POST 요청 성공");
            })
            .fail(function (error) {
              console.error(error);
            });
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
            $.post(block_ip_log_POST, { ip: visitorIP })
            .done(function () {
              console.log("block ip POST 요청 성공");
            })
            .fail(function (error) {
              console.error(error);
            });
            ip_bancheck_status = true;
            window.location.href = REDIRECT_URL;
            return false;
          }

        });

      });

    });

  });

}