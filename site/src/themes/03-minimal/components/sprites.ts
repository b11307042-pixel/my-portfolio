// 像素圖：一個字元＝一格。'.' 是透明。只拿來畫裝飾（角色、寶箱、金幣…），照片和截圖不走這裡。
export const pal: Record<string, string> = {
  K: '#0b0c1a', // 外框
  N: '#2a2d5a', // 深靛
  W: '#ffffff',
  C: '#f4f1e6', // 奶油
  Y: '#ffd166', // 金
  O: '#c98f2a', // 深金
  R: '#ff6b6b', // 珊瑚
  D: '#b8404a', // 深珊瑚
  M: '#5ee6a8', // 薄荷
  G: '#2a9d75', // 深薄荷
  S: '#6cc6ff', // 天空
  B: '#3a7fd0', // 深天空
  L: '#b48cff', // 淡紫
  P: '#ffd6a8', // 膚色
  H: '#ff9e9e', // 腮紅
  T: '#7a4b2a', // 木頭
};

export const art: Record<string, string[]> = {
  // 主角（16×16）：藍髮冒險者
  hero: [
    '................',
    '....KKKKKKKK....',
    '...KBBBBBBBBK...',
    '..KBBSBBBBBBBK..',
    '..KBBBPPPPBBBK..',
    '..KBPPPPPPPPBK..',
    '..KPPKPPPPKPPK..',
    '..KPHPPPPPPHPK..',
    '...KPPPDDPPPK...',
    '....KKPPPPKK....',
    '...KYYYYYYYYK...',
    '..KPYYYRRYYYPK..',
    '..KPYYYYYYYYPK..',
    '...KKYYYYYYKK...',
    '....KNNKKNNK....',
    '....KKK..KKK....',
  ],
  // 倒下的主角（404）
  fallen: [
    '..KKKK..........',
    '.KBBBBKKKKKK....',
    'KBBPPPKYYYYYKK..',
    'KBPKPPKYYRRYYNK.',
    'KBPPKPKYYYYYYNK.',
    '.KBPPPKKKKKKKK..',
    '..KKKK..........',
  ],
  chest: [
    '............',
    '..KKKKKKKK..',
    '.KTTTTTTTTK.',
    '.KTYTTTTYTK.',
    'KKKKKKKKKKKK',
    'KTTTTYYTTTTK',
    'KTTTTYKTTTTK',
    'KTYTTTTTTYTK',
    'KTTTTTTTTTTK',
    'KOOOOOOOOOOK',
    '.KKKKKKKKKK.',
    '............',
  ],
  gem: [
    '............',
    '...KKKKKK...',
    '..KWWSSSBK..',
    '.KWSSSSSSBK.',
    'KKKKKKKKKKKK',
    '.KSWSSSSSBK.',
    '..KSSSSSBK..',
    '...KSSSBK...',
    '....KSBK....',
    '.....KK.....',
    '............',
    '............',
  ],
  potion: [
    '....KKKK....',
    '....KTTK....',
    '.....KK.....',
    '....KCCK....',
    '...KMMMMK...',
    '..KMWMMMMK..',
    '..KMWMMMMK..',
    '..KMMMMMGK..',
    '..KMMMMGGK..',
    '...KGGGGK...',
    '....KKKK....',
    '............',
  ],
  scroll: [
    '............',
    '.KKKKKKKKKK.',
    'KCCKCCCCCCCK',
    'KCKKCCCCCCCK',
    '.KKCNNNNNCK.',
    '..KCCCCCCK..',
    '..KCNNNNCK..',
    '..KCCCCCCK..',
    '..KCNNNCCKK.',
    '.KKCCCCCCKCK',
    'KCCKKKKKKKK.',
    '.KKK........',
  ],
  coin: [
    '..KKKK..',
    '.KYYYYK.',
    'KYWYYOYK',
    'KYWYYOYK',
    'KYYYYOYK',
    'KYYYOOYK',
    '.KOOOOK.',
    '..KKKK..',
  ],
  heart: [
    '.KK.KK..',
    'KRRKRRK.',
    'KRWRRRK.',
    'KRRRRRK.',
    '.KRRRK..',
    '..KRK...',
    '...K....',
    '........',
  ],
  star: [
    '...K....',
    '..KYK...',
    'KKKYKKK.',
    'KYYWYYK.',
    '.KYYYK..',
    '.KYKYK..',
    'KKK.KKK.',
    '........',
  ],
  check: [
    '........',
    '......KK',
    '.....KMK',
    'KK..KMK.',
    'KMKKMK..',
    '.KMMK...',
    '..KK....',
    '........',
  ],
  key: [
    '.KKK....',
    'KYYYK...',
    'KYKYK...',
    'KYYYKKKK',
    '.KKKYYYK',
    '....KYKK',
    '....KK..',
    '........',
  ],
  cursor: [
    'Y....',
    'YY...',
    'YYY..',
    'YYYY.',
    'YYY..',
    'YY...',
    'Y....',
  ],
  down: [
    'YYYYYYY',
    '.YYYYY.',
    '..YYY..',
    '...Y...',
  ],
  // 書本（日誌）
  book: [
    '............',
    '.KKKKKKKKKK.',
    'KDDDDDDDDDCK',
    'KDYYYYYYDDCK',
    'KDDDDDDDDDCK',
    'KDDYYYYDDDCK',
    'KDDDDDDDDDCK',
    'KDDDDDDDDDCK',
    'KDDDDDDDDDCK',
    'KKKKKKKKKKCK',
    '.KCCCCCCCCCK',
    '..KKKKKKKKK.',
  ],
  sword: [
    '..........KK',
    '.........KWK',
    '........KWSK',
    '.......KWSK.',
    '......KWSK..',
    '.KK..KWSK...',
    '.KYKKWSK....',
    '..KYKSK.....',
    '...KYK......',
    '..KTKYK.....',
    '.KTK.KK.....',
    '.KK.........',
  ],
};

/** 把像素圖轉成一列一列合併過的方塊（少一點 <rect>） */
export function rects(name: string) {
  const map = art[name] || art.gem;
  const out: { x: number; y: number; w: number; f: string }[] = [];
  map.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === '.') { x++; continue; }
      let w = 1;
      while (row[x + w] === c) w++;
      out.push({ x, y, w, f: pal[c] || '#000' });
      x += w;
    }
  });
  return { w: Math.max(...map.map((r) => r.length)), h: map.length, out };
}

/** 作品沒有截圖時，依序放的寶物 */
export const loot = ['chest', 'gem', 'potion', 'scroll', 'sword', 'key'];
