// 中文句子換行：有標點、每一段又不長的句子，只在標點後換行（加 class="kp"）；
// 沒有標點的標題就交給 text-wrap: balance 平均分行，避免最後一行只剩一個字。
export function kp(text = '') {
  const parts = text.split(/[，。、！？；：,.!?;:\s]+/).filter(Boolean);
  return parts.length > 1 && Math.max(...parts.map((p) => [...p].length)) <= 13 ? 'kp' : '';
}
