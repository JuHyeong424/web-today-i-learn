# DB 실습 - DDL(Data Definition Language) 답안지

# 문제 1: 테이블 생성 및 데이터 전송 (정규화)
## 1.1 중복 데이터 확인
attendance 테이블에서 crew_id와 nickname은 항상 1:1로 대응되지만, 모든 행에 반복적으로 나타나고 있습니다. 따라서 nickname은 중복 데이터로 간주됩니다.

## 1.2 크루 정보 추출 쿼리
중복을 제거하여 고유한 크루 정보(ID와 닉네임)만 추출합니다.

```
SELECT DISTINCT `crew_id`, `nickname` FROM `attendance`;
```

## 1.3 crew 테이블 생성
추출된 정보를 담을 새로운 마스터 테이블을 생성합니다.

```
CREATE TABLE `crew` (
  `crew_id` INT NOT NULL AUTO_INCREMENT,
  `nickname` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`crew_id`)
);
```

## 1.4 데이터 마이그레이션 (INSERT INTO SELECT)
기존 attendance 테이블의 데이터를 crew 테이블로 옮깁니다.

```
INSERT INTO `crew` (`crew_id`, `nickname`)
SELECT DISTINCT `crew_id`, `nickname` FROM `attendance`;
```

# 문제 2: 불필요한 컬럼 삭제
crew 테이블을 생성하여 닉네임을 관리하게 되었으므로, attendance 테이블의 nickname 컬럼은 더 이상 필요하지 않습니다. (관심사의 분리 및 데이터 중복 제거)

## 2.1 컬럼 삭제 쿼리
```
ALTER TABLE `attendance` DROP COLUMN `nickname`;
```

# 문제 3: 외래키(Foreign Key) 설정
attendance 테이블의 crew_id가 실제로 존재하지 않는 크루를 가리키거나, 부모 데이터가 삭제되었을 때 고아 데이터가 남는 것을 방지하기 위해 제약 조건을 추가합니다.

## 3.1 외래키 제약 조건 추가
```
ALTER TABLE `attendance` 
ADD CONSTRAINT `fk_attendance_crew` 
FOREIGN KEY (`crew_id`) REFERENCES `crew` (`crew_id`)
ON DELETE RESTRICT 
ON UPDATE CASCADE;
```
참고: 실무에서는 데이터 보존을 위해 ON DELETE RESTRICT를 주로 사용하거나, 비즈니스 요구사항에 따라 CASCADE를 선택합니다.

# 문제 4: 유니크 키(Unique Key) 설정
우아한테크코스의 정책상 닉네임은 중복될 수 없습니다. 데이터베이스 레벨에서 이를 강제하여 서비스의 정합성을 유지합니다.

## 4.1 유니크 제약 조건 추가
```
ALTER TABLE `crew` ADD UNIQUE (`nickname`);
```

# 문제 5: 크루 닉네임 검색 (LIKE)
상황: 닉네임이 '디'로 시작하는 크루 찾기

```
SELECT * FROM `crew` 
WHERE `nickname` LIKE '디%';
```

# 문제 6: 특정 크루의 출석 기록 확인 (WHERE)
상황: '어셔'의 3월 6일 기록 누락 여부 확인

```
SELECT * FROM `attendance` 
WHERE `crew_id` = (SELECT `crew_id` FROM `crew` WHERE `nickname` = '어셔')
  AND `attendance_date` = '2025-03-06';
```

# 문제 7: 누락된 출석 기록 추가 (INSERT)
상황: '어셔'의 누락된 3월 6일 출석 데이터 삽입

`
-- 어셔의 crew_id가 13이라고 가정할 경우
INSERT INTO `attendance` (`crew_id`, `attendance_date`, `start_time`, `end_time`) 
VALUES (13, '2025-03-06', '09:31:00', '18:01:00');
`

# 문제 8: 잘못된 출석 기록 수정 (UPDATE)
상황: '주니'의 3월 12일 등교 시간을 10:05에서 10:00으로 수정

`
UPDATE `attendance` 
SET `start_time` = '10:00:00' 
WHERE `crew_id` = (SELECT `crew_id` FROM `crew` WHERE `nickname` = '주니') 
  AND `attendance_date` = '2025-03-12';
`

# 문제 9: 허위 출석 기록 삭제 (DELETE)
상황: '아론'의 3월 12일 허위 출석 기록 삭제

```
DELETE FROM `attendance` 
WHERE `crew_id` = (SELECT `crew_id` FROM `crew` WHERE `nickname` = '아론') 
  AND `attendance_date` = '2025-03-12';
```  

# 문제 10: 닉네임을 포함한 출석 정보 조회 (JOIN)
상황: crew_id 대신 실제 nickname을 포함하여 전체 출석부 출력

```
SELECT c.`nickname`, a.`attendance_date`, a.`start_time`, a.`end_time`
FROM `attendance` AS a
JOIN `crew` AS c ON a.`crew_id` = c.`crew_id`;
```

# 문제 11: 특정 크루의 기록 조회 (Subquery)
상황: 서브쿼리를 활용해 '검프'의 기록만 조회

```
SELECT * FROM `attendance` 
WHERE `crew_id` = (SELECT `crew_id` FROM `crew` WHERE `nickname` = '검프');
```

# 문제 12: 전날 가장 늦게 하교한 크루 찾기
상황: 3월 5일, 가장 마지막으로 하교 버튼을 누른 크루 확인

```
SELECT c.`nickname`, a.`end_time`
FROM `attendance` AS a
JOIN `crew` AS c ON a.`crew_id` = c.`crew_id`
WHERE a.`attendance_date` = '2025-03-05'
ORDER BY a.`end_time` DESC
LIMIT 1;
```

# 문제 13~16: 그룹화 및 통계
크루별 출석 기록 횟수:

```
SELECT `crew_id`, COUNT(*) AS `record_count` FROM `attendance` GROUP BY `crew_id`;
```

날짜별 등교 인원수:

```
SELECT `attendance_date`, COUNT(`crew_id`) AS `attendee_count` FROM `attendance` GROUP BY `attendance_date`;
```

크루별 가장 빠른 등교 시각:

```
SQL
SELECT `crew_id`, MIN(`start_time`) AS `earliest_start` FROM `attendance` GROUP BY `crew_id`;
```