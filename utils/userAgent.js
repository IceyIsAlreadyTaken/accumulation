function getBrowserType(ua) {
  var tem;
  var M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = ua.match(/\brv[ :]+(\d+)/);
    console.log(tem);
    return 'IE ' + (tem[1] || '');
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\b(OPR|Edge|Edg|QQBrowser|SLBrowser)\/(\d+)/);
    console.log(tem);
    if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
  }
  M = M[2] ? [M[1], M[2]] : ['unknown'];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(' ');
}

// Chrome✅
// const rs = getBrowserType(
//   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
// );
// console.log(rs);
// Edg✅
// const rs = getBrowserType(
//   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.54"
// );
// Edge✅
// const rs = getBrowserType(
//   "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136"
// );
// console.log(rs);
// SLBrowser✅
// const rs = getBrowserType(
//   "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36 SLBrowser/7.0.0.12151 SLBChan/105"
// );
// console.log(rs);
// Safari✅
// const rs = getBrowserType(
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.3 Safari/605.1.15"
// );
// IE10✅
// const rs = getBrowserType(
//   "Mozilla/5.0 (compatible; WOW64; MSIE 10.0; Windows NT 6.2)"
// );
// IE11 ✅
// const rs = getBrowserType(
//   "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; McAfee; rv:11.0) like Gecko"
// );
// Firefox✅
// const rs = getBrowserType(
//   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:21.0) Gecko/20100101 Firefox/21.0"
// );
// console.log(rs);
