// 리디렉션할 URL
const REDIRECT_URL = "https://gall.dcinside.com/mini/board/view/?id=nf&no=27";

// IP 범위 (예: 192.168.0.1 - 192.168.0.10, 10.0.0.1 - 10.0.0.100)
const IP_RANGES = [
  //SKT 3G
  { start: "211.234.128.0", end: "211.234.239.255" },
  //SKT 3G+4G
  { start: "203.226.192.0", end: "203.226.252.255" },
  //SKT 4G
  { start: "27.160.0.0", end: "27.183.255.255" },
  //SKT 4G+5G
  { start: "223.32.0.0", end: "223.63.255.255" },
  //KT 3G+4G+5G
  { start: "39.7.0.0", end: "39.7.255.255" },
  { start: "110.70.0.0", end: "110.70.255.255" },
  //KT 3G+4G
  { start: "175.223.0.0", end: "175.223.255.255" },
  { start: "211.246.0.0", end: "211.246.255.255" },
  //KT 4G+5G
  { start: "118.235.0.0", end: "118.235.255.255" },
  //LGU+ 3G
  { start: "61.43.0.0", end: "61.43.255.255" },
  { start: "211.234.0.0", end: "211.234.95.255" },
  //LGU+ 4G
  { start: "106.102.0.0", end: "106.102.255.255" },
  { start: "117.111.0.0", end: "117.111.255.255" },
  { start: "211.36.128.0", end: "211.36.159.255" },
  { start: "211.36.224.0", end: "211.36.255.255" },
  //LGU+ 5G
  { start: "106.101.0.0", end: "106.101.255.255" },

  //빌런 - 청풍
  { start: "123.248.0.0", end: "123.248.255.255" },

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