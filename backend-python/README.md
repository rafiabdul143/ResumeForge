# ResumeBuilder Python Backend

This is a dependency-free Python backend for the resume builder. It exposes the
same API route used by the React app:

- `POST /api/ai/project-info`
- `GET /health`

## Run

```powershell
python app.py
```

The server listens on `http://127.0.0.1:5258`, matching the existing Vite proxy
configuration in `frontend/vite.config.ts`.

## Example

```powershell
Invoke-WebRequest -UseBasicParsing -Method POST `
  -ContentType "application/json" `
  -Body '{"projectName":"Chat Application"}' `
  http://127.0.0.1:5258/api/ai/project-info
```
