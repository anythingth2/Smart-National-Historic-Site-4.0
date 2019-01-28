# Smart-National-Historic-Site-4.0
A back-end of Smart National Historic Site system.
This system got 1st runner up award from Top Gun Rally 2019 by Team `ขิง ข่า คะไคร้ ใบมะกรูด`.

## Overview
#### Sensor Monitoring System
Fetch sensor infomations (e.g. Humidity, Temperature)  from LoRa (A wireless communitcation) though CAT gateway and provide those infomation on LINE when user message `Admin_Mon` to admin account.

<img src="https://lh3.googleusercontent.com/VCQBQEJoO1vdbCCANT-pIJa8YCW6GrrdbugFIvnTRhh2a2dATmqNcovgGPS2xZH9l-vdZ6HBRT_1CmPZPk3sEoY8kVp9nQbXEk7i5Nmal8pRFs7lbXNc2MCQsqFI1aGuKzVP8vZx4RRSPGWpxHsD_zU9luUbBQpgjAOfeN7BePs_m39cKos9Bk1m9tIF-sIS-tPsvOmV6cEQSA1JCrJbn9GJSsEU50dd6AWfe5B7-8OlkbOiPL4RuKjwi95Cqrcq4-nJNodts3JbgFMzHm8FJQM62NMxohlaV2DyBK4IGY5BqswE02FE_fTJX8oEhNx5SqhFQsvsLzWjoNKO_q8m1UrRTrr9uSZcSff7EIjz5dRqjaHJIGCbFrMFhJ8ZfjH5lqVxa1IIIqTsJ8g_NLZDG9Q2zhhyY1hYYzlYf0SQ1ioypwTlR8hVkHMfObo-pf40S02kZm0Syn2iVscQl6Q58PY4tfwjmtpOJpUh9hpTef0dqMHKDVTGhQGnpyMTMToufaKy8f8XthSIX2E22PZV4Yxi7Rh8URxrQkfSx3F84GDjqOmsrSyqGavyQS4BLecdhOaC6QQrrwlH23u3UY8AAKrVDLkkcPjARXDpYQdDuiczU6Om-zSNaKVePJXuH2jE1abFBf-lw_mzvs4AK9o2eNjj=w456-h947-no">

#### Tourist trend regression
Using LSTM in TensorflowJS for regression.

#### Tourist Counter 
Count number of tourist by LINE Beacon and distance sensor on STM32.

#### Basic Chat Bot
Chat bot for asking some infomation from admin account. Using DialogFlow.
