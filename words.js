// 영어 단어 데이터
const WORD_DATA = {
    "Unit1": {
        "Lesson1": [
            {"english": "enjoy", "korean": "즐기다", "pos": "동"},
            {"english": "textbook", "korean": "교과서", "pos": "명"},
            {"english": "touch", "korean": "만지다", "pos": "동"},
            {"english": "time", "korean": "시간", "pos": "명"},
            {"english": "year", "korean": "해, 년(年)", "pos": "명"},
            {"english": "answer", "korean": "대답하다, 답", "pos": "동명"},
            {"english": "river", "korean": "강", "pos": "명"},
            {"english": "useful", "korean": "유용한", "pos": "형"},
            {"english": "live", "korean": "살다", "pos": "동"},
            {"english": "potato", "korean": "감자", "pos": "명"}
        ],
        "Lesson2": [
            {"english": "hundred", "korean": "백(100)의, 백(100)", "pos": "형명"},
            {"english": "country", "korean": "1. 나라 2. 시골", "pos": "명"},
            {"english": "way", "korean": "1. 길 2. 방법", "pos": "명"},
            {"english": "become", "korean": "~이 되다", "pos": "동"},
            {"english": "mail", "korean": "(우편을) 부치다, 1. 우편 2. 우편물", "pos": "동명"},
            {"english": "picnic", "korean": "소풍", "pos": "명"},
            {"english": "joy", "korean": "기쁨", "pos": "명"},
            {"english": "finger", "korean": "손가락", "pos": "명"},
            {"english": "handsome", "korean": "잘생긴", "pos": "형"},
            {"english": "newspaper", "korean": "신문", "pos": "명"}
        ],
        "Lesson3": [
            {"english": "use", "korean": "사용하다", "pos": "동"},
            {"english": "worry", "korean": "걱정하다", "pos": "동"},
            {"english": "money", "korean": "돈", "pos": "명"},
            {"english": "son", "korean": "아들", "pos": "명"},
            {"english": "hope", "korean": "바라다, 희망", "pos": "동명"},
            {"english": "cage", "korean": "새장", "pos": "명"},
            {"english": "world", "korean": "세계", "pos": "명"},
            {"english": "daughter", "korean": "딸", "pos": "명"},
            {"english": "send", "korean": "보내다", "pos": "동"},
            {"english": "second", "korean": "두 번째의", "pos": "형"}
        ],
        "Lesson4": [
            {"english": "band", "korean": "(음악) 밴드", "pos": "명"},
            {"english": "plan", "korean": "계획, 계획하다", "pos": "명동"},
            {"english": "dead", "korean": "죽은", "pos": "형"},
            {"english": "call", "korean": "1. 전화하다 2. 부르다", "pos": "동"},
            {"english": "bell", "korean": "종", "pos": "명"},
            {"english": "subway", "korean": "지하철", "pos": "명"},
            {"english": "careful", "korean": "조심하는", "pos": "형"},
            {"english": "thirsty", "korean": "목마른", "pos": "형"},
            {"english": "corner", "korean": "모퉁이", "pos": "명"},
            {"english": "teach", "korean": "가르치다", "pos": "동"}
        ],
        "Lesson5": [
            {"english": "worry", "korean": "걱정하다", "pos": "동"},
            {"english": "world", "korean": "세계", "pos": "명"},
            {"english": "thirsty", "korean": "목마른", "pos": "형"},
            {"english": "corner", "korean": "모퉁이", "pos": "명"},
            {"english": "finger", "korean": "손가락", "pos": "명"},
            {"english": "way", "korean": "1. 길 2. 방법", "pos": "명"},
            {"english": "answer", "korean": "대답하다, 답", "pos": "동명"},
            {"english": "textbook", "korean": "교과서", "pos": "명"},
            {"english": "time", "korean": "시간", "pos": "명"},
            {"english": "careful", "korean": "조심하는", "pos": "형"}
        ]
    },
    "Unit2": {
        "Lesson1": [
            {"english": "letter", "korean": "1. 편지 2. 글자", "pos": "명"},
            {"english": "museum", "korean": "박물관", "pos": "명"},
            {"english": "foolish", "korean": "바보 같은", "pos": "형"},
            {"english": "place", "korean": "장소, 놓다", "pos": "명동"},
            {"english": "strawberry", "korean": "딸기", "pos": "명"},
            {"english": "nation", "korean": "나라", "pos": "명"},
            {"english": "picture", "korean": "1. 그림 2. 사진", "pos": "명"},
            {"english": "crowd", "korean": "군중", "pos": "명"},
            {"english": "understand", "korean": "이해하다", "pos": "동"},
            {"english": "rock", "korean": "돌, 바위", "pos": "명"}
        ],
        "Lesson2": [
            {"english": "branch", "korean": "나뭇가지", "pos": "명"},
            {"english": "hospital", "korean": "병원", "pos": "명"},
            {"english": "bank", "korean": "은행", "pos": "명"},
            {"english": "hurry", "korean": "서두르다", "pos": "동"},
            {"english": "airport", "korean": "공항", "pos": "명"},
            {"english": "company", "korean": "회사", "pos": "명"},
            {"english": "album", "korean": "앨범", "pos": "명"},
            {"english": "glass", "korean": "1. 유리 2. 유리잔", "pos": "명"},
            {"english": "dream", "korean": "꿈, 꿈꾸다", "pos": "명동"},
            {"english": "body", "korean": "몸", "pos": "명"}
        ],
        "Lesson3": [
            {"english": "moon", "korean": "달", "pos": "명"},
            {"english": "train", "korean": "기차", "pos": "명"},
            {"english": "forever", "korean": "영원히", "pos": "부"},
            {"english": "computer", "korean": "컴퓨터", "pos": "명"},
            {"english": "kid", "korean": "아이", "pos": "명"},
            {"english": "businessman", "korean": "사업가", "pos": "명"},
            {"english": "example", "korean": "예(例)", "pos": "명"},
            {"english": "busy", "korean": "바쁜", "pos": "형"},
            {"english": "hotel", "korean": "호텔", "pos": "명"},
            {"english": "afraid", "korean": "두려워하는", "pos": "형"}
        ],
        "Lesson4": [
            {"english": "fry", "korean": "기름에 튀기다", "pos": "동"},
            {"english": "aunt", "korean": "이모, 고모, 숙모", "pos": "명"},
            {"english": "trip", "korean": "(짧은) 여행", "pos": "명"},
            {"english": "enter", "korean": "들어가다", "pos": "동"},
            {"english": "garden", "korean": "정원", "pos": "명"},
            {"english": "fog", "korean": "안개", "pos": "명"},
            {"english": "guide", "korean": "1. 가이드 2. 안내서, 안내하다", "pos": "명동"},
            {"english": "travel", "korean": "여행하다, 여행", "pos": "동명"},
            {"english": "present", "korean": "1. 선물 2. 현재, 1. 출석한 2. 현재의", "pos": "명형"},
            {"english": "uncle", "korean": "삼촌, 이모부, 고모부", "pos": "명"}
        ],
        "Lesson5": [
            {"english": "letter", "korean": "1. 편지 2. 글자", "pos": "명"},
            {"english": "nation", "korean": "나라", "pos": "명"},
            {"english": "example", "korean": "예(例)", "pos": "명"},
            {"english": "afraid", "korean": "두려워하는", "pos": "형"},
            {"english": "fog", "korean": "안개", "pos": "명"},
            {"english": "present", "korean": "1. 선물 2. 현재, 1. 출석한 2. 현재의", "pos": "명형"},
            {"english": "body", "korean": "몸", "pos": "명"},
            {"english": "hurry", "korean": "서두르다", "pos": "동"},
            {"english": "businessman", "korean": "사업가", "pos": "명"},
            {"english": "fry", "korean": "기름에 튀기다", "pos": "동"}
        ]
    },
    "Unit3": {
        "Lesson1": [
            {"english": "skin", "korean": "피부", "pos": "명"},
            {"english": "light", "korean": "빛, 가벼운", "pos": "명형"},
            {"english": "wife", "korean": "아내", "pos": "명"},
            {"english": "land", "korean": "땅", "pos": "명"},
            {"english": "drink", "korean": "마시다", "pos": "동"},
            {"english": "carry", "korean": "나르다", "pos": "동"},
            {"english": "chance", "korean": "기회", "pos": "명"},
            {"english": "side", "korean": "옆", "pos": "명"},
            {"english": "farm", "korean": "농장", "pos": "명"},
            {"english": "history", "korean": "역사", "pos": "명"}
        ],
        "Lesson2": [
            {"english": "grape", "korean": "포도", "pos": "명"},
            {"english": "card", "korean": "카드", "pos": "명"},
            {"english": "song", "korean": "노래", "pos": "명"},
            {"english": "sleepy", "korean": "졸린", "pos": "형"},
            {"english": "about", "korean": "~에 대하여, 대략, 약", "pos": "전부"},
            {"english": "climb", "korean": "오르다", "pos": "동"},
            {"english": "free", "korean": "1. 자유로운 2. 공짜의", "pos": "형"},
            {"english": "famous", "korean": "유명한", "pos": "형"},
            {"english": "restaurant", "korean": "레스토랑, 식당", "pos": "명"},
            {"english": "part", "korean": "부분", "pos": "명"}
        ],
        "Lesson3": [
            {"english": "fool", "korean": "바보", "pos": "명"},
            {"english": "ring", "korean": "반지, (종) 울리다", "pos": "명동"},
            {"english": "boat", "korean": "보트", "pos": "명"},
            {"english": "arrive", "korean": "도착하다", "pos": "동"},
            {"english": "actor", "korean": "배우", "pos": "명"},
            {"english": "parents", "korean": "부모님", "pos": "명"},
            {"english": "kitchen", "korean": "부엌", "pos": "명"},
            {"english": "human", "korean": "인간의, 인간", "pos": "형명"},
            {"english": "town", "korean": "(소)도시", "pos": "명"},
            {"english": "course", "korean": "과목, 강좌", "pos": "명"}
        ],
        "Lesson4": [
            {"english": "bring", "korean": "가져오다, 데려오다", "pos": "동"},
            {"english": "hill", "korean": "언덕", "pos": "명"},
            {"english": "bread", "korean": "빵", "pos": "명"},
            {"english": "heat", "korean": "열기", "pos": "명"},
            {"english": "show", "korean": "쇼, 공연, 보여 주다", "pos": "명동"},
            {"english": "cover", "korean": "덮다, 덮개", "pos": "동명"},
            {"english": "cream", "korean": "크림", "pos": "명"},
            {"english": "road", "korean": "도로", "pos": "명"},
            {"english": "news", "korean": "소식", "pos": "명"},
            {"english": "shop", "korean": "가게, 쇼핑하다", "pos": "명동"}
        ],
        "Lesson5": [
            {"english": "light", "korean": "빛, 가벼운", "pos": "명형"},
            {"english": "carry", "korean": "나르다", "pos": "동"},
            {"english": "kitchen", "korean": "부엌", "pos": "명"},
            {"english": "fool", "korean": "바보", "pos": "명"},
            {"english": "famous", "korean": "유명한", "pos": "형"},
            {"english": "climb", "korean": "오르다", "pos": "동"},
            {"english": "heat", "korean": "열기", "pos": "명"},
            {"english": "road", "korean": "도로", "pos": "명"},
            {"english": "cover", "korean": "덮다, 덮개", "pos": "동명"},
            {"english": "actor", "korean": "배우", "pos": "명"}
        ]
    },
    "Unit4": {
        "Lesson1": [
            {"english": "street", "korean": "거리, 길", "pos": "명"},
            {"english": "calendar", "korean": "달력", "pos": "명"},
            {"english": "hunt", "korean": "사냥하다", "pos": "동"},
            {"english": "ask", "korean": "묻다", "pos": "동"},
            {"english": "husband", "korean": "남편", "pos": "명"},
            {"english": "mask", "korean": "가면", "pos": "명"},
            {"english": "happiness", "korean": "행복", "pos": "명"},
            {"english": "glove", "korean": "장갑", "pos": "명"},
            {"english": "enough", "korean": "충분한, 충분히", "pos": "형부"},
            {"english": "doctor", "korean": "의사", "pos": "명"}
        ],
        "Lesson2": [
            {"english": "pencil", "korean": "연필", "pos": "명"},
            {"english": "break", "korean": "부수다", "pos": "동"},
            {"english": "plane", "korean": "비행기", "pos": "명"},
            {"english": "job", "korean": "직장, 일", "pos": "명"},
            {"english": "mountain", "korean": "산", "pos": "명"},
            {"english": "life", "korean": "1. 생명(체) 2. 인생", "pos": "명"},
            {"english": "grow", "korean": "자라다", "pos": "동"},
            {"english": "earth", "korean": "지구", "pos": "명"},
            {"english": "finish", "korean": "끝내다", "pos": "동"},
            {"english": "danger", "korean": "위험", "pos": "명"}
        ],
        "Lesson3": [
            {"english": "fail", "korean": "실패하다, 실패", "pos": "동명"},
            {"english": "tooth", "korean": "치아", "pos": "명"},
            {"english": "pass", "korean": "통과하다, 통과", "pos": "동명"},
            {"english": "student", "korean": "학생", "pos": "명"},
            {"english": "full", "korean": "가득 찬", "pos": "형"},
            {"english": "build", "korean": "짓다", "pos": "동"},
            {"english": "walk", "korean": "걷다, 산책", "pos": "동명"},
            {"english": "true", "korean": "진실의, 사실의", "pos": "형"},
            {"english": "exit", "korean": "출구, 나가다", "pos": "명동"},
            {"english": "voice", "korean": "목소리", "pos": "명"}
        ],
        "Lesson4": [
            {"english": "push", "korean": "밀다", "pos": "동"},
            {"english": "listen", "korean": "듣다", "pos": "동"},
            {"english": "catch", "korean": "잡다", "pos": "동"},
            {"english": "keep", "korean": "간직하다", "pos": "동"},
            {"english": "tower", "korean": "탑", "pos": "명"},
            {"english": "notebook", "korean": "공책", "pos": "명"},
            {"english": "doll", "korean": "인형", "pos": "명"},
            {"english": "close", "korean": "닫다", "pos": "동"},
            {"english": "print", "korean": "인쇄하다, 인쇄", "pos": "동명"},
            {"english": "quick", "korean": "빠른", "pos": "형"}
        ],
        "Lesson5": [
            {"english": "fail", "korean": "실패하다, 실패", "pos": "동명"},
            {"english": "walk", "korean": "걷다, 산책", "pos": "동명"},
            {"english": "earth", "korean": "지구", "pos": "명"},
            {"english": "break", "korean": "부수다", "pos": "동"},
            {"english": "calendar", "korean": "달력", "pos": "명"},
            {"english": "mask", "korean": "가면", "pos": "명"},
            {"english": "keep", "korean": "간직하다", "pos": "동"},
            {"english": "catch", "korean": "잡다", "pos": "동"},
            {"english": "tower", "korean": "탑", "pos": "명"},
            {"english": "ask", "korean": "묻다", "pos": "동"}
        ]
    },
    "Unit5": {
        "Lesson1": [
            {"english": "balloon", "korean": "풍선", "pos": "명"},
            {"english": "care", "korean": "1. 조심 2. 보살핌", "pos": "명"},
            {"english": "office", "korean": "사무실", "pos": "명"},
            {"english": "sound", "korean": "소리, 소리가 나다", "pos": "명동"},
            {"english": "sport", "korean": "스포츠", "pos": "명"},
            {"english": "word", "korean": "단어", "pos": "명"},
            {"english": "room", "korean": "방", "pos": "명"},
            {"english": "bicycle", "korean": "자전거", "pos": "명"},
            {"english": "paint", "korean": "페인트 칠하다, 페인트", "pos": "동명"},
            {"english": "building", "korean": "건물", "pos": "명"}
        ],
        "Lesson2": [
            {"english": "beach", "korean": "해변", "pos": "명"},
            {"english": "guess", "korean": "추측하다", "pos": "동"},
            {"english": "mirror", "korean": "거울", "pos": "명"},
            {"english": "accident", "korean": "1. 사고 2. 우연", "pos": "명"},
            {"english": "stone", "korean": "돌", "pos": "명"},
            {"english": "fact", "korean": "사실", "pos": "명"},
            {"english": "fire", "korean": "불, 해고하다", "pos": "명동"},
            {"english": "animal", "korean": "동물", "pos": "명"},
            {"english": "think", "korean": "생각하다", "pos": "동"},
            {"english": "bake", "korean": "(빵을) 굽다", "pos": "동"}
        ],
        "Lesson3": [
            {"english": "brave", "korean": "용감한", "pos": "형"},
            {"english": "ship", "korean": "배", "pos": "명"},
            {"english": "age", "korean": "나이", "pos": "명"},
            {"english": "talk", "korean": "말하다", "pos": "동"},
            {"english": "kill", "korean": "죽이다", "pos": "동"},
            {"english": "weather", "korean": "날씨", "pos": "명"},
            {"english": "fix", "korean": "1. 고치다 2. 고정시키다", "pos": "동"},
            {"english": "collect", "korean": "모으다", "pos": "동"},
            {"english": "find", "korean": "찾다", "pos": "동"},
            {"english": "study", "korean": "공부하다", "pos": "동"}
        ],
        "Lesson4": [
            {"english": "air", "korean": "공기", "pos": "명"},
            {"english": "college", "korean": "대학", "pos": "명"},
            {"english": "shirt", "korean": "셔츠", "pos": "명"},
            {"english": "drive", "korean": "운전하다", "pos": "동"},
            {"english": "work", "korean": "일하다, 일", "pos": "동명"},
            {"english": "hour", "korean": "시간", "pos": "명"},
            {"english": "gold", "korean": "금", "pos": "명"},
            {"english": "heart", "korean": "1. 심장 2. 마음", "pos": "명"},
            {"english": "clothes", "korean": "옷", "pos": "명"},
            {"english": "angry", "korean": "화난", "pos": "형"}
        ],
        "Lesson5": [
            {"english": "fact", "korean": "사실", "pos": "명"},
            {"english": "beach", "korean": "해변", "pos": "명"},
            {"english": "angry", "korean": "화난", "pos": "형"},
            {"english": "drive", "korean": "운전하다", "pos": "동"},
            {"english": "balloon", "korean": "풍선", "pos": "명"},
            {"english": "word", "korean": "단어", "pos": "명"},
            {"english": "collect", "korean": "모으다", "pos": "동"},
            {"english": "kill", "korean": "죽이다", "pos": "동"},
            {"english": "fix", "korean": "1. 고치다 2. 고정시키다", "pos": "동"},
            {"english": "guess", "korean": "추측하다", "pos": "동"}
        ]
    },
    "Unit6": {
        "Lesson1": [
            {"english": "autumn", "korean": "가을", "pos": "명"},
            {"english": "ground", "korean": "땅", "pos": "명"},
            {"english": "believe", "korean": "믿다", "pos": "동"},
            {"english": "store", "korean": "가게", "pos": "명"},
            {"english": "lately", "korean": "최근에", "pos": "부"},
            {"english": "buy", "korean": "사다", "pos": "동"},
            {"english": "head", "korean": "머리", "pos": "명"},
            {"english": "library", "korean": "도서관", "pos": "명"},
            {"english": "hold", "korean": "잡다", "pos": "동"},
            {"english": "holiday", "korean": "휴일", "pos": "명"}
        ],
        "Lesson2": [
            {"english": "alone", "korean": "혼자", "pos": "부"},
            {"english": "sandwich", "korean": "샌드위치", "pos": "명"},
            {"english": "camera", "korean": "카메라", "pos": "명"},
            {"english": "mind", "korean": "정신", "pos": "명"},
            {"english": "window", "korean": "창문", "pos": "명"},
            {"english": "return", "korean": "돌아가다(오다)", "pos": "동"},
            {"english": "family", "korean": "가족", "pos": "명"},
            {"english": "field", "korean": "들판", "pos": "명"},
            {"english": "member", "korean": "회원", "pos": "명"},
            {"english": "strong", "korean": "힘센", "pos": "형"}
        ],
        "Lesson3": [
            {"english": "rich", "korean": "부유한", "pos": "형"},
            {"english": "watermelon", "korean": "수박", "pos": "명"},
            {"english": "quiet", "korean": "조용한", "pos": "형"},
            {"english": "pear", "korean": "(과일) 배", "pos": "명"},
            {"english": "try", "korean": "1. 노력하다 2. 시도하다", "pos": "동"},
            {"english": "want", "korean": "원하다", "pos": "동"},
            {"english": "wood", "korean": "나무, 목재", "pos": "명"},
            {"english": "problem", "korean": "문제", "pos": "명"},
            {"english": "floor", "korean": "1. 바닥 2. 층", "pos": "명"},
            {"english": "wear", "korean": "(옷) 입다, (신발) 신다, (모자) 쓰다", "pos": "동"}
        ],
        "Lesson4": [
            {"english": "decide", "korean": "결정하다", "pos": "동"},
            {"english": "cash", "korean": "현금", "pos": "명"},
            {"english": "culture", "korean": "문화", "pos": "명"},
            {"english": "bear", "korean": "곰", "pos": "명"},
            {"english": "dish", "korean": "접시", "pos": "명"},
            {"english": "bone", "korean": "뼈", "pos": "명"},
            {"english": "carrot", "korean": "당근", "pos": "명"},
            {"english": "short", "korean": "짧은, 키가 작은", "pos": "형"},
            {"english": "different", "korean": "다른", "pos": "형"},
            {"english": "sand", "korean": "모래", "pos": "명"}
        ],
        "Lesson5": [
            {"english": "dish", "korean": "접시", "pos": "명"},
            {"english": "short", "korean": "짧은, 키가 작은", "pos": "형"},
            {"english": "problem", "korean": "문제", "pos": "명"},
            {"english": "quiet", "korean": "조용한", "pos": "형"},
            {"english": "mind", "korean": "정신", "pos": "명"},
            {"english": "return", "korean": "돌아가다(오다)", "pos": "동"},
            {"english": "buy", "korean": "사다", "pos": "동"},
            {"english": "lately", "korean": "최근에", "pos": "부"},
            {"english": "holiday", "korean": "휴일", "pos": "명"},
            {"english": "decide", "korean": "결정하다", "pos": "동"}
        ]
    },
    "Unit7": {
        "Lesson1": [
            {"english": "agree", "korean": "동의하다", "pos": "동"},
            {"english": "humor", "korean": "유머", "pos": "명"},
            {"english": "church", "korean": "교회", "pos": "명"},
            {"english": "factory", "korean": "공장", "pos": "명"},
            {"english": "crown", "korean": "왕관", "pos": "명"},
            {"english": "fight", "korean": "싸우다, 싸움", "pos": "동명"},
            {"english": "adventure", "korean": "모험", "pos": "명"},
            {"english": "chocolate", "korean": "초콜릿", "pos": "명"},
            {"english": "exercise", "korean": "운동, 운동하다", "pos": "명동"},
            {"english": "large", "korean": "(규모, 크기) 큰", "pos": "형"}
        ],
        "Lesson2": [
            {"english": "scientist", "korean": "과학자", "pos": "명"},
            {"english": "grass", "korean": "잔디, 풀", "pos": "명"},
            {"english": "restroom", "korean": "화장실", "pos": "명"},
            {"english": "film", "korean": "1. 영화 2. 필름", "pos": "명"},
            {"english": "cousin", "korean": "사촌", "pos": "명"},
            {"english": "shock", "korean": "충격, 충격을 주다", "pos": "명동"},
            {"english": "rocket", "korean": "로켓", "pos": "명"},
            {"english": "speed", "korean": "속도", "pos": "명"},
            {"english": "blackboard", "korean": "칠판", "pos": "명"},
            {"english": "robot", "korean": "로봇", "pos": "명"}
        ],
        "Lesson3": [
            {"english": "happy", "korean": "행복한", "pos": "형"},
            {"english": "police", "korean": "경찰", "pos": "명"},
            {"english": "miss", "korean": "1. 놓치다 2. 그리워하다", "pos": "동"},
            {"english": "bright", "korean": "1. 밝은 2. 명석한", "pos": "형"},
            {"english": "address", "korean": "주소", "pos": "명"},
            {"english": "line", "korean": "줄", "pos": "명"},
            {"english": "ticket", "korean": "표, 티켓", "pos": "명"},
            {"english": "circle", "korean": "원형, 동그라미", "pos": "명"},
            {"english": "pocket", "korean": "주머니", "pos": "명"},
            {"english": "farmer", "korean": "농부", "pos": "명"}
        ],
        "Lesson4": [
            {"english": "choose", "korean": "고르다", "pos": "동"},
            {"english": "west", "korean": "서쪽", "pos": "명"},
            {"english": "future", "korean": "미래", "pos": "명"},
            {"english": "bite", "korean": "물다", "pos": "동"},
            {"english": "east", "korean": "동쪽", "pos": "명"},
            {"english": "coin", "korean": "동전", "pos": "명"},
            {"english": "south", "korean": "남쪽", "pos": "명"},
            {"english": "cart", "korean": "수레", "pos": "명"},
            {"english": "business", "korean": "사업", "pos": "명"},
            {"english": "north", "korean": "북쪽", "pos": "명"}
        ],
        "Lesson5": [
            {"english": "north", "korean": "북쪽", "pos": "명"},
            {"english": "choose", "korean": "고르다", "pos": "동"},
            {"english": "farmer", "korean": "농부", "pos": "명"},
            {"english": "bright", "korean": "1. 밝은 2. 명석한", "pos": "형"},
            {"english": "cousin", "korean": "사촌", "pos": "명"},
            {"english": "speed", "korean": "속도", "pos": "명"},
            {"english": "large", "korean": "(규모, 크기) 큰", "pos": "형"},
            {"english": "agree", "korean": "동의하다", "pos": "동"},
            {"english": "blackboard", "korean": "칠판", "pos": "명"},
            {"english": "cart", "korean": "수레", "pos": "명"}
        ]
    },
    "Unit8": {
        "Lesson1": [
            {"english": "die", "korean": "죽다", "pos": "동"},
            {"english": "ready", "korean": "준비가 된", "pos": "형"},
            {"english": "bean", "korean": "콩", "pos": "명"},
            {"english": "never", "korean": "결코 ~않다", "pos": "부"},
            {"english": "across", "korean": "건너편에", "pos": "전"},
            {"english": "cry", "korean": "1. 울다 2. 소리치다", "pos": "동"},
            {"english": "move", "korean": "1. 움직이다 2. 이사하다", "pos": "동"},
            {"english": "breakfast", "korean": "아침 식사", "pos": "명"},
            {"english": "cute", "korean": "귀여운", "pos": "형"},
            {"english": "cloud", "korean": "구름", "pos": "명"}
        ],
        "Lesson2": [
            {"english": "write", "korean": "(글) 쓰다", "pos": "동"},
            {"english": "difficult", "korean": "어려운", "pos": "형"},
            {"english": "castle", "korean": "성(城)", "pos": "명"},
            {"english": "fever", "korean": "열", "pos": "명"},
            {"english": "change", "korean": "변하다, 변화", "pos": "동명"},
            {"english": "add", "korean": "더하다", "pos": "동"},
            {"english": "brush", "korean": "붓, 솔질하다", "pos": "명동"},
            {"english": "always", "korean": "항상", "pos": "부"},
            {"english": "lesson", "korean": "1. 수업 2. 교훈", "pos": "명"},
            {"english": "near", "korean": "~가까이에, 가까이, 가까운", "pos": "전부형"}
        ],
        "Lesson3": [
            {"english": "easy", "korean": "쉬운", "pos": "형"},
            {"english": "triangle", "korean": "삼각형", "pos": "명"},
            {"english": "between", "korean": "~사이에", "pos": "전"},
            {"english": "invite", "korean": "초대하다", "pos": "동"},
            {"english": "left", "korean": "왼쪽의, 왼쪽", "pos": "형명"},
            {"english": "like", "korean": "좋아하다, ~와 비슷한", "pos": "동전"},
            {"english": "bubble", "korean": "거품", "pos": "명"},
            {"english": "sell", "korean": "팔다", "pos": "동"},
            {"english": "dolphin", "korean": "돌고래", "pos": "명"},
            {"english": "win", "korean": "이기다", "pos": "동"}
        ],
        "Lesson4": [
            {"english": "ago", "korean": "전에", "pos": "부"},
            {"english": "ugly", "korean": "못생긴", "pos": "형"},
            {"english": "birthday", "korean": "생일", "pos": "명"},
            {"english": "salt", "korean": "소금", "pos": "명"},
            {"english": "file", "korean": "파일, 서류철, (항목별로) 철하다", "pos": "명동"},
            {"english": "behind", "korean": "~뒤에, 뒤에", "pos": "전부"},
            {"english": "headache", "korean": "두통", "pos": "명"},
            {"english": "block", "korean": "막다, (나무, 돌) 덩어리", "pos": "동명"},
            {"english": "learn", "korean": "배우다", "pos": "동"},
            {"english": "turn", "korean": "돌다, 돌리다", "pos": "동"}
        ],
        "Lesson5": [
            {"english": "castle", "korean": "성(城)", "pos": "명"},
            {"english": "near", "korean": "~가까이에, 가까이, 가까운", "pos": "전부형"},
            {"english": "triangle", "korean": "삼각형", "pos": "명"},
            {"english": "sell", "korean": "팔다", "pos": "동"},
            {"english": "ugly", "korean": "못생긴", "pos": "형"},
            {"english": "behind", "korean": "~뒤에, 뒤에", "pos": "전부"},
            {"english": "cloud", "korean": "구름", "pos": "명"},
            {"english": "move", "korean": "1. 움직이다 2. 이사하다", "pos": "동"},
            {"english": "ago", "korean": "전에", "pos": "부"},
            {"english": "invite", "korean": "초대하다", "pos": "동"}
        ]
    }
};

// 단어 관리 클래스
class WordManager {
    constructor() {
        this.wordData = WORD_DATA;
    }

    // 모든 Unit 목록 반환
    getAllUnits() {
        return Object.keys(this.wordData);
    }

    // 특정 Unit의 모든 Lesson 목록 반환
    getLessonsInUnit(unit) {
        if (unit in this.wordData) {
            return Object.keys(this.wordData[unit]);
        }
        return [];
    }

    // 선택된 Unit들에서 단어 목록 가져오기
    getWordsFromSelection(selectedUnits) {
        const words = [];
        
        selectedUnits.forEach(unit => {
            if (unit in this.wordData) {
                Object.keys(this.wordData[unit]).forEach(lesson => {
                    this.wordData[unit][lesson].forEach(wordData => {
                        words.push({
                            english: wordData.english,
                            korean: wordData.korean,
                            pos: wordData.pos,
                            unit: unit,
                            lesson: lesson
                        });
                    });
                });
            }
        });
        
        return words;
    }

    // 선택된 Unit들의 총 단어 수 반환
    getWordCountFromSelection(selectedUnits) {
        return this.getWordsFromSelection(selectedUnits).length;
    }

    // 랜덤 단어 가져오기
    getRandomWord(selectedUnits) {
        const allWords = this.getWordsFromSelection(selectedUnits);
        if (allWords.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * allWords.length);
        return allWords[randomIndex];
    }

    // 틀린 답 3개 생성 (정답과 다른 단어들에서)
    getWrongAnswers(correctWord, selectedUnits, count = 3) {
        const allWords = this.getWordsFromSelection(selectedUnits);
        const wrongAnswers = [];
        
        // 정답과 다른 단어들만 필터링
        const otherWords = allWords.filter(word => 
            word.english !== correctWord.english
        );
        
        // 랜덤하게 3개 선택
        while (wrongAnswers.length < count && wrongAnswers.length < otherWords.length) {
            const randomIndex = Math.floor(Math.random() * otherWords.length);
            const word = otherWords[randomIndex];
            
            // 이미 선택된 답이 아닌 경우에만 추가
            if (!wrongAnswers.some(w => w.korean === word.korean)) {
                wrongAnswers.push(word);
            }
        }
        
        return wrongAnswers;
    }

    // 4지선다 문제 생성
    generateMultipleChoice(selectedUnits) {
        const correctWord = this.getRandomWord(selectedUnits);
        if (!correctWord) return null;
        
        const wrongAnswers = this.getWrongAnswers(correctWord, selectedUnits);
        
        // 정답과 오답을 섞어서 선택지 생성
        const choices = [correctWord, ...wrongAnswers];
        
        // 배열 섞기 (Fisher-Yates Shuffle)
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        
        return {
            question: correctWord.english,
            correctAnswer: correctWord.korean,
            choices: choices.map(choice => choice.korean),
            correctIndex: choices.findIndex(choice => choice.korean === correctWord.korean),
            wordInfo: correctWord
        };
    }
}