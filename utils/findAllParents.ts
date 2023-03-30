/**
 *
 * @param lineMap 节点直接父级关系，比如{c:[a,b]}代表lac,lbc两条线,c的直接父级有a,b
 * @param id 节点id
 * @param walkedIds 已经遍历过的节点id集合，避免环形图递归爆栈
 * @returns 所有父级的集合，是一个不包含重复元素的数组
 */
function getAllParents(lineMap: Map<string, string[]>, id: string, walkedIds: string[]) {
  const parents = lineMap.get(id) || [];
  let rs: string[] = [];
  parents.forEach((pid) => {
    if (walkedIds.includes(pid)) return; // 出现循环引用终止该次计算
    if (lineMap.has(pid)) {
      walkedIds.push(pid);
      const oneBranchResult = this.getAllParents(lineMap, pid, walkedIds);
      rs = rs.concat(oneBranchResult);
    }
  });
  rs = Array.from(new Set([...parents, ...rs]));
  if (rs.indexOf(id) !== -1) {
    // 如有自身则去除
    rs.splice(rs.indexOf(id), 1);
  }
  return rs;
}
