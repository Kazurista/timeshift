function timeCaluculations() {
  // 現在アクティブなスプレッドシートを取得
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // そのスプレッドシートにある最初のシートを取得
  var sheet = ss.getSheets()[0];
  
  // シフト管理する従業員数(+1余白)
  var lastRow = sheet.getLastRow()-5;
  var lastColumn = sheet.getLastColumn()-3;
  
  // 従業員数分だけループ
  for(var i = 0; i <= lastRow; i += 2){
    var count = 0;
    
     bgColors = [];
    
    // 黒のセル数をカウント
    for(var j = 0; j <= lastColumn; j++){
      var columnRange = sheet.getRange(i+4, j+2);
      
      if(columnRange.getBackground() == "#000000" || columnRange.getBackground() == "#00ff00"){
        count++;
      }
    }
    
    // 勤務時間の計算    
    var hours = count*0.25
    sheet.getRange(i+4, lastColumn+1).setValue(hours)
    
    // 勤務時間による休憩時間の分岐
    var break_t = 0;
    if(hours >= 4.0 && hours < 6.0){
      break_t = 15;
    }else if(hours >= 6.0 && hours < 8.0){
      break_t = 45;
    }else if(hours >= 8.0){
      break_t = 60;
    }
    // 休憩時間の計算
    sheet.getRange(i+4, lastColumn+2).setValue(break_t);
  }
}

function createNewSheet() {
  // 現在アクティブなスプレッドシートを取得
  var ss_active = SpreadsheetApp.getActiveSpreadsheet();
  var originalSheet = ss_active.getSheets()[0];
  
  var week_arr = ["日","月","火","水","木","金","土"];
  var date = new Date();
  // 原本の{A1}に入力された月を取得
  var month = originalSheet.getRange("A1").getValue();
  
  date.setMonth(month-1); // 月データは1月から12月までのindex番号は0から11
  date.setDate(1); // 月初
  
  var end_date = new Date();
  end_date.setMonth(month);
  end_date.setDate(0); // 月末
  
  var date_data = Utilities.formatDate(date, "JST", "dd");
  var last_date = Utilities.formatDate(end_date, "JST", "dd");
  
  // 新しいスプレッドシートを作成
  // var new_ss = SpreadsheetApp.create(month + "月 シフト");
  
  var i = 0;
  // 月初から月末までループ
  while(date_data != last_date){
    date.setDate(i+1);
    var month_data = Utilities.formatDate(date, "JST", "MM");
    var date_data = Utilities.formatDate(date, "JST", "dd");
    // 曜日番号を取得し、それに合わせて曜日を取得
    var day_num = date.getDay();
    var day = "("+week_arr[day_num]+")";
    
    
    
    // 新しいシートをoriginalSheet(原本)から新しく作成されたスプレッドシートに追加
    // var newSheet = originalSheet.copyTo(new_ss);
    // newSheet.setName(month_data + date_data);
    // newSheet.getRange("A1").setValue(month_data + "月" + date_data + "日" + day);
    i++;
  }
}

function getTotalTime() {

}
