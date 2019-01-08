const card = {
  "type": "bubble",
  "hero": {
    "type": "image",
    "url": "https://sites.google.com/site/5751410084jirawadeepetchkorn/_/rsrc/1417593780473/sthan-thi-thxng-theiyw/2-phrarachwang-snam-canthr/E76_1989.jpg",
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover",
    "action": {
      "type": "uri",
      "uri": "https://th.wikipedia.org/wiki/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C"
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "พระราชวังสนามจันทร์",
        "weight": "bold",
        "size": "xl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "ประเภท",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 2
              },
              {
                "type": "text",
                "text": "พระราชวัง",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 4
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "ปีก่อสร้าง",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 2
              },
              {
                "type": "text",
                "text": "พ.ศ. 2450",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 4
              }
            ]
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "ผู้สร้าง",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 2
              },
              {
                "type": "text",
                "text": "\tพระบาทสมเด็จพระมงกุฎเกล้าเจ้าอยู่หัว",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 4
              }
            ]
          }
        ]
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "vertical",
    "spacing": "sm",
    "contents": [
      {
        "type": "button",
        "style": "link",
        "height": "sm",
        "action": {
          "type": "uri",
          "label": "WEBSITE",
          "uri": "https://th.wikipedia.org/wiki/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A7%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B9%8C"
        }
      },
      {
        "type": "spacer",
        "size": "sm"
      }
    ],
    "flex": 0
  }
}

export default {
  card
}