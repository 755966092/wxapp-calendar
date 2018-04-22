//index.js
//获取应用实例
const app = getApp()
const Mock = require("../../utils/mock-min.js")
Page({
  data: {
    motto: 'Hello World',
    // 日历nav
    dateNavDate: [],
    // 日历相关
    year: 0,
    month: 11,
    today: 0,
    curMonth: 0,
    curYear: 0,
    date: ["日", "一", "二", "三", "四", "五", "六"],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    dateHide: false,
  },
  onLoad: function () {
    // 初始化日历标题
    this.initCalendar(new Date());
    this.mockCalendarData();
    this.setData({
      month: new Date().getMonth()+1
    })
  },
  // 初始化日历标题
  initCalendar: function (today) {
    // var today = new Date();
    let dateTitle = [];
    var a0 = new Date(today.getTime() - 86400000 * 2);
    var a1 = new Date(today.getTime() - 86400000);
    var a2 = new Date(today.getTime());
    var a3 = new Date(today.getTime() + 86400000);
    var a4 = new Date(today.getTime() + 86400000 * 2);
    let dateArr = [a0, a1, a2, a3, a4];
    for (let i = 0; i < dateArr.length; i++) {
      const element = dateArr[i];
      dateTitle.push({
        isToday:
        "" +
        element.getFullYear() +
        (element.getMonth() + 1) +
        element.getDate(),
        dateNum: element.getDate(),
        week: this.data.date[
        new Date(
          element.getFullYear(),
          element.getMonth(),
          element.getDate()
        ).getDay()
        ],
        month: element.getMonth() + 1,
        year: element.getFullYear(),
        weight: 5
      });
    }
    this.setData({
      dateNavDate: dateTitle
    });
  },
  // 日历相关函数
  // 加载日历
  getCalendar: function () {
    if (this.data.dateArr.length == 0) {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      this.dateInit();
      this.setData({
        year: year,
        month: month,
        curMonth: month,
        curYear: year,
        isToday: "" + year + month + now.getDate(),
        today: now.getDate()
      });
    }
  

  },
  dateInit: function (setYear, setMonth, flag) {
    if (this.data.dateArr.length == 0 || !flag) {
      //全部时间的月份都是按0~11基准，显示月份才+1
      let dateArr = []; //需要遍历的日历数组数据
      let arrLen = 0; //dateArr的数组长度
      let now = setYear ? new Date(setYear, setMonth) : new Date();
      let year = setYear || now.getFullYear();
      let nextYear = 0;
      let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
      let nextMonth = month + 1 > 11 ? 1 : month + 1;
      let startWeek = new Date(year, month, 1).getDay(); //目标月1号对应的星期
      let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
      let obj = {};
      let num = 0;

      if (month + 1 > 11) {
        nextYear = year + 1;
        dayNums = new Date(nextYear, nextMonth, 0).getDate();
      }
      arrLen = startWeek + dayNums;

      for (let i = 0; i < arrLen; i++) {
        if (i >= startWeek) {
          num = i - startWeek + 1;
          obj = {
            isToday: "" + year + (month + 1) + num,
            dateNum: num,
            week: this.data.date[new Date(year, month, num).getDay()],
            month: month + 1,
            year: year,
            weight: 5
          };
        } else {
          obj = 1;
        }
        dateArr[i] = obj;
      }
      this.setData({
        dateArr: dateArr,
        today: new Date().getDate()
      });
      let nowDate = new Date();
      let nowYear = nowDate.getFullYear();
      let nowMonth = nowDate.getMonth() + 1;
      let nowWeek = nowDate.getDay();
      let getYear = setYear || nowYear;
      let getMonth = setMonth >= 0 ? setMonth + 1 : nowMonth;

      if (nowYear == getYear && nowMonth == getMonth) {
        this.setData({
          isTodayWeek: true,
          todayIndex: nowWeek
        });
      } else {
        this.setData({
          isTodayWeek: false,
          todayIndex: -1
        });
      }
    }
  },
  // 下个月
  lastMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: month + 1
    });
    this.dateInit(year, month, 0);
  },
  // 上个月
  nextMonth: function () {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: month + 1
    });
    this.dateInit(year, month, 0);
  },
  // 点击日历标题
  dateClickTitle: function (e) {
    let date = e.currentTarget.dataset.date;
    let curDate = new Date();
    this.initCalendar(new Date(date.year, date.month - 1, date.dateNum));
    this.setData({
      isToday: e.currentTarget.dataset.date.isToday,
      year: date.year,
      month: date.month,
      curMonth: curDate.getMonth() + 1,
      curYear: curDate.getFullYear(),
      today: curDate.getDate()
    });
    this.dateInit(date.year, date.month - 1, 0);
    this.mockCalendarData();
  },
  // 点击日历的天
  clickDateDay: function (e) {
    this.initCalendar(
      new Date(
        e.currentTarget.dataset.year,
        e.currentTarget.dataset.month - 1,
        e.currentTarget.dataset.datenum
      )
    );
    this.setData({
      isToday: e.currentTarget.dataset.date
    });
    setTimeout(() => {
      this.hideCalendar();
      this.mockCalendarData();
    }, 500);
  },
  // 点击显示日历
  showCalendar: function () {
    this.getCalendar();
    this.setData({
      dateHide: true
    });
  },
  // 回到今天
  gotoToday: function () {
    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth();
    let nowWeek = nowDate.getDate();
    this.setData({
      year: nowYear,
      month: nowMonth + 1,
      isToday: "" + nowYear + (nowMonth + 1) + nowWeek
    });
    this.dateInit(nowYear, nowMonth, 0);
  },
  // 隐藏日历
  hideCalendar: function () {
    this.setData({
      dateHide: false
    });
  },
  // 日历页面假数据
  mockCalendarData: function () {
    let Random = Mock.Random;
    var res = Mock.mock({
      "data|2-4": [
        {
          "id|+1": 1,
          "country|1": ["美国", "日本", "欧洲", "中国"],
          "number|1-5": 1,
          title: "@ctitle(8,12)",
          "qianzhi|1-30.1": 1,
          "yuqi|1-30.1": 1,
          "gongbu|1-30.1": 1,
          time: "@time(hh:mm)",
          "label|1": ["利多金银", "", "利空金银", ""],
          img: Random.image("200x100", Random.color())
        }
      ]
    });
    this.setData({
      calendarData: res.data
    });
  },
})
