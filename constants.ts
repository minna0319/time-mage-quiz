import { Question, QuizResult } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "妳理想中的「Me Time」放鬆時光長什麼樣子？",
    subtitle: "時間與專注力測驗",
    options: [
      { id: 'A', text: "短暫充電", description: "專注 2 小時完成一件喜歡的事，然後繼續下一項任務。", score: 1 },
      { id: 'B', text: "沉浸享受", description: "享受 3 小時左右的心流體驗，剛剛好的投入感。", score: 2 },
      { id: 'C', text: "挑戰極限", description: "既然開始了，就期待長時間深度投入，享受 4 小時以上的慢工出細活。", score: 3 },
    ]
  },
  {
    id: 2,
    title: "對妳而言，「最好的獨處」是什麼狀態？",
    subtitle: "時間與專注力測驗",
    options: [
      { id: 'A', text: "無壓力", description: "活動能在傍晚前輕鬆結束，長時間在外會讓我有些微不自在。", score: 1 },
      { id: 'B', text: "高彈性", description: "享受自己的時光，時間長短不是問題，只要能自由掌握節奏。", score: 2 },
      { id: 'C', text: "全心投入", description: "期待長時間沉浸在專注的時光裡，越久越療癒。", score: 3 },
    ]
  },
  {
    id: 3,
    title: "妳在為居家空間添購物件時，最看重它的「存在感」？",
    subtitle: "風格與功能性測驗",
    options: [
      { id: 'A', text: "點綴感", description: "小巧精緻，可以放在桌上或書架上，是畫龍點睛的點綴。", score: 1 },
      { id: 'B', text: "主角感", description: "尺寸適中，能成為個人工作區或休息區的主視覺。", score: 2 },
      { id: 'C', text: "宣言感", description: "大膽搶眼，能夠佔據一面牆或一個角落，成為空間的視覺焦點。", score: 3 },
    ]
  },
  {
    id: 4,
    title: "一個好的物件，對妳來說必須具備哪種價值？",
    subtitle: "風格與功能性測驗",
    options: [
      { id: 'A', text: "純粹美學", description: "它就是藝術品，負責讓空間變得更美麗。", score: 1 },
      { id: 'B', text: "情感溫度", description: "它代表某段回憶，放在手邊就很踏實。", score: 2 },
      { id: 'C', text: "實用結合", description: "除了美觀，它最好還能滿足一個日常機能，每天都會用到。", score: 3 },
    ]
  },
  {
    id: 5,
    title: "如果要安排一個能讓妳心靈放鬆的活動，哪個時段最符合妳創業家的作息？",
    subtitle: "預約時段測驗",
    options: [
      { id: 'A', text: "平日上午", description: "早起精神好，做完任性地宣布「今天下午休假！」", score: 0 },
      { id: 'B', text: "平日下午", description: "上午趕完進度，下午「想走就走」，當作一天的完美放鬆結尾！", score: 0 },
      { id: 'C', text: "假日上午", description: "假日早鳥場！抓緊時間完成療癒體驗，下午還有超長時段可以自由運用。", score: 0 },
      { id: 'D', text: "假日下午", description: "睡到飽再出門！慢慢享受週末午後的寧靜，將體驗當作收心操。", score: 0 },
    ]
  }
];

export const RESULTS: QuizResult[] = [
  {
    minScore: 4,
    maxScore: 6,
    title: "輕盈效率家",
    magicName: "時間瞬移",
    description: "妳是掌握時間輕盈感的魔法師。妳擅長在最短時間內*精準充電*，追求*高效率與零壓力*。妳的魔法能讓妳在有限的時間內創造出*最大的療癒價值*，專注於*精巧細膩的美感*，不讓生活感到沉重。",
    imageKeyword: "sparkle"
  },
  {
    minScore: 7,
    maxScore: 9,
    title: "平衡心流者",
    magicName: "心流控制",
    description: "妳是懂得*平衡*的魔法師。妳喜歡在一個適中的時段內，將*心力完全投入*，享受過程的樂趣，但又不會讓自己感到過度疲憊。妳創造出的作品充滿*溫暖和個人色彩*，總能與生活*完美契合*。",
    imageKeyword: "magic-potion"
  },
  {
    minScore: 10,
    maxScore: 12,
    title: "沉浸藝術家",
    magicName: "時間凝結",
    description: "妳是追求*完美*的魔法師。妳掌握了「時間凝結」的魔法，能長時間*沉浸於創作*，不被外界打擾。妳追求作品的*份量感與實用性*，希望創造出一個兼具*美觀與強大功能*的空間焦點，留下*深刻的印記*。",
    imageKeyword: "hourglass"
  }
];