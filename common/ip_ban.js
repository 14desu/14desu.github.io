// 리디렉션할 URL
const REDIRECT_URL = "https://gall.dcinside.com/board/lists/?id=nf";

// IP 범위 (예: 192.168.0.1 - 192.168.0.10, 10.0.0.1 - 10.0.0.100)
const IP_RANGES = [
  { start: "133.32.*.1", end: "133.32.*.200" },
  { start: "10.0.*.1", end: "10.0.*.100" },
];

// 현재 사용자의 IP 주소 가져오기
const userIpAddress = new Promise(resolve => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.ipify.org?format=json");
  xhr.onload = () => resolve(JSON.parse(xhr.responseText).ip);
  xhr.send();
});

// 범위 내에 속하는지 확인하여 리디렉션
userIpAddress.then(ipAddress => {
  const ipAsNumber = ipAddress.split(".").reduce((acc, val) => (acc << 8) | Number(val), 0);
  for (const ipRange of IP_RANGES) {
    const startIpAsNumber = ipRange.start.split(".").reduce((acc, val) => (acc << 8) | Number(val), 0);
    const endIpAsNumber = ipRange.end.split(".").reduce((acc, val) => (acc << 8) | Number(val), 0);
    if (ipAsNumber >= startIpAsNumber && ipAsNumber <= endIpAsNumber) {
      window.location.href = REDIRECT_URL;
      break;
    }
  }
});