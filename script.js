// 勤務時間・授業時間計算フォームの処理
const form = document.getElementById('timeForm');
const resultDiv = document.getElementById('result');

if (form) {
  // 2桁制限: 勤務開始・終了時刻の各フィールド
  ['startHour', 'startMinute', 'endHour', 'endMinute'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        if (this.value.length > 2) {
          this.value = this.value.slice(0, 2);
        }
      });
    }
  });
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // 入力値取得
    const startHour = parseInt(document.getElementById('startHour').value, 10);
    const startMinute = parseInt(document.getElementById('startMinute').value, 10);
    const endHour = parseInt(document.getElementById('endHour').value, 10);
    const endMinute = parseInt(document.getElementById('endMinute').value, 10);
    const lessonMinutes = parseInt(document.getElementById('lessonMinutes').value, 10);
    const halfLessonMinutes = parseInt(document.getElementById('halfLessonMinutes').value, 10);

    // 勤務時間（分）計算
    let startTotal = startHour * 60 + startMinute;
    let endTotal = endHour * 60 + endMinute;
    if (endTotal < startTotal) {
      // 日をまたぐ場合
      endTotal += 24 * 60;
    }
    const workMinutes = endTotal - startTotal;

    // 事務の時間 = 勤務時間 - 授業時間 - 1/2授業時間
    let officeMinutes = workMinutes - lessonMinutes - halfLessonMinutes;

    // 労働基準法による休憩時間の自動控除
    let breakMinutes = 0;
    if (workMinutes > 480) {
      breakMinutes = 60;
    } else if (workMinutes > 360) {
      breakMinutes = 45;
    }
    officeMinutes -= breakMinutes;

    // 5分単位に切り捨て
    let officeMinutes5 = officeMinutes - (officeMinutes % 5);

    // 結果表示
    if (officeMinutes < 0) {
      resultDiv.textContent = 'エラー: 授業時間と1/2給時間、休憩の合計が勤務時間を超えています。';
    } else {
      resultDiv.innerHTML =
        `勤務時間合計：<b>${workMinutes}</b> 分<br>` +
        `休憩時間：<b>${breakMinutes}</b> 分<br>` +
        `授業時間：<b>${lessonMinutes}</b> 分<br>` +
        `1/2給時間：<b>${halfLessonMinutes}</b> 分<br>` +
        `事務の時間：<b>${officeMinutes}</b> 分<br>` +
        `5分単位に直した事務の時間：<b>${officeMinutes5}</b> 分`;
    }
  });
}
