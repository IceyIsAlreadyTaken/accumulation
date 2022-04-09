function parsePath(path) {
  const reg = /[^\w.$]/;
  if (reg.test(path)) return;
  const segments = path.split('.');
  return function (obj) {
    if (!obj) return;
    for (let i = 0; i < segments.length; i++) {
      obj = obj[segments[i]];
    }
    return obj;
  };
}

const obj = {
  a: {
    b: {
      c: 'hello',
    },
  },
};

const getter = parsePath('a.b.c');
const result = getter(obj);
console.log(result);
