$(document).ready(function() {

  // 방문자의 IP를 가져오는 API URL
  var apiURL = "https://api.ipify.org/?format=json";

  // API를 호출하여 방문자의 IP 주소를 가져옴
  $.getJSON(apiURL, function(data) {
    var visitorIP = data.ip;
    
    // 방문자의 IP를 구글 스프레드시트에 POST하는 API URL
    var postURL = "https://script.google.com/macros/s/AKfycbxEuufzXGziBpbO6Rw_CBAT1LoDwIm_bcnYHJQtIDg5pRblyR7g2hf1ruFzo_NJOMw3/exec?ip=" + visitorIP;
    
    // POST 요청 보내기
    $.ajax({
      url: postURL,
      method: "POST",
      success: function(response) {
        console.log("POST 요청 성공: " + response);
      },
      error: function(xhr, status, error) {
        console.log("POST 요청 실패: " + error);
      }
    });
  });
});





