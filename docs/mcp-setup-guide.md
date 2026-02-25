# MCP 서버 연동 가이드

RT-Fact MCP 서버를 Claude Code, Cursor 등 MCP 클라이언트에서 사용하는 방법을 안내합니다.

## 사전 준비

RT-Fact 서비스에 가입한 뒤, 마이페이지에서 API 키를 발급받으세요. 발급된 키는 `rtf_` 로 시작합니다.

## 설정

아래 JSON을 MCP 설정 파일에 추가합니다. `MCP_SERVER_URL`과 `YOUR_API_KEY`를 각각 서비스에서 제공하는 MCP 엔드포인트 주소와 발급받은 키로 교체하세요.

```json
{
  "mcpServers": {
    "rt-fact-mcp": {
      "type": "http",
      "url": "MCP_SERVER_URL",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### 설정 파일 위치

| 클라이언트  | 전역 설정             | 프로젝트 설정                    |
| ----------- | --------------------- | -------------------------------- |
| Claude Code | `~/.claude/.mcp.json` | 프로젝트 루트 `.mcp.json`        |
| Cursor      | `~/.cursor/mcp.json`  | 프로젝트 루트 `.cursor/mcp.json` |

## 연결 확인

설정 후 클라이언트에서 연결 상태를 확인합니다.

**Claude Code**

```bash
# MCP 서버 목록 확인
/mcp
```

`rt-fact-mcp` 항목이 connected 상태로 표시되면 정상입니다.

**Cursor**

설정(Settings) > MCP 탭에서 `rt-fact-mcp`의 상태가 녹색인지 확인합니다.

## 사용 예시

연결이 완료되면 자연어로 팩트체크를 요청할 수 있습니다.

```
"지구는 평평하다"가 사실인지 확인해 줘
```

MCP 서버가 분석 후 검증 결과를 반환합니다.

## 호환성

| 클라이언트     | 지원 여부 | 비고                              |
| -------------- | --------- | --------------------------------- |
| Claude Code    | O         | `type: "http"` + 커스텀 헤더 지원 |
| Cursor         | O         | `type: "http"` + 커스텀 헤더 지원 |
| Claude Desktop | X         | 커스텀 헤더 미지원                |

## 트러블슈팅

### "Failed to connect" 또는 연결 실패

1. API 키가 `rtf_`로 시작하는지 확인
2. `type: "http"` 가 포함되어 있는지 확인 (누락 시 헤더가 전달되지 않음)
3. URL이 올바른 MCP 엔드포인트 경로로 끝나는지 확인 (예: `/mcp/`)

### Claude Code에서 프로젝트 설정이 적용되지 않는 경우

Claude Code는 현재 작업 디렉토리의 `.mcp.json`을 읽습니다. 프로젝트 루트에서 실행했는지 확인하세요.

### API 키가 만료된 경우

마이페이지에서 키를 재발급한 뒤 설정 파일을 업데이트하세요.
