/**
 *
 * @param components1 object1
 * @param components2 object2
 * @param ignoreProps 忽略比较的属性
 * @returns 只返回有变化的属性，通过add|del|changed来标识变化的类型 {'prop1':'del','prop2':'add','prop3':{'name':'changed'}}
 */
export const updatedComs = (components1, components2, ignoreProps = []) => {
  if (components1 === components2) return 'equal';
  if (typeof components1 !== 'object' && typeof components2 !== 'object') return 'changed';

  const res = Object.keys(components1).reduce((acc, key) => {
    if (!ignoreProps.includes(key)) {
      if (components2.hasOwnProperty(key)) {
        const type = updatedComs(components1[key], components2[key]);
        if (type === 'equal') return acc;
        acc[key] = type;
        return acc;
      }
      acc[key] = 'deleted';
      return acc;
    }
    return acc;
  }, {});

  Object.keys(components2).reduce((acc, key) => {
    if (!Object.keys(components1).includes(key)) {
      acc[key] = 'added';
    }
    return acc;
  }, res);

  if (typeof res === 'object' && Object.keys(res).length === 0) return 'equal';
  return res;
};

export const addedComs = <T extends Object>(components1: T, components2: T): T => {
  if (typeof components1 !== 'object' || typeof components2 !== 'object') return {} as T;
  return Object.keys(components2).reduce((acc, key) => {
    if (!Object.prototype.hasOwnProperty.call(components1, key)) {
      acc[key] = components2[key];
    }
    return acc;
  }, {} as T);
};

export const delComs = <T extends Object>(components1: T, components2: T): T => {
  if (typeof components1 !== 'object' || typeof components2 !== 'object') return {} as T;
  return Object.keys(components1).reduce((acc, key) => {
    if (!Object.prototype.hasOwnProperty.call(components2, key)) {
      acc[key] = components1[key];
    }
    return acc;
  }, {} as T);
};
