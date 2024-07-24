# MJ BOT 

MJ Bot은 다양한 편리한 도구기능을 하는 디스코드 봇입니다.
<br>
MJ Bot의 접두사는 ``/``로, 채팅창에 입력 시 슬래시 커멘드가 활성화됩니다. 

![image](https://makejoy.co.kr/github/imgs/mjbot/slash.png)

- 개발자: [makejoy](https://makejoy.co.kr)
- 개발 언어: node.js
- 버전: 1.0

**[![봇 초대하기](https://img.shields.io/badge/%EB%B4%87%20%EC%B4%88%EB%8C%80%ED%95%98%EA%B8%B0-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/api/oauth2/authorize?client_id=931341870439731270&permissions=8&scope=bot)**


# Ver 1.0 기능

- 사용자가 디스코드 이모지를 전송하면, 자동으로 확대합니다.<br>

![image](https://makejoy.co.kr/github/imgs/mjbot/emoji.png)<br><br>

- 슬래시 명령어 

``/enko`` : 한글 영타 자동변환 설정을 활성화 또는 비활성화합니다.<br>

![image](https://makejoy.co.kr/github/imgs/mjbot/enko.png)<br><br>

<details>
    <summary>[사용불가] /자동번역 (naver papago API 지원 종료) [접기/펼치기]</summary>
  
``/자동번역`` : 지원하는 언어 자동번역 설정을 활성화 또는 비활성화합니다.<br>
![image](https://makejoy.co.kr/github/imgs/mjbot/auto_trans.png)
<br><br>
</details>

``/프로필`` ``@유저멘션`` : 멘션한 유저의 프로필 사진 및 정보를 확인합니다. (멘션 생략 시 본인의 프로필 정보)<br>

![image](https://makejoy.co.kr/github/imgs/mjbot/avatar.png)<br><br>

<details>
    <summary>[사용불가] /번역 (naver papago API 지원 종료) [접기/펼치기]</summary>
  
``/번역`` ``텍스트`` ``언어`` : 텍스트를 다른 언어로 번역합니다.<br>
(지원 언어 : 한국어, 영어, 일본어, 중국어 간체/번체, 프랑스어, 독일어, 러시아어, 스페인어, 베트남어, 인도네시아어, 태국어)<br>
![image](https://makejoy.co.kr/github/imgs/mjbot/auto_trans.png)
<br><br>
</details>

``/청소`` ``숫자`` : 입력한 숫자만큼의 메시지를 삭제합니다.<br>
(숫자는 1~100 까지 입력할 수 있으며, 관리자 권한이 없는 유저는 자신의 메시지만 삭제됩니다.)<br>

![image](https://makejoy.co.kr/github/imgs/mjbot/clean.png)<br><br>

## **봇 설치 및 사용법**

**1.** 노드 설치 (Latest LTS) [NodeJS](https://nodejs.org/ko/)

**2.** 이 저장소를 다운로드하고 압축 해제 | 또는 git clone

**3.**  **`예시.env`** 파일을 참조하여 **`.env`** 파일 생성 후 정보 입력 

### _.env 파일 필수 입력_

```env
PREFIX=BOT_PREFIX
SUB_PREFIX=BOT_SUB_PREFIX
# (naver papago API 지원 종료) NAVER_CLIENT_ID=NAVER_CLIENT_ID
# (naver papago API 지원 종료) NAVER_CLIENT_SECRET=NAVER_CLIENT_SECRET
TOKEN=BOT_TOKEN
```

**4.** 노드 모듈 설치/업데이트를 위해, Shell에서 다음 코드를 그대로 실행합니다. <br/>

```shell
npm install @discordjs/rest inko axios
```

**5.** 봇을 실행합니다. (택1)<br/>

```shell
npm start
```

```shell
yarn start
```
