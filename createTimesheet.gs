/* ------------------------------ 
   シートを日にち分だけコピーする関数
------------------------------ */

function createNewSheet() {
  // 変数定義
  var ss_active = SpreadsheetApp.getActiveSpreadsheet(), // 現在アクティブなスプレッドシートを取得
      originalSheet = ss_active.getSheets()[0],　        // 1枚目のシートを取得
      week_arr = ["日","月","火","水","木","金","土"],     // 曜日を配列に代入
      date = new Date(),
      month = originalSheet.getRange("A1").getValue();  // 原本の{A1}に入力された月を取得
  
  date.setMonth(month-1); // 月データは1月から12月までのindex番号は0から11
  date.setDate(1);        // 月初
  
  var end_date = new Date();
  end_date.setMonth(month);
  end_date.setDate(0); // 月末
  
  var date_data = Utilities.formatDate(date, "JST", "dd"),
      last_date = Utilities.formatDate(end_date, "JST", "dd"),
      i = 0;
  
  // 月初から月末までループ
  while(date_data != last_date){
    date.setDate(i+1);
    var month_data = Utilities.formatDate(date, "JST", "MM"),
        date_data = Utilities.formatDate(date, "JST", "dd"),
    // 曜日番号を取得し、それに合わせて曜日を取得
        day_num = date.getDay(),
        day = "("+week_arr[day_num]+")";
    
    // 新しいシートをoriginalSheet(原本)から新しく作成されたスプレッドシートに追加
    var newSheet = originalSheet.copyTo(ss_active);
    newSheet.setName(month_data + date_data);
    newSheet.getRange("A1").setValue(month_data + "月" + date_data + "日" + day);
    i++;
  }
}

/* ------------------------------ 
   シフトインの時間を計算する関数
 ------------------------------ */

function timeCaluculations() {
  // 変数定義
  var ss = SpreadsheetApp.getActiveSpreadsheet(),
      sheet_len = ss.getNumSheets(),
      length_of_row = 34,         // 従業員数の幅
      length_of_column = 64;      // 8:00〜23:00の横幅
  
  for (var k = 1; k < sheet_len; k++) {
    var sheet = ss.getSheets()[k],
        // シフト内のセルの背景色を2次元配列で全て取得
        backgrounds = sheet.getRange(4, 2, length_of_row, length_of_column).getBackgrounds(), 
        bgColors = [];
  
    for (var i = 0; i < 34; i += 1) {
      bgColors.push(backgrounds[i]);
    }
  
    var working_times = [];
    
    for (var i = 0; i < 34; i++) {
      var result = bgColors[i].filter(function(color) { 
        return color !== "#ffffff"; 
      });
      var break_time = 0,
          working_time = result.length*0.25;
    
      if (working_time >= 4.0 && working_time < 6.0) {
        break_time = 15;
      } else if (working_time >= 6.0 && working_time < 8.0) {
        break_time = 45;
      } else if (working_time >= 8.0) {
        break_time = 60;
      }
      working_times.push([working_time, break_time]);
    }
  
    Logger.log(working_times);
  
    sheet.getRange(4, length_of_column+2, length_of_row, 2).setValues(working_times);
  }
}


/* ---------------------------------
   1ヶ月の従業員の勤務時間を計算する関数
 --------------------------------- */

function getTotalTime() {
  // シフト原本のスプレッドシート
  var original_ss = SpreadsheetApp.getActiveSpreadsheet(),
      original_sheets = original_ss.getSheets(),
      first_sheet = original_sheets[0];
  
  // 原本の{A1}に入力された月を取得
  var month = first_sheet.getRange("A1").getValue();

  // 管理者用のスプレッドシート
  var admin_ss = SpreadsheetApp.openById('1YsOY1uqmNheXdEvv9FvjhHZjEhR3M5lv_K37W0AQNHw');
  // 作成している月のシートを取得
  var admin_sheet = admin_ss.getSheetByName(month);
  admin_sheet.getRange("A1").setValue(month + "月");
  
  var sheet_len = original_ss.getNumSheets();
  
  // 従業員数
  var row_len = first_sheet.getLastRow()-1;  
  var last_line = first_sheet.getLastColumn();
  
  for(var i=1; i < sheet_len; i++){
    // 原本以降のシートの数分だけループ
    var sheet = original_sheets[i];
    for(var j=4; j<row_len; j=j+2){
      var work_time = sheet.getRange(j, last_line).getValue();
      admin_sheet.getRange(j, i+2).setValue(work_time);
    }
  }
}