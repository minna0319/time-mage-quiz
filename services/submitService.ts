import { QUESTIONS } from '../constants';
import { Answers, QuizResult } from '../types';

// ============================================================================
// 🚀 設定指南：如何串接 Google Sheet 與 Email 通知
// ============================================================================
//
// 步驟 1：建立 Google 表單 (Google Form)
// 1. 前往 Google Forms 建立一個新表單。
// 2. 建立 5 個「簡答題」對應 5 個問題，題目名稱隨意 (例如：Q1, Q2, Q3, Q4, Q5)。
// 3. 建立 1 個「簡答題」用來存放結果 (例如命名為：測驗結果)。
// 4. 到「回應 (Responses)」頁籤，點擊綠色 Excel 圖示「連結 Google 試算表」，這會建立一個新的 Sheet。
//
// 步驟 2：取得表單 ID (Entry IDs)
// 1. 在表單編輯畫面，點擊右上角「三個點」圖示 -> 選取「取得預先填入的連結 (Get pre-filled link)」。
// 2. 這會開啟一個新視窗，請隨便填寫一些測試答案 (例如 Q1 填 'A', 結果填 '測試')。
// 3. 點擊下方的「取得連結 (Get link)」，然後「複製連結」。
// 4. 將連結貼到記事本，它會長得像這樣：
//    https://docs.google.com/forms/d/e/1FAIpQLSe......_Q/viewform?usp=pp_url&entry.123456=A&entry.987654=測試
// 5. 請注意網址中的 `action` URL (把 /viewform 改成 /formResponse) 以及 `entry.xxxxxx` 的號碼。
// 6. 將這些資訊填入下方的 `GOOGLE_FORM_CONFIG` 變數中。
//
// 步驟 3：設定 Email 通知 (在 Google Sheet 中設定)
// 1. 打開剛剛產生的 Google 試算表 (Google Sheet)。
// 2. 點擊上方選單「擴充功能 (Extensions)」 -> 「Apps Script」。
// 3. 刪除原本編輯器中的程式碼，貼上以下程式碼 (記得把 email 改成妳自己的)：
/*
    function sendEmailNotification(e) {
      // --- 設定區 ---
      var myEmail = "your_email@gmail.com"; // <--- 請改成妳的 Email
      var subject = "✨ 有人完成了時間魔法師測驗！";
      // --------------
      
      var message = "親愛的 Minna，有人完成了測驗！\n\n";
      
      // 取得填寫的內容
      try {
        var itemResponses = e.response.getItemResponses();
        for (var i = 0; i < itemResponses.length; i++) {
          var itemResponse = itemResponses[i];
          message += "【" + itemResponse.getItem().getTitle() + "】\n" + itemResponse.getResponse() + "\n\n";
        }
      } catch (error) {
        message += "無法讀取詳細內容，請直接查看試算表。";
      }
      
      MailApp.sendEmail(myEmail, subject, message);
    }
*/
// 4. 按下存檔 (磁片圖示)。
// 5. 點擊左側選單的「觸發條件 (Triggers)」(一個鬧鐘圖示)。
// 6. 點擊右下角「新增觸發條件」。
// 7. 設定如下：
//    - 執行函式：sendEmailNotification
//    - 事件來源：試算表 (From spreadsheet)
//    - 事件類型：提交表單時 (On form submit)
// 8. 按下儲存，Google 會跳出視窗要求授權 (可能會顯示「應用程式未經驗證」，請點「進階」->「前往...」並允許)。
// 9. 完成！現在只要有人做完測驗，妳就會收到信了。
// ============================================================================

const GOOGLE_FORM_CONFIG = {
  // [必填] 請將 /viewform?usp=... 之前的網址貼上，並將結尾改成 /formResponse
  // 範例: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfxg......./formResponse"
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSes9Eo3zEyrV8BT7ZXuCJufmvUPLjr452F-iRRsX71BU-rchQ/formResponse",

  // [必填] 請填入步驟 2 取得的 entry ID (只要填數字部分 entry.12345 的 12345 即可，或完整字串也可以)
  fieldMapping: {
    1: "entry.1105868484", // Q1 問題的 ID
    2: "entry.308442380", // Q2 問題的 ID
    3: "entry.255472753", // Q3 問題的 ID
    4: "entry.841287392", // Q4 問題的 ID
    5: "entry.1336597780", // Q5 問題的 ID
    result: "entry.1033353310" // 結果欄位的 ID
  }
};

export const submitQuizData = async (answers: Answers, result: QuizResult) => {
  // 如果沒有設定 URL，就在 Console 顯示模擬結果 (開發模式)
  if (!GOOGLE_FORM_CONFIG.actionUrl || GOOGLE_FORM_CONFIG.actionUrl === "") {
    console.log("%c[模擬提交] %c尚未設定 Google Form URL", "color:#a855f7; font-weight:bold;", "color:gray;");
    console.log("使用者選擇:", answers);
    console.log("測驗結果:", result.title);
    return true;
  }

  const formData = new FormData();

  // 1. 填入問題答案
  Object.keys(answers).forEach((qIdKey) => {
    const qId = parseInt(qIdKey);
    const optionId = answers[qId];

    // 找出更易讀的文字 (例如 "A. 短暫充電")
    const question = QUESTIONS.find(q => q.id === qId);
    const option = question?.options.find(o => o.id === optionId);
    const answerText = option ? `${option.id}. ${option.text}` : optionId;

    // 對應到 Google Form 的 entry ID
    // @ts-ignore
    const entryId = GOOGLE_FORM_CONFIG.fieldMapping[qId];
    if (entryId) {
      formData.append(entryId, answerText);
    }
  });

  // 2. 填入測驗結果
  if (GOOGLE_FORM_CONFIG.fieldMapping.result) {
    const fullResultText = `${result.title} (${result.magicName})`;
    formData.append(GOOGLE_FORM_CONFIG.fieldMapping.result, fullResultText);
  }

  try {
    // 3. 發送請求
    // 注意：Google Forms 跨域請求 (CORS) 不會回傳標準 JSON，
    // 所以我們使用 mode: 'no-cors'。這表示我們無法讀取回應內容(status 0)，
    // 但資料實際上會成功送出。
    await fetch(GOOGLE_FORM_CONFIG.actionUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    console.log("🎉 測驗資料已傳送至 Google Form");
    return true;
  } catch (error) {
    console.error("❌ 傳送失敗", error);
    // 即使失敗也不要阻擋使用者看到結果，回傳 false 僅供參考
    return false;
  }
};
