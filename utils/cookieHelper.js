/**
 *
 * @param {*} cookie  document.cookie字符串
 * @param {*} name cookie name
 * @returns cookie name对应的值,没有则返回空串
 */
function readCookie(cookie, name) {
  // ^|;\\s* 匹配空白字符开头或;开头，|作用范围是后面所有的内容，不是只有紧邻的;； \\s* 匹配任意个数的空白字符，其中\\是在Regexp中需要转义\； [^;]* 匹配任意个数的非分号
  var match = cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  console.log('match=>', match);
  return match ? decodeURIComponent(match[3]) : '';
}

// let cookie = document.cookie;
cookie =
  'BIDUPSID=57111C2A7FC1E1D10345FD20FBCCEC2F; PSTM=1663586297; BAIDUID=57111C2A7FC1E1D196EF6540630DA6BF:FG=1; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; Hm_lvt_6859ce5aaf00fb00387e6434e4fcc925=1665491627; H_PS_PSSID=36546_37354_36885_34813_37402_37397_36789_37539_26350_37478_37371; BAIDUID_BFESS=57111C2A7FC1E1D196EF6540630DA6BF:FG=1; ZD_ENTRY=baidu; session_id=166564588809844192434875474174; Hm_lpvt_6859ce5aaf00fb00387e6434e4fcc925=1665645890; shitong_key_id=2; shitong_data=cb48e0c83f3313c4e6f60027add30e191cc5bae0da2c0f9ee232380748084a9063d7978fb196421eefe710a5b27ab395faac13ae8e8ec9d01fb33786a070c83310ad7d6b17161dee84b13bfd150a8d0f7a61a5d3d3b0b135be3079cb25333a46; shitong_sign=8461139b';

const value = readCookie(cookie, 'BAIDUID1');
console.log(value);
